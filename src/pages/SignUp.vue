
<template>
  <div class="auth">
    <CheckEmail v-if="email" :email="email"/>
    <SignUpForm v-else @submitted="submitForm" />
  </div>
</template>

<script setup>
import SignUpForm from "@/components/Auth/SignUpForm.vue";
import CheckEmail from "@/components/Auth/CheckEmail.vue";

import { ref } from "vue";
const email = ref("");

const submitForm = ({ email: _email }) => {
  email.value = _email;
};
</script>

<style lang="scss">
@import "@/assets/scss/auth.scss";
</style>