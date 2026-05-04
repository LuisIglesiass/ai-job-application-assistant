<template>
  <div class="tracker-empty">
    <div class="tracker-empty__icon" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="6" width="32" height="38" rx="4" fill="currentColor" opacity="0.08"/>
        <rect x="8" y="6" width="32" height="38" rx="4" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
        <line x1="16" y1="17" x2="32" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
        <line x1="16" y1="24" x2="28" y2="24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
        <line x1="16" y1="31" x2="24" y2="31" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
        <circle cx="35" cy="35" r="8" fill="var(--color-bg)" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
        <line x1="35" y1="32" x2="35" y2="38" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
        <line x1="32" y1="35" x2="38" y2="35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
      </svg>
    </div>
    <p class="tracker-empty__title">{{ title }}</p>
    <p class="tracker-empty__text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; text: string }>()
</script>

<style lang="scss" scoped>
.tracker-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-3;
  padding: $space-12 $space-4;
  text-align: center;

  &__icon {
    color: var(--color-text-muted);
    opacity: 0.6;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: var(--color-text);
  }

  &__text {
    font-size: $font-size-sm;
    color: var(--color-text-muted);
    max-width: 36ch;
    line-height: 1.65;
  }
}
</style>
