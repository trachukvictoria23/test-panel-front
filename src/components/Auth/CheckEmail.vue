<template>
  <div class="auth-form check-email">
    <h2 class="auth-form__heading">Check your email!</h2>
    <p>
      We send confirmation link to your email address
      <span class="check-email__address">{{ email }}</span>
    </p>
    <p>If you didn't receive it, click to resend button!</p>
    <div class="check-email__buttons">
      <button
        class="app-button check-email__resend"
        :disabled="loading"
        @click="resendLink"
      >
        Resend link
      </button>
      <button
        class="app-button check-email__back"
        @click="router.push({ name: 'login' })"
      >
        Back to login
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/store/auth.js";
import { useToast } from "@/main"

const authStore = useAuth();
const router = useRouter();
const loading = ref(false);
const resendAccess = ref(true);

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
});

const resendLink = async () => {
  if (!resendAccess.value)
    return useToast("Try again after 60 seconds!", "warning");
  loading.value = true;
  await authStore
    .resendLink({ email: props.email })
    .then((res) => {
      if (res.message) useToast(res.message, "success");
      resendAccess.value = false;
      setTimeout(() => {
        resendAccess.value = true;
      }, 60 * 1000);
    })
    .finally(() => (loading.value = false));
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/auth.scss";
.check-email {
  text-align: center;

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
  }

  &__address {
    text-decoration: underline;
    color: $color-violet;
  }
}
</style>