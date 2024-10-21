<template>
  <div v-if="chat" class="chat">
    <div class="chat__head">
      <div
        class="chat__head-fullname"
        @click="router.push(`/user/${chat.from?._id}`)"
      >
        <div class="chat__head-avatar">
          <img v-if="chat.from?.avatar" :src="`${chat?.from.avatar}`" />
          <img
            v-else
            src="/img/default_avatar.svg"
            class="chat__head-avatar--default"
          />

          <div
            class="chat__head-indicator"
            :class="{ 'chat__head-indicator--online': isUserOnline }"
          >
            {{ isUserOnline ? "Online" : "Offline" }}
          </div>
        </div>

        <div style="padding-top: 4px">
          <p class="capitalize">{{ chat.from?.full_name }}</p>
          <p class="color-secondary">{{ chat.from?.email }}</p>
        </div>
      </div>
    </div>

    <div class="chat__body">
      <ul class="chat__messages">
        <button class="app-button chat__load-more" @click="filters.page += 1">
          Load more
        </button>
        <ChatMessage
          v-for="(message, i) in messages"
          :key="i"
          :message="message"
        />
      </ul>

      <div class="chat__actions">
        <p v-if="userActivity" class="chat__actions-activity">
          <span class="capitalize">{{ chat.from?.full_name }}</span> is
          typing...
        </p>
        <button
          v-bind="getRootProps()"
          :disabled="uploading"
          class="chat__actions-attach"
          @click="uploadFiles"
        >
          <img src="/img/attach-doc.svg" />
        </button>
        <input v-bind="getInputProps()" />
        <textarea
          v-model="text"
          name="text"
          class="app-input chat__actions-input"
          @keypress="emitActivity"
          @keydown.enter="keyDownEnter"
        ></textarea>
        <button class="chat__actions-send" @click="sendMessage()">
          <send-icon />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch } from "vue";
import { io } from "socket.io-client";
import { useRoute, useRouter } from "vue-router";
import { useChats } from "@/store/chats.js";
import SendIcon from "@/assets/icons/send.vue";
import ChatMessage from "@/components/ChatMessage.vue";
import { useToast } from "@/main";

// import heic2any from "heic2any";
import { useDropzone } from "vue3-dropzone";

const route = useRoute();
const router = useRouter();
const chatsStore = useChats();

const chat = ref({});
const messages = ref([]);
const text = ref("");
const filters = ref({
  per_page: 10,
  page: 1,
  // status: statusOptions[0],
  // search: refDebounced(search, 1000),
});
const userActivity = ref(false);
const isUserOnline = ref(false);
const uploading = ref(false);

watch(filters.value, () => {
  getMessages();
});

const allowedFormats =
  ".pdf,.jpeg,.jpg,.png,.svg,.gif,.heic,.docx,.docx,.txt,.mp3";
const allowedFileSize = 10; // 10 MB
const maxCountFiles = 3;

const { getRootProps, getInputProps, ...rest } = useDropzone({
  onDrop,
  accept: allowedFormats,
  maxFiles: maxCountFiles,
  maxSize: allowedFileSize * 1024 * 1024,
  //   multiple: props.multiple,
  //   noClick: props.noClick,
  //   disabled: props.disabled,
});

function onDrop(acceptFiles, rejectReasons) {
  const errorMessages = {
    "too-many-files": "Too many files",
    "file-too-large": `File Size Limit is ${allowedFileSize}MB`,
    "file-invalid-type": "The file type is incorrect",
  };

  if (acceptFiles?.length) {
    acceptFiles.forEach(sendMessage);
  }
  if (rejectReasons?.length) {
    rejectReasons[0].errors.forEach((error) => {
      if (errorMessages[error.code]) {
        error.message = errorMessages[error.code];
        console.log("reject reason", error.message);
        useToast(error.message, "error");
      }
    });
  }
}

onMounted(() => {
  chatsStore
    .getChat(route.params.id)
    .then(async (data) => {
      chat.value = data;
      await getMessages();
      if (messages.value.length)
        scrollToMessageById(messages.value[messages.value.length - 1]._id);

      socket.emit("check_user_connect");
    })
    .catch(() => router.push("/chats"));
});

const socket = io("ws://localhost:3001", {
  path: `/app/${import.meta.env.VITE_SOCKET_KEY}`,
  reconnectionDelayMax: 10000,
  // autoConnect: false, // need to connect socket.connect()
  auth: {
    chat_id: route.params.id,
    token: localStorage.getItem("token"),
  },
});

const keyDownEnter = (event) => {
  if (!event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const emitActivity = () => {
  socket.emit("activity");
};

const sendMessage = async (file) => {
  // if (file && file.name.toLowerCase().includes(".heic")) {
  //   const name = file.name.split(".heic")[0];
  //   const originalSize = Number((file.size / (1024 * 1024)).toFixed(2));
  //   file = await heic2any({
  //     blob: file,
  //     toType: "image/jpeg",
  //     quality: originalSize > 15 ? 0.3 : 0.6,
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  //   file.fileName = name + ".jpeg";
  // }

  await chatsStore
    .sendMessage({
      message: text.value,
      file,
    })
    .then((message) => {
      // console.log("good send", message);
      socket.emit("message", message);
      if (!message.attachment) text.value = "";
    });
};
const getMessages = async () => {
  await chatsStore
    .getMessages({
      per_page: filters.value.per_page,
      page: filters.value.page,
    })
    .then((data) => {
      messages.value.unshift(...data.reverse());
    });
};

socket.on("message", (data) => {
  userActivity.value = false;
  messages.value.push(data);
  scrollToMessageById(data._id);
});

// socket.on("connected", () => {
//   // useToast(`${chat.value.from?.full_name} joined to chat!`, "success");
//   isUserOnline.value = true;
// });

socket.on("check_user_connect", () => {
  socket.emit("confirm_user_connect");
  // useToast(`${chat.value.from?.full_name} joined to chat!`, "success");
  // isUserOnline.value = true;
});

socket.on("confirm_user_connect", () => {
  // useToast(`${chat.value.from?.full_name} joined to chat!`, "success");
  isUserOnline.value = true;
});

socket.on("disconnected", () => {
  // useToast(`${chat.value.from?.full_name} left the chat!`, "warning");
  isUserOnline.value = false;
});

onBeforeUnmount(() => {
  socket.disconnect();
});

let activityTimer;
socket.on("activity", () => {
  userActivity.value = true;
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    userActivity.value = false;
  }, 2000);
});

const scrollToMessageById = (id) => {
  setTimeout(() => {
    const el = document.querySelector(`#message-${id}`);
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};
</script>

<style lang="scss" scoped>
.chat {
  &__head {
    padding-bottom: 10px;
    border-bottom: 1px solid $default-border-color;
    padding: $app-padding-xs;

    &-fullname {
      display: flex;
      // align-items: center;
      cursor: pointer;
      width: fit-content;
    }

    &-avatar {
      position: relative;
      margin-right: 10px;

      img {
        width: 64px;
        height: 64px;
        border-radius: 100%;
        // border: 1px solid $default-border-color;
        object-fit: cover;
        // display: flex;
        border: 1px solid;
      }

      &--default img {
        border-color: $secondary-text-color;
      }
    }

    &-indicator {
      position: absolute;
      background: $secondary-text-color;

      padding: 2px;
      font-size: 10px;
      border-radius: 4px;
      color: white;
      right: -38%;
      bottom: 4px;

      &--online {
        background: $color-success;
      }
    }
  }

  &__body {
    height: calc(100vh - 110px - 90px);
    display: flex;
    flex-direction: column;
  }

  &__messages {
    display: flex;
    flex-direction: column;
    padding: $app-padding-xs;
    padding-top: 0;
    overflow: scroll;
    gap: 24px;
    margin-top: 0;
  }

  &__actions {
    padding: $app-padding-xs;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    min-height: fit-content;
    margin-top: auto;
    position: relative;

    &-attach {
      padding: 0;
      width: 40px;
      height: 64px;
      border: none;
      background: none;
      cursor: pointer;

      &:hover img {
        opacity: 0.75;
      }

      img {
        width: 40px;
      }
    }

    &-activity {
      position: absolute;
      top: 2px;
      left: calc(40px + 16px + 20px);
      font-size: 14px;
    }

    &-input {
      min-height: 64px;
      width: 100%;
      padding: 8px;
      border-radius: 8px;
    }

    &-send {
      width: 64px;
      height: 64px;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $button-background;
      border: 1px solid $color-violet;
      transition: all 0.1s;

      svg {
        width: 48px;
        height: 48px;
      }

      &:hover:not(:disabled) {
        cursor: pointer;
        background: $color-violet;
        color: white;
      }
    }
  }

  &__load-more {
    width: fit-content;
    margin: 20px auto;
    padding: 0 24px;
  }
}
</style>