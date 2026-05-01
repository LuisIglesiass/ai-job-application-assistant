<template>
  <div class="optimizer">

    <!-- Analysis -->
    <div class="optimizer__section">
      <div class="optimizer__section-grid">

        <div class="optimizer__block">
          <h4 class="optimizer__block-title optimizer__block-title--danger">
            <span class="optimizer__block-dot optimizer__block-dot--danger" aria-hidden="true" />
            {{ t('opt_missing_skills') }}
          </h4>
          <div class="optimizer__tags">
            <span
              v-for="skill in result.matchAnalysis.missingSkills"
              :key="skill"
              class="optimizer__tag optimizer__tag--danger"
            >{{ skill }}</span>
          </div>
        </div>

        <div class="optimizer__block">
          <h4 class="optimizer__block-title optimizer__block-title--warning">
            <span class="optimizer__block-dot optimizer__block-dot--warning" aria-hidden="true" />
            {{ t('opt_weak_areas') }}
          </h4>
          <ul class="optimizer__list">
            <li v-for="area in result.matchAnalysis.weakAreas" :key="area" class="optimizer__list-item">
              {{ area }}
            </li>
          </ul>
        </div>

      </div>
    </div>

    <div class="optimizer__divider" />

    <!-- Improvements -->
    <div class="optimizer__section">
      <h4 class="optimizer__block-title optimizer__block-title--primary">
        <span class="optimizer__block-dot optimizer__block-dot--primary" aria-hidden="true" />
        {{ t('opt_improvements') }}
      </h4>
      <ol class="optimizer__improvements">
        <li
          v-for="(item, i) in result.improvements"
          :key="i"
          class="optimizer__improvement-item"
        >
          <span class="optimizer__improvement-num">{{ i + 1 }}</span>
          {{ item }}
        </li>
      </ol>
    </div>

    <div class="optimizer__divider" />

    <!-- Rewrites -->
    <div class="optimizer__section">
      <h4 class="optimizer__block-title optimizer__block-title--success">
        <span class="optimizer__block-dot optimizer__block-dot--success" aria-hidden="true" />
        {{ t('opt_rewrites') }}
      </h4>

      <div class="optimizer__rewrite">
        <p class="optimizer__rewrite-label">{{ t('opt_rewrite_summary') }}</p>
        <p class="optimizer__rewrite-text">{{ result.rewrites.summary }}</p>
      </div>

      <div class="optimizer__rewrite">
        <p class="optimizer__rewrite-label">{{ t('opt_rewrite_experience') }}</p>
        <ul class="optimizer__bullets">
          <li v-for="(bullet, i) in result.rewrites.experience" :key="i" class="optimizer__bullet">
            {{ bullet }}
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { OptimizeResponse } from '~/server/api/optimize'
import { useI18n } from '~/composables/useI18n'

defineProps<{ result: OptimizeResponse }>()

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.optimizer {
  display: flex;
  flex-direction: column;
  gap: $space-6;

  &__section {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  &__section-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-6;

    @media (max-width: $bp-mobile) { grid-template-columns: 1fr; }
  }

  &__divider {
    height: 1px;
    background: var(--color-border);
  }

  // ─── Block header ────────────────────────────────────────────────────────────
  &__block { display: flex; flex-direction: column; gap: $space-3; }

  &__block-title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    letter-spacing: 0.02em;
    text-transform: uppercase;

    &--danger  { color: $color-error; }
    &--warning { color: var(--color-warning-text); }
    &--primary { color: $color-primary; }
    &--success { color: $color-success; }
  }

  &__block-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;

    &--danger  { background: $color-error; }
    &--warning { background: #f97316; }
    &--primary { background: $color-primary; }
    &--success { background: $color-success; }
  }

  // ─── Missing skills tags ──────────────────────────────────────────────────────
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
  }

  &__tag {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    padding: 3px 10px;
    border-radius: 999px;

    &--danger {
      background: var(--color-danger-bg);
      color: $color-error;
      border: 1px solid rgba($color-error, 0.2);
    }
  }

  // ─── Weak areas list ──────────────────────────────────────────────────────────
  &__list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__list-item {
    font-size: $font-size-sm;
    color: var(--color-text-muted);
    padding-left: $space-3;
    position: relative;

    &::before {
      content: '–';
      position: absolute;
      left: 0;
      color: #f97316;
      font-weight: $font-weight-semibold;
    }
  }

  // ─── Improvements ─────────────────────────────────────────────────────────────
  &__improvements {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__improvement-item {
    display: flex;
    align-items: flex-start;
    gap: $space-3;
    font-size: $font-size-sm;
    color: var(--color-text);
    line-height: $line-height-base;
  }

  &__improvement-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--color-primary-light);
    color: $color-primary;
    font-size: 0.72rem;
    font-weight: $font-weight-bold;
    flex-shrink: 0;
    margin-top: 1px;
  }

  // ─── Rewrites ─────────────────────────────────────────────────────────────────
  &__rewrite {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__rewrite-label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__rewrite-text {
    font-size: $font-size-base;
    color: var(--color-text);
    line-height: $line-height-base;
    padding: $space-4;
    background: var(--color-success-bg);
    border: 1px solid rgba($color-success, 0.2);
    border-radius: $border-radius-base;
  }

  &__bullets {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__bullet {
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    font-size: $font-size-sm;
    color: var(--color-text);
    line-height: $line-height-base;
    padding: $space-3 $space-4;
    background: var(--color-success-bg);
    border: 1px solid rgba($color-success, 0.2);
    border-radius: $border-radius-base;

    &::before {
      content: '→';
      color: $color-success;
      font-weight: $font-weight-bold;
      flex-shrink: 0;
    }
  }
}
</style>
