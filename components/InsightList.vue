<template>
  <div class="insight-list" :class="`insight-list--${variant}`">
    <div class="insight-list__header">
      <span class="insight-list__icon" aria-hidden="true">{{ variant === 'strength' ? '↑' : '↓' }}</span>
      <h3 class="insight-list__title">{{ title }}</h3>
    </div>
    <ul class="insight-list__items">
      <li v-for="(item, i) in items" :key="i" class="insight-list__item">
        <span class="insight-list__bullet" aria-hidden="true" />
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  items: string[]
  variant: 'strength' | 'weakness'
}>()
</script>

<style lang="scss" scoped>
.insight-list {
  padding: $space-4;

  @media (min-width: $bp-mobile) { padding: $space-6; }
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: $border-radius-lg;
  box-shadow: var(--shadow-sm);
  border-top: 3px solid transparent;

  &--strength { border-top-color: $color-success; }
  &--weakness { border-top-color: $color-error; }

  &__header {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-bottom: $space-4;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: $font-weight-bold;
    flex-shrink: 0;

    .insight-list--strength & {
      background: var(--color-success-bg);
      color: $color-success;
    }
    .insight-list--weakness & {
      background: var(--color-danger-bg);
      color: $color-error;
    }
  }

  &__title {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: var(--color-text);
    letter-spacing: -0.01em;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: $space-3;
    font-size: $font-size-sm;
    color: var(--color-text-muted);
    line-height: $line-height-base;
  }

  &__bullet {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 0.45em;

    .insight-list--strength & { background: $color-success; }
    .insight-list--weakness & { background: $color-error; }
  }
}
</style>
