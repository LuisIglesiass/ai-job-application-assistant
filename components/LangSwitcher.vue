<template>
  <div class="lang-switcher" role="group" aria-label="Interface language">
    <button
      v-for="option in options"
      :key="option.value"
      class="lang-switcher__btn"
      :class="{ 'lang-switcher__btn--active': locale === option.value }"
      type="button"
      @click="locale = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { locale } = useI18n()

const options = [
  { value: 'en' as const, label: 'EN' },
  { value: 'es' as const, label: 'ES' },
  { value: 'de' as const, label: 'DE' },
  { value: 'pt' as const, label: 'PT' },
]
</script>

<style lang="scss" scoped>
.lang-switcher {
  display: flex;
  align-items: center;
  gap: 2px;
  background: $color-bg;
  border: 1px solid $color-border;
  border-radius: $border-radius-base;
  padding: 3px;

  &__btn {
    padding: 3px 10px;
    border: none;
    border-radius: 6px;
    background: transparent;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-muted;
    cursor: pointer;
    transition: color $transition-base, background $transition-base;
    letter-spacing: 0.03em;

    &:hover:not(&--active) {
      color: $color-text;
      background: $color-surface;
    }

    &--active {
      background: $color-surface;
      color: $color-primary;
      box-shadow: $shadow-sm;
    }
  }
}
</style>
