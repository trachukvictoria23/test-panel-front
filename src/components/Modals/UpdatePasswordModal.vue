<template>
  <VueFinalModal overlay-transition="vfm-fade" content-class="app-modal">
    <form class="auth-form app-modal__inner" @submit.prevent="onSubmit">
      <button class="app-modal__close" @click="emit('close')">
        <img src="/img/close.svg" />
      </button>
      <h2 class="auth-form__heading">Update your password</h2>

      <div class="app-input__wrap auth-form__row">
        <label for="current_password">Current password</label>
        <input
          v-model="current_password.value.value"
          :error-message="current_password.errorMessage.value"
          name="current_password"
          maxlength="32"
          placeholder="Enter Password"
          type="password"
          :disabled="false"
          class="app-input"
        />
        <span class="app-input__error">
          {{ current_password.errorMessage.value }}
        </span>
      </div>

      <div class="app-input__wrap auth-form__row">
        <label for="password">New password</label>
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
    </form>
  </VueFinalModal>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import { useProfile } from "@/store/profile.js";
import { profilePasswordForm } from "@/config/validation-schemas.js";
import { useToast } from "@/main";
import { ref, computed } from "vue";
import { VueFinalModal } from "vue-final-modal";
import { useAuth } from "@/store/auth.js";

const emit = defineEmits(["close"]);
const profileStore = useProfile();
const authStore = useAuth();

const { handleSubmit } = useForm({
  validationSchema: profilePasswordForm,
  initialValues: {
    current_password: "",
    password: "",
    password_confirmation: "",
  },
});

const loading = ref(false);
const password = useField("password");
const current_password = useField("current_password");
const password_confirmation = useField("password_confirmation");
const me = computed(() => authStore.me);

const onSubmit = handleSubmit(async (values, { setErrors }) => {
  loading.value = true;
  await profileStore
    .updatePassword({
      current_password: values.current_password,
      password: values.password,
      password_confirmation: values.password_confirmation,
    })
    .then((res) => {
      if (res.message) useToast(res.message, "success");
      emit("close");
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>