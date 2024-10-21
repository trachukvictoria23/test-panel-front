<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <h2 class="auth-form__heading">Reset your password</h2>
    <p class="auth-form__subheading">Create new password</p>

    <div class="app-input__wrap auth-form__row">
      <label for="password">Password</label>
      <input
        v-model="password.value.value"
        :error-message="password.errorMessage.value"
        name="password"
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

    <div class="app-input__wrap auth-form__row">
      <label for="password_confirmation">Repeat password</label>
      <input
        v-model="password_confirmation.value.value"
        :error-message="password_confirmation.errorMessage.value"
        name="password"
        maxlength="32"
        placeholder="Repeat password"
        type="password"
        :disabled="false"
        class="app-input"
      />
      <span class="app-input__error">
        {{ password_confirmation.errorMessage.value }}
      </span>
    </div>

    <div class="app-input__wrap auth-form__row">
      <button
        class="app-button auth-form__submit"
        type="submit"
        :disabled="loading"
      >
        Update
      </button>
    </div>

    <router-link to="/login" class="color-violet">Back to login</router-link>
  </form>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import { useAuth } from "@/store/auth.js";
import { updatePasswordForm } from "@/config/validation-schemas.js";
import { useToast } from "@/main";
import { useRouter } from "vue-router";
import { ref } from "vue";

const emit = defineEmits(["submitted"]);
const authStore = useAuth();
const router = useRouter();

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const { handleSubmit } = useForm({
  validationSchema: updatePasswordForm,
  initialValues: {
    password: "",
    password_confirmation: "",
  },
});

const loading = ref(false);
const password = useField("password");
const password_confirmation = useField("password_confirmation");

const onSubmit = handleSubmit(async (values, { setErrors }) => {
  loading.value = true;
  await authStore
    .updatePassword({
      email: props.email,
      token: props.token,
      password: values.password,
      password_confirmation: values.password_confirmation,
    })
    .then((res) => {
      if (res.message) useToast(res.message, "success");
      emit("submitted");
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>