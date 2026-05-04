<template>
  <span class="status-badge" :class="`status-badge--${status}`">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ApplicationStatus } from '../types'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{ status: ApplicationStatus }>()
const { t } = useI18n()

const label = computed(() => t(`status_${props.status}` as any))
</script>

<style lang="scss" scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: $font-weight-semibold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }

  &--applied   { background: var(--color-primary-light); color: $color-primary; }
  &--interview { background: #fff7ed; color: #c2410c;

    [data-theme="dark"] & { background: #1f1205; color: #fb923c; }
  }
  &--offer     { background: var(--color-success-bg); color: $color-success; }
  &--rejected  {
    background: var(--color-surface-2, #f3f4f6);
    color: var(--color-text-muted);
    &::before { opacity: 0.5; }
  }
}
</style>
