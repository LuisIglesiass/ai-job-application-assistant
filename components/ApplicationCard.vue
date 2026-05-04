<template>
  <div class="application">

    <!-- Keywords -->
    <div class="application__section">
      <h4 class="application__section-title application__section-title--primary">
        <span class="application__dot application__dot--primary" aria-hidden="true" />
        {{ t('apply_keywords') }}
      </h4>
      <div class="application__keywords">
        <span
          v-for="kw in result.keywords"
          :key="kw"
          class="application__keyword"
        >{{ kw }}</span>
      </div>
    </div>

    <div class="application__divider" />

    <!-- Optimized CV -->
    <div class="application__section">
      <h4 class="application__section-title application__section-title--success">
        <span class="application__dot application__dot--success" aria-hidden="true" />
        {{ t('apply_optimized_cv') }}
      </h4>

      <div class="application__block">
        <p class="application__block-label">{{ t('opt_rewrite_summary') }}</p>
        <p class="application__summary">{{ result.optimizedCV.summary }}</p>
      </div>

      <div class="application__block">
        <p class="application__block-label">{{ t('opt_rewrite_experience') }}</p>
        <ul class="application__bullets">
          <li
            v-for="(bullet, i) in result.optimizedCV.experience"
            :key="i"
            class="application__bullet"
          >{{ bullet }}</li>
        </ul>
      </div>
    </div>

    <div class="application__divider" />

    <!-- Cover Letter -->
    <div class="application__section">
      <div class="application__cover-header">
        <h4 class="application__section-title application__section-title--accent">
          <span class="application__dot application__dot--accent" aria-hidden="true" />
          {{ t('cover_letter_title') }}
        </h4>
        <button
          class="application__copy-btn"
          :class="{ 'application__copy-btn--copied': copied }"
          type="button"
          @click="copyLetter"
        >
          <span aria-hidden="true">{{ copied ? '✓' : '⎘' }}</span>
          {{ copied ? t('copied_btn') : t('copy_btn') }}
        </button>
      </div>
      <p class="application__cover-letter">{{ result.coverLetter }}</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ApplyResponse } from '~/server/api/apply'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{ result: ApplyResponse }>()
const { t } = useI18n()

const copied = ref(false)

async function copyLetter() {
  await navigator.clipboard.writeText(props.result.coverLetter)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style lang="scss" scoped>
.application {
  display: flex;
  flex-direction: column;
  gap: $space-6;

  // ─── Section ────────────────────────────────────────────────────────────────
  &__section {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  &__section-title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    letter-spacing: 0.02em;
    text-transform: uppercase;

    &--primary { color: $color-primary; }
    &--success { color: $color-success; }
    &--accent  { color: #7c3aed; }
  }

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;

    &--primary { background: $color-primary; }
    &--success { background: $color-success; }
    &--accent  { background: #7c3aed; }
  }

  &__divider {
    height: 1px;
    background: var(--color-border);
  }

  // ─── Keywords ───────────────────────────────────────────────────────────────
  &__keywords {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
  }

  &__keyword {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    padding: 4px 12px;
    border-radius: 999px;
    background: var(--color-primary-light);
    color: $color-primary;
    border: 1px solid rgba($color-primary, 0.2);
    letter-spacing: 0.01em;
  }

  // ─── Optimized CV ───────────────────────────────────────────────────────────
  &__block {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__block-label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__summary {
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
    font-size: $font-size-sm;
    color: var(--color-text);
    line-height: $line-height-base;
    padding: $space-3 $space-4;
    background: var(--color-success-bg);
    border: 1px solid rgba($color-success, 0.2);
    border-radius: $border-radius-base;
    padding-left: $space-6;
    position: relative;

    &::before {
      content: '→';
      position: absolute;
      left: $space-3;
      color: $color-success;
      font-weight: $font-weight-bold;
    }
  }

  // ─── Cover letter ───────────────────────────────────────────────────────────
  &__cover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: $space-2;
  }

  &__copy-btn {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    padding: 4px 12px;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: var(--color-text-muted);
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: $border-radius-base;
    cursor: pointer;
    transition: color $transition-base, border-color $transition-base, background $transition-base;

    &:hover {
      color: $color-primary;
      border-color: $color-primary;
      background: var(--color-primary-light);
    }

    &--copied {
      color: $color-success;
      border-color: $color-success;
      background: var(--color-success-bg);
    }
  }

  &__cover-letter {
    font-size: $font-size-base;
    color: var(--color-text);
    line-height: 1.85;
    white-space: pre-wrap;
  }
}
</style>
