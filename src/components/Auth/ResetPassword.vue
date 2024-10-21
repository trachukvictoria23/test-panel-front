<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <h2 class="auth-form__heading">Reset your password</h2>
    <p class="auth-form__subheading">
      Type in your email and we'll send you a link to reset your password
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
      <button
        class="app-button"
        type="submit"
        :disabled="loading"
      >
        Reset
      </button>
    </div>

    <router-link to="/login" class="color-violet">Back to login</router-link>
  </form>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import { useAuth } from "@/store/auth.js";
import { resetPasswordForm } from "@/config/validation-schemas.js";
import { useToast } from "@/main"
import { useRouter } from "vue-router";
import { ref } from "vue";

const authStore = useAuth();
const router = useRouter();

const { handleSubmit } = useForm({
  validationSchema: resetPasswordForm,
  initialValues: {
    email: "some@some.com",
    // email: "",
  },
});

const email = useField("email");
const loading = ref(false);

const onSubmit = handleSubmit(async (values, { setErrors }) => {
  loading.value = true;
  await authStore
    .resetPassword({
      email: values.email,
    })
    .then((res) => {
      if (res.message) useToast(res.message, "success");
      email.value.value = "";
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>