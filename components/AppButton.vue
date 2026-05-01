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
  padding: $space-3 $space-8;
  border: none;
  border-radius: $border-radius-base;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: opacity $transition-base, transform $transition-base, box-shadow $transition-base;
  letter-spacing: -0.01em;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0;
    transition: opacity $transition-base;
  }

  &:hover::after { opacity: 1; }

  &:active { transform: scale(0.98); }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }

  &--primary {
    background: $gradient-brand;
    color: #fff;
    box-shadow: 0 2px 12px rgba(79, 70, 229, 0.35);

    &:hover:not(:disabled) {
      box-shadow: 0 4px 20px rgba(79, 70, 229, 0.45);
    }
  }

  &--secondary {
    background: transparent;
    color: $color-primary;
    border: 1.5px solid rgba($color-primary, 0.35);
    box-shadow: none;

    &:hover:not(:disabled) {
      background: $color-primary-light;
      border-color: $color-primary;
    }
  }

  &--loading { pointer-events: none; }

  &__spinner {
    width: 1em;
    height: 1em;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
