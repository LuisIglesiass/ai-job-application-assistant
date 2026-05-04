<template>
  <div class="tracker-stats">
    <div v-for="stat in stats" :key="stat.key" class="tracker-stats__item">
      <span class="tracker-stats__value" :class="`tracker-stats__value--${stat.key}`">
        {{ stat.count }}
      </span>
      <span class="tracker-stats__label">{{ stat.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  counts: { all: number; applied: number; interview: number; offer: number; rejected: number }
}>()

const { t } = useI18n()

const stats = computed(() => [
  { key: 'all',       count: props.counts.all,       label: t('tracker_filter_all') },
  { key: 'applied',   count: props.counts.applied,   label: t('status_applied') },
  { key: 'interview', count: props.counts.interview, label: t('status_interview') },
  { key: 'offer',     count: props.counts.offer,     label: t('status_offer') },
  { key: 'rejected',  count: props.counts.rejected,  label: t('status_rejected') },
])
</script>

<style lang="scss" scoped>
.tracker-stats {
  display: flex;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: $border-radius-lg;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.tracker-stats__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
  padding: $space-3 $space-1;

  @media (min-width: $bp-mobile) {
    gap: 4px;
    padding: $space-4 $space-2;
  }

  & + & {
    border-left: 1px solid var(--color-border);
  }
}

.tracker-stats__value {
  font-size: $font-size-xl;
  font-weight: $font-weight-extrabold;
  line-height: 1;
  letter-spacing: -0.03em;

  @media (min-width: $bp-mobile) { font-size: $font-size-2xl; }

  &--all       { background: $gradient-brand; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  &--applied   { color: $color-primary; }
  &--interview { color: #f59e0b; }
  &--offer     { color: $color-success; }
  &--rejected  { color: var(--color-text-muted); }
}

.tracker-stats__label {
  font-size: 0.6rem;
  font-weight: $font-weight-semibold;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  white-space: nowrap;

  @media (min-width: $bp-mobile) { font-size: 0.7rem; }
}
</style>
