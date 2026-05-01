<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="container">
        <span class="app-header__logo">AI Job Assistant</span>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <slot />
      </div>
    </main>

    <footer class="app-footer">
      <div class="container">
        <p class="app-footer__text">AI Job Assistant &copy; {{ year }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style lang="scss" scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: $color-surface;
  border-bottom: 1px solid $color-border;
  padding-block: $space-4;

  &__logo {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-primary;
  }
}

.app-main {
  flex: 1;
  padding-block: $space-12;
}

.app-footer {
  border-top: 1px solid $color-border;
  padding-block: $space-6;

  &__text {
    font-size: $font-size-sm;
    color: $color-text-muted;
    text-align: center;
  }
}
</style>
