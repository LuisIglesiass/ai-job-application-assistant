<template>
  <div class="review">

    <!-- Issues + Improvements -->
    <div class="review__top-grid">

      <div class="review__block">
        <h4 class="review__block-title review__block-title--danger">
          <span class="review__block-dot review__block-dot--danger" aria-hidden="true" />
          {{ t('review_issues') }}
        </h4>
        <ul class="review__list">
          <li v-for="issue in result.issues" :key="issue" class="review__list-item review__list-item--danger">
            {{ issue }}
          </li>
        </ul>
      </div>

      <div class="review__block">
        <h4 class="review__block-title review__block-title--primary">
          <span class="review__block-dot review__block-dot--primary" aria-hidden="true" />
          {{ t('review_improvements') }}
        </h4>
        <ol class="review__numbered">
          <li v-for="(item, i) in result.improvements" :key="i" class="review__numbered-item">
            <span class="review__num">{{ i + 1 }}</span>
            {{ item }}
          </li>
        </ol>
      </div>

    </div>

    <div class="review__divider" />

    <!-- Rewrites -->
    <div class="review__section">
      <h4 class="review__block-title review__block-title--success">
        <span class="review__block-dot review__block-dot--success" aria-hidden="true" />
        {{ t('review_rewrites') }}
      </h4>

      <div class="review__rewrite">
        <p class="review__rewrite-label">{{ t('opt_rewrite_summary') }}</p>
        <p class="review__rewrite-text">{{ result.rewrites.summary }}</p>
      </div>

      <div class="review__rewrite">
        <p class="review__rewrite-label">{{ t('opt_rewrite_experience') }}</p>
        <ul class="review__bullets">
          <li v-for="(bullet, i) in result.rewrites.experience" :key="i" class="review__bullet">
            {{ bullet }}
          </li>
        </ul>
      </div>
    </div>

    <div class="review__divider" />

    <!-- Tips -->
    <div class="review__section">
      <h4 class="review__block-title review__block-title--accent">
        <span class="review__block-dot review__block-dot--accent" aria-hidden="true" />
        {{ t('review_tips') }}
      </h4>
      <ol class="review__numbered">
        <li v-for="(tip, i) in result.tips" :key="i" class="review__numbered-item">
          <span class="review__num review__num--accent">{{ i + 1 }}</span>
          {{ tip }}
        </li>
      </ol>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { ReviewResponse } from '~/server/api/review'
import { useI18n } from '~/composables/useI18n'

defineProps<{ result: ReviewResponse }>()

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.review {
  display: flex;
  flex-direction: column;
  gap: $space-6;

  &__top-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-6;

    @media (max-width: $bp-mobile) { grid-template-columns: 1fr; }
  }

  &__divider {
    height: 1px;
    background: $color-border;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  // ─── Block header ─────────────────────────────────────────────────────────────
  &__block {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__block-title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    letter-spacing: 0.02em;
    text-transform: uppercase;

    &--danger  { color: $color-error; }
    &--primary { color: $color-primary; }
    &--success { color: $color-success; }
    &--accent  { color: #7c3aed; }
  }

  &__block-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;

    &--danger  { background: $color-error; }
    &--primary { background: $color-primary; }
    &--success { background: $color-success; }
    &--accent  { background: #7c3aed; }
  }

  // ─── Issues list ──────────────────────────────────────────────────────────────
  &__list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__list-item {
    font-size: $font-size-sm;
    color: $color-text;
    line-height: $line-height-base;
    padding: $space-2 $space-3;
    border-radius: $border-radius-base;
    padding-left: $space-4;
    position: relative;

    &::before {
      content: '✕';
      position: absolute;
      left: $space-3;
      font-size: 0.6rem;
      top: 50%;
      transform: translateY(-50%);
    }

    &--danger {
      background: $color-danger-bg;
      color: $color-error;
      border: 1px solid rgba($color-error, 0.15);
      padding-left: $space-6;

      &::before { color: $color-error; }
    }
  }

  // ─── Numbered list ────────────────────────────────────────────────────────────
  &__numbered {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__numbered-item {
    display: flex;
    align-items: flex-start;
    gap: $space-3;
    font-size: $font-size-sm;
    color: $color-text;
    line-height: $line-height-base;
  }

  &__num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: $color-primary-light;
    color: $color-primary;
    font-size: 0.72rem;
    font-weight: $font-weight-bold;
    flex-shrink: 0;
    margin-top: 1px;

    &--accent {
      background: rgba(124, 58, 237, 0.1);
      color: #7c3aed;
    }
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
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__rewrite-text {
    font-size: $font-size-base;
    color: $color-text;
    line-height: $line-height-base;
    padding: $space-4;
    background: $color-success-bg;
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
    color: $color-text;
    line-height: $line-height-base;
    padding: $space-3 $space-4;
    background: $color-success-bg;
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
