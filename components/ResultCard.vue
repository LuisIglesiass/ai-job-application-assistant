<template>
  <div class="result-card">
    <div class="result-card__header">
      <div class="result-card__title-group">
        <span class="result-card__icon" aria-hidden="true">✉</span>
        <h3 class="result-card__title">{{ title }}</h3>
      </div>
      <slot name="actions" />
    </div>
    <div class="result-card__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style lang="scss" scoped>
.result-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-base;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-3 $space-4;
    background: $gradient-subtle;
    border-bottom: 1px solid $color-border;

    @media (min-width: $bp-mobile) { padding: $space-4 $space-6; }
  }

  &__title-group {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  &__icon {
    font-size: $font-size-base;
    opacity: 0.6;
  }

  &__title {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text;
    letter-spacing: -0.01em;
  }

  &__body {
    padding: $space-4;

    @media (min-width: $bp-mobile) { padding: $space-6; }
    @media (min-width: $bp-tablet) { padding: $space-8; }
  }
}
</style>
