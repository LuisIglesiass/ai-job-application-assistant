<template>
  <div class="review-page">

    <!-- Hero -->
    <header class="review-page__hero">
      <span class="review-page__hero-badge">{{ t('nav_cv_review') }}</span>
      <h1 class="review-page__title">
        {{ t('review_hero_title_1') }}<br><em class="review-page__title-accent">{{ t('review_hero_title_2') }}</em>
      </h1>
      <p class="review-page__subtitle">{{ t('review_hero_subtitle') }}</p>
    </header>

    <!-- Form -->
    <form class="review-page__form" @submit.prevent="handleSubmit">
      <AppTextarea
        id="review-cv"
        v-model="cv"
        :label="t('cv_label')"
        :placeholder="t('cv_ph')"
        :rows="14"
        required
        :hint="t('cv_hint')"
        :error="cvError"
        :disabled="isPending"
        @input="cvError = null"
      />

      <div class="review-page__toolbar">
        <OutputLangSelector v-model="outputLanguage" :label="t('output_lang_label')" />
        <AppButton type="submit" :loading="isPending" :disabled="!cv.trim() || isPending">
          {{ isPending ? t('review_btn_loading') : t('review_btn') }}
        </AppButton>
      </div>
    </form>

    <!-- Error -->
    <div v-if="error" class="review-page__error" role="alert">
      <span class="review-page__error-icon" aria-hidden="true">⚠</span>
      <p>{{ error }}</p>
    </div>

    <!-- Loading -->
    <CvReviewLoader v-if="isPending" />

    <!-- Results -->
    <transition name="fade">
      <ResultCard v-if="result" :title="t('review_title')">
        <CvReviewCard :result="result" />
      </ResultCard>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useReview } from '~/composables/useReview'
import { useOutputLanguage } from '~/composables/useOutputLanguage'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { isPending, result, error, review } = useReview()
const { outputLanguage } = useOutputLanguage()

const cv = ref('')
const cvError = ref<string | null>(null)

const MIN_LENGTH = 20

async function handleSubmit() {
  if (cv.value.trim().length < MIN_LENGTH) {
    cvError.value = t('err_cv_short')
    return
  }
  await review(cv.value)
}
</script>

<style lang="scss" scoped>
.review-page {
  display: flex;
  flex-direction: column;
  gap: $space-8;

  @media (min-width: $bp-tablet) { gap: $space-12; }
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
.review-page__hero {
  text-align: center;
  padding-top: $space-4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;

  @media (min-width: $bp-mobile) { padding-top: $space-6; gap: $space-4; }
  @media (min-width: $bp-tablet) { padding-top: $space-8; }
}

.review-page__hero-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: $font-weight-semibold;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: $color-primary;
  background: var(--color-primary-light);
  border: 1px solid rgba($color-primary, 0.2);
  padding: 5px 14px;
  border-radius: 999px;
}

.review-page__title {
  font-size: clamp(1.65rem, 6vw, 3rem);
  font-weight: $font-weight-extrabold;
  color: var(--color-text);
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.review-page__title-accent {
  font-style: normal;
  background: $gradient-brand;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.review-page__subtitle {
  font-size: $font-size-base;
  color: var(--color-text-muted);
  line-height: 1.65;
  max-width: 54ch;

  @media (min-width: $bp-mobile) { font-size: $font-size-lg; }
}

// ─── Form ─────────────────────────────────────────────────────────────────────
.review-page__form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: $border-radius-lg;
  padding: $space-4;
  box-shadow: var(--shadow-base);

  @media (min-width: $bp-mobile) {
    gap: $space-6;
    padding: $space-6;
    border-radius: $border-radius-xl;
  }

  @media (min-width: $bp-tablet) { padding: $space-8; }
}

.review-page__toolbar {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  @media (min-width: $bp-mobile) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  :deep(.app-button) {
    width: 100%;
    @media (min-width: $bp-mobile) { width: auto; }
  }
}

// ─── Error ────────────────────────────────────────────────────────────────────
.review-page__error {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
  background: var(--color-danger-bg);
  border: 1px solid rgba($color-error, 0.2);
  border-radius: $border-radius-base;
  color: $color-error;
  font-size: $font-size-sm;

  @media (min-width: $bp-mobile) { padding: $space-4 $space-6; }

  &-icon { font-size: $font-size-lg; }
}

// ─── Fade transition ──────────────────────────────────────────────────────────
.fade-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-enter-from   { opacity: 0; transform: translateY(12px); }
</style>
