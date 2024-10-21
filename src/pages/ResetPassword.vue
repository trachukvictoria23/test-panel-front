
<template>
  <div class="auth">
    <div class="auth-form auth-form-request" v-if="passwordUpdated">
      <p class="ta-center">Your password has been updated!</p>

      <router-link to="/login">
        <button class="app-button">Log in</button>
      </router-link>
    </div>

    <UpdateNewPassword
      v-else-if="email && token"
      :email="email"
      :token="token"
      @submitted="passwordUpdated = true"
    />

    <ResetPassword v-else />
  </div>
</template>

<script setup>
import ResetPassword from "@/components/Auth/ResetPassword.vue";
import UpdateNewPassword from "@/components/Auth/UpdateNewPassword.vue";
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();

const email = ref(route.query.email);
const token = ref(route.query.token);
const passwordUpdated = ref(false);
</script>

<style lang="scss">
@import "@/assets/scss/auth.scss";
</style>