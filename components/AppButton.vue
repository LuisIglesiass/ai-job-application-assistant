<template>
  <button
    class="app-button"
    :class="[`app-button--${variant}`, { 'app-button--loading': loading }]"
    :disabled="disabled || loading"
    :type="type"
    v-bind="$attrs"
  >
    <span v-if="loading" class="app-button__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
})
</script>

<style lang="scss" scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  padding: $space-3 $space-6;
  border: none;
  border-radius: $border-radius-base;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: background-color $transition-base, opacity $transition-base;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--primary {
    background-color: $color-primary;
    color: #fff;

    &:hover:not(:disabled) {
      background-color: $color-primary-hover;
    }
  }

  &--secondary {
    background-color: transparent;
    color: $color-primary;
    border: 1px solid $color-primary;

    &:hover:not(:disabled) {
      background-color: rgba($color-primary, 0.05);
    }
  }

  &__spinner {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
