<template>
  <div class="tracker-filters" role="tablist" :aria-label="t('tracker_filter_all')">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      role="tab"
      class="tracker-filters__tab"
      :class="{ 'tracker-filters__tab--active': modelValue === tab.key }"
      :aria-selected="modelValue === tab.key"
      @click="$emit('update:modelValue', tab.key)"
    >
      {{ tab.label }}
      <span class="tracker-filters__count">{{ tab.count }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ApplicationStatus } from '../types'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  modelValue: ApplicationStatus | 'all'
  counts: { all: number; applied: number; interview: number; offer: number; rejected: number }
}>()

defineEmits<{ 'update:modelValue': [value: ApplicationStatus | 'all'] }>()

const { t } = useI18n()

const tabs = computed(() => [
  { key: 'all'       as const, label: t('tracker_filter_all'), count: props.counts.all },
  { key: 'applied'   as const, label: t('status_applied'),     count: props.counts.applied },
  { key: 'interview' as const, label: t('status_interview'),   count: props.counts.interview },
  { key: 'offer'     as const, label: t('status_offer'),       count: props.counts.offer },
  { key: 'rejected'  as const, label: t('status_rejected'),    count: props.counts.rejected },
])
</script>

<style lang="scss" scoped>
.tracker-filters {
  display: flex;
  gap: 2px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: $border-radius-base;
  padding: 3px;
  overflow: hidden; // no scroll — tabs fill the row
}

.tracker-filters__tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  flex: 1;           // equal width, no shrink limit
  min-width: 0;      // allow shrinking below content size
  padding: 6px 2px;
  border: none;
  border-radius: 5px;
  background: transparent;
  font-size: 0.65rem;
  font-weight: $font-weight-medium;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color $transition-base, background $transition-base;

  @media (min-width: $bp-mobile) {
    flex-direction: row;
    gap: $space-2;
    padding: 7px 14px;
    font-size: $font-size-sm;
  }

  &:hover:not(&--active) {
    color: var(--color-text);
    background: var(--color-surface-2, rgba(0,0,0,0.04));
  }

  &--active {
    background: $gradient-brand;
    color: #fff;
    font-weight: $font-weight-semibold;
  }
}

.tracker-filters__count {
  font-size: 0.75rem;
  font-weight: $font-weight-bold;
  line-height: 1;
  opacity: 0.8;

  @media (min-width: $bp-mobile) { font-size: 0.7rem; }

  .tracker-filters__tab--active & { opacity: 1; }
}
</style>
