
<template>
  <div id="app">
    <app-header v-if="me" />

    <div
      class="app__inner"
      :class="{ 'app__inner--full': route.name === 'chat' || route.name === 'sign-up' }"
    >
      <div v-if="baseStore.loading">Loading</div>
      <router-view />
      <!-- v-if="!loading" -->
    </div>

    <app-footer v-if="me && route.name !== 'chat'" />

    <ModalsContainer />
  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from "vue";

import AppHeader from "@/components/Base/Header.vue";
import AppFooter from "@/components/Base/Footer.vue";

import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/store/auth.js";
import { useBase } from "@/store/base.js";
import { ModalsContainer } from "vue-final-modal";
import "vue-final-modal/style.css";

const route = useRoute();
const router = useRouter();
const authStore = useAuth();
const baseStore = useBase();
const me = computed(() => authStore.me);
const token = ref(localStorage.getItem("token"));
// const loading = ref(token.value ? true : false);

onMounted(async () => {
  if (token.value) {
    await authStore.getMe();
    // setTimeout(() => {
    //   loading.value = false;
    // }, 1000);
  }
});
</script>
