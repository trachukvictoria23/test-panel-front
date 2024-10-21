<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <h2 class="auth-form__heading">Log in</h2>
    <p class="auth-form__subheading">
      If you don't have an account
      <router-link to="/sign-up" class="color-violet">Sign up</router-link>
    </p>
    <div class="app-input__wrap auth-form__row">
      <label for="email">Email</label>
      <input
        v-model.trim="email.value.value"
        :error-message="email.errorMessage.value"
        name="email"
        type="text"
        maxlength="255"
        placeholder="Enter email"
        :disabled="false"
        class="app-input"
      />
      <span class="app-input__error">
        {{ email.errorMessage.value }}
      </span>
    </div>

    <div class="app-input__wrap auth-form__row">
      <label for="password">Password</label>
      <input
        v-model="password.value.value"
        :error-message="password.errorMessage.value"
        maxlength="32"
        placeholder="Enter Password"
        type="password"
        :disabled="false"
        class="app-input"
      />
      <span class="app-input__error">
        {{ password.errorMessage.value }}
      </span>
    </div>

    <router-link to="/reset-password" class="app-input__wrap auth-form__row"
      >Forgot your password</router-link
    >

    <div class="auth-form__row auth-form__buttons">
      <button
        class="app-button"
        type="submit"
        :disabled="loading"
      >
        Log in
      </button>
    </div>
  </form>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import { useAuth } from "@/store/auth.js";
import { loginForm } from "@/config/validation-schemas.js";

import { useRouter } from "vue-router";
import { ref } from "vue";

const authStore = useAuth();
const router = useRouter();

const { handleSubmit } = useForm({
  validationSchema: loginForm,
  initialValues: {
    email: "newuser1@mail.com",
    password: "ktjgfhl1",
  },
});

const email = useField("email");
const password = useField("password");

const passwordShow = ref(false);
const loading = ref(false);

const onSubmit = handleSubmit(async (values, { setErrors }) => {
  loading.value = true;
  await authStore
    .login({
      email: values.email,
      password: values.password,
    })
    .then(async ({ token }) => {
      localStorage.setItem("token", token);
      await authStore.getMe().then((res) => {
        router.push({ name: "home" });
      });
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>