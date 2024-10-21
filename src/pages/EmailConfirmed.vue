<template>
  <div class="auth">
    <div class="auth-form auth-form-request">
      <p class="ta-center">
        Your email confirmed! <br />
        Now you can login to your account!
      </p>

      <router-link to="/login">
        <button class="app-button">Log in</button>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/auth.scss";
</style>