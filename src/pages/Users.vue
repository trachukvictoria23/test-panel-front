<template>
  <div class="users">
    <div class="users__filters">
      <div class="app-input__wrap">
        <label for="search">Search</label>
        <input
          v-model.trim="search"
          type="text"
          name="search"
          maxlength="255"
          placeholder="Type something . . ."
          :disabled="false"
          class="app-input"
          style="padding-left: 32px"
          @update:model-value="filters.page = 1"
        />
        <img src="/img/search.svg" class="app-input__icon" />
        <img
          v-if="search"
          src="/img/close.svg"
          class="app-input__icon app-input__icon-clear"
          @click="
            search = '';
            filters.search = '';
          "
        />
      </div>

      <div class="app-input__wrap">
        <label for="search">Status</label>
        <VueMultiselect
          v-model="filters.status"
          label="name"
          track-by="code"
          :searchable="false"
          :clear-on-select="false"
          :options="statusOptions"
          @update:model-value="filters.page = 1"
        />
      </div>
    </div>

    <div class="users__list">
      <div class="users__list-row users__list-head">
        <div v-for="col in headNames" :key="col.key" class="users__list-col">
          <p @click="updateSorting(col.key)">
            {{ col.name }}
          </p>

          <button
            v-if="col.sortable && col.key === filters.sorting.field"
            class="users__list-sort"
            :class="{
              'rotate-180':
                (filters.sorting.direction === 1 && col.key === 'createdAt') ||
                (filters.sorting.direction === -1 && col.key !== 'createdAt'),
            }"
            @click="updateSorting(col.key)"
          >
            <img src="/img/arrow_up.svg" />
          </button>
        </div>
      </div>

      <div class="users__list-view">
        <template v-if="users.length">
          <a
            v-for="user in users"
            :key="user.id"
            :href="`/user/${user._id}`"
            class="users__list-row users__item"
          >
            <div class="users__item-fullname">
              <img v-if="user.avatar" :src="`${user.avatar}`" />
              <img v-else src="/img/default_avatar.svg" />
              <p>{{ user.full_name }}</p>
            </div>
            <p>{{ user.email }}</p>
            <p
              :class="`${user.is_verified ? 'color-success' : 'color-danger'}`"
            >
              {{ user.is_verified ? "Verified" : "Not verified" }}
            </p>
            <p>{{ dayjs(user.createdAt).format("DD.MM.YYYY HH:mm") }}</p>
          </a>

          <div class="users__list-pagination">
            <vue-awesome-paginate
              v-model="filters.page"
              :total-items="total_users"
              :items-per-page="filters.per_page"
              :max-pages-shown="5"
              pagination-container-class="app-pagination"
              paginate-buttons-class="app-pagination__button"
              active-page-class="app-pagination__button--active"
            />
            <p class="">Total users count: {{ total_users }}</p>
          </div>
        </template>

        <template v-else>
          <p class="users__list--empty">No data found</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useUsers } from "@/store/users.js";
import dayjs from "dayjs";
import { refDebounced } from "@vueuse/core";
import VueMultiselect from "vue-multiselect";

import { provide } from "vue";

provide("message", "привет!");

const headNames = [
  {
    name: "Full name",
    key: "first_name",
    sortable: true,
  },
  {
    name: "E-mail",
    key: "email",
    sortable: true,
  },
  {
    name: "Status",
    key: "is_verified",
    sortable: true,
  },
  {
    name: "Created date",
    key: "createdAt",
    sortable: true,
  },
];

const statusOptions = [
  {
    code: 0,
    name: "All",
  },
  {
    code: 1,
    name: "Not verified",
  },
  {
    code: 2,
    name: "Verified",
  },
];

const search = ref("");
// const searchDebounced = refDebounced(search, 1000);
const usersStore = useUsers();
const users = ref([]);
const filters = ref({
  per_page: 5,
  page: 1,
  status: statusOptions[0],
  search: refDebounced(search, 1000),
  sorting: {
    field: "createdAt",
    direction: -1,
  },
});
const total_users = ref(0);

// watch(searchDebounced, () => {
//   filters.value.search = searchDebounced.value;
//   filters.value.page = 1;
// });

watch(filters.value, () => {
  getUsersList();
});

const updateSorting = (field) => {
  if (field === filters.value.sorting.field) {
    filters.value.sorting.direction *= -1;
  } else {
    filters.value.sorting = {
      field,
      direction: field === "createdAt" ? -1 : 1,
    };
  }

  filters.value.page = 1;

  // console.log("updateSorting", filters.value.sorting);
};

const getUsersList = async () => {
  console.log("sort", filters.value.sorting);
  await usersStore
    .getUsers({
      per_page: filters.value.per_page,
      page: filters.value.page,
      search: filters.value.search,
      status: filters.value.status.code
        ? Boolean(filters.value.status.code - 1)
        : undefined,
      sort_field: filters.value.sorting.field,
      sort_direction: filters.value.sorting.direction,
    })
    .then(({ total, data }) => {
      console.log("update list", total, data);
      total_users.value = total;
      users.value = data;
    })
    .catch((error) => {
      console.log("users error", error);
    });
};

onMounted(() => getUsersList());
</script>

<style lang="scss" scoped>
.users {
  .app-input__wrap {
    padding-bottom: 0;
  }

  &__filters {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 10px;
    align-items: center;
    padding: 20px 0;
  }

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
      grid-template-columns: repeat(4, 1fr);
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