<template>
  <div class="chats">
    <div></div>

    <div class="chats__list">
      <div class="chats__list-row chats__list-head">
        <div v-for="col in headNames" :key="col.key" class="chats__list-col">
          <p>
            <!-- @click="updateSorting(col.key)" -->
            {{ col.name }}
          </p>

          <!-- <button
            v-if="col.sortable && col.key === filters.sorting.field"
            class="chats__list-sort"
            :class="{
              'rotate-180':
                (filters.sorting.direction === 1 && col.key === 'createdAt') ||
                (filters.sorting.direction === -1 && col.key !== 'createdAt'),
            }"
            @click="updateSorting(col.key)"
          >
            <img src="/img/arrow_up.svg" />
          </button> -->
        </div>
      </div>

      <div class="chats__list-view">
        <template v-if="chats.length">
          <a
            v-for="chat in chats"
            :key="chat.id"
            :href="`/chat/${chat._id}`"
            class="chats__list-row chats__item"
          >
            <div class="chats__item-fullname">
              <img v-if="chat.from.avatar" :src="`${chat.from.avatar}`" />
              <img v-else src="/img/default_avatar.svg" />
              <p>{{ chat.from.full_name }}</p>
            </div>
            <p
              class="chats__item-message"
              :class="{ 'color-secondary': !chat.message?.message }"
            >
              <img v-if="chat.message?.attachment" src="/img/attach.svg" />
              {{ setChatMessage(chat.message) }}
            </p>
            <p>{{ !chat.type ? "General" : "" }}</p>
            <p>{{ setDate(chat.updatedAt) }}</p>
          </a>

          <!-- <div class="chats__list-pagination">
            <vue-awesome-paginate
              v-model="filters.page"
              :total-items="total_chats"
              :items-per-page="filters.per_page"
              :max-pages-shown="5"
              pagination-container-class="app-pagination"
              paginate-buttons-class="app-pagination__button"
              active-page-class="app-pagination__button--active"
            />
            <p class="">Total chats count: {{ total_chats }}</p>
          </div> -->
        </template>

        <template v-else>
          <p class="chats__list--empty">No data found</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useChats } from "@/store/chats.js";
import { refDebounced } from "@vueuse/core";
import VueMultiselect from "vue-multiselect";
import { setFileName, setDate } from "@/tools/helpers/formatChatData.js";

const total_chats = ref(0);
const chats = ref([]);

const headNames = [
  {
    name: "Full name",
    key: "first_name",
    sortable: true,
  },
  {
    name: "Message",
    key: "last_message",
    sortable: false,
  },
  {
    name: "Type",
    key: "type",
    sortable: true,
  },
  {
    name: "Update date",
    key: "updatedAt",
    sortable: true,
  },
];

const chatsStore = useChats();

const setChatMessage = (message) => {
  const text = message.message;
  if (!text) return "Chat created.";
  if (message.attachment) return setFileName(text);

  if (text.length > 32) return text.slice(0, 32) + "...";
  return text;
};

const getChatsList = async () => {
  await chatsStore
    .getChats({
      //   per_page: filters.value.per_page,
      //   page: filters.value.page,
      //   search: filters.value.search,
      //   status: filters.value.status.code
      //     ? Boolean(filters.value.status.code - 1)
      //     : undefined,
      //   sort_field: filters.value.sorting.field,
      //   sort_direction: filters.value.sorting.direction,
    })
    .then(({ total, data }) => {
      // console.log("update list", total, data);
      total_chats.value = total;
      chats.value = data;
    })
    .catch((error) => {
      console.log("chats error", error);
    });
};

onMounted(() => getChatsList());
</script>

<style lang="scss" scoped>
.chats {
  &__list {
    border: 1px solid $default-border-color;
    border-radius: $default-border-radius;

    &-sort {
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
      height: 20px;
      width: 20px;
      transition: transform 0.1s;

      img {
        width: 100%;
      }
    }

    &-row,
    &-pagination {
      padding: 10px;
    }

    &-row {
      display: grid;
      // grid-template-columns: repeat(4, 1fr);
      grid-template-columns: 25% 40% 20% 15%;
      align-items: center;
      color: $default-text-color;
      text-decoration: none;

      &:not(:last-child) {
        border-bottom: 1px solid $default-border-color;
      }
    }

    &-pagination {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &-head {
      background: $default-border-color;
      border-radius: $default-border-radius $default-border-radius 0 0;
    }

    &--empty {
      padding: 10px;
      text-align: center;
    }

    &-view {
    }

    &-col {
      display: flex;
      align-items: center;
      cursor: pointer;
      width: fit-content;
    }
  }

  &__item {
    &:hover {
      cursor: pointer;
      background: rgba(235, 235, 235, 0.4);
    }

    &-message {
      display: flex;

      img {
        margin-right: 4px;
        width: 20px;
      }
    }

    &-fullname {
      display: flex;
      align-items: center;

      img {
        width: 32px;
        height: 32px;
        border-radius: 100%;
        // border: 1px solid $default-border-color;
        object-fit: cover;
        margin-right: 10px;
      }
    }
  }
}
</style>