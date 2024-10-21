<template>
  <div v-if="user && me" class="user">
    <div class="user__avatar">
      <img v-if="user.avatar" :src="user.avatar" />
      <img v-else src="/img/default_avatar.svg" />
    </div>
    <h2 class="user__name">
      {{ user.full_name }}
    </h2>
    <p class="user__email">
      {{ user.email }}
    </p>
    <p class="user__status">
      Status:
      <span :class="`${user.is_verified ? 'color-success' : 'color-danger'}`">{{
        user.is_verified ? "Verified" : "Not verified"
      }}</span>
    </p>
    <p class="user__role">
      Role: <span>{{ user.role ? "admin" : "user" }}</span>
    </p>
    <p class="user__registration">
      Registered:
      <span> {{ dayjs(user.createdAt).format("DD.MM.YYYY HH:mm") }} </span>
    </p>
    <div class="user__actions">
      <button
        v-if="user._id !== me._id && user.is_verified"
        class="user__action"
        @click="initChat"
      >
        <img src="/img/chat.svg" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUsers } from "@/store/users.js";
import { useChats } from "@/store/chats.js";
import { useAuth } from "@/store/auth.js";
import dayjs from "dayjs";

const usersStore = useUsers();
const chatsStore = useChats();
const route = useRoute();
const router = useRouter();
const user = ref({});
const authStore = useAuth();

const me = computed(() => authStore.me);

onMounted(() => {
  usersStore
    .getUser(route.params.id)
    .then((data) => (user.value = data))
    .catch(() => router.push("/users"));
});

const initChat = async () => {
  await chatsStore
    .initChat({
      to_id: user.value._id,
    })
    .then((chat) => {
      if (chat?._id) router.push(`/chat/${chat._id}`);
    });
};
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 20px;

  &__avatar img {
    width: 128px;
    height: 128px;
    border-radius: 100%;
    object-fit: cover;
  }

  &__name {
    font-size: 32px;
  }

  &__email {
  }

  &__role {
  }

  &__registration {
    span {
      text-decoration: underline;
    }
  }

  &__action {
    border: none;
    cursor: pointer;
    background: none;

    img {
      width: 40px;
    }
  }
}
</style>