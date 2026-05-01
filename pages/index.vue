<template>
  <div class="home">

    <!-- Hero -->
    <header class="home__hero">
      <span class="home__hero-badge">AI-Powered Career Tool</span>
      <h1 class="home__title">Find your perfect<br><em class="home__title-accent">job match</em></h1>
      <p class="home__subtitle">
        Paste any job description and your CV — get an instant match score,<br class="home__br">
        strengths analysis, and a tailored cover letter in seconds.
      </p>
    </header>

    <!-- Form -->
    <form class="home__form" @submit.prevent="handleAnalyze">
      <div class="home__form-grid">
        <AppTextarea
          id="job-offer"
          v-model="jobOffer"
          label="Job Description"
          placeholder="Paste the full job posting here…"
          :rows="9"
          required
          hint="Supports full descriptions — the longer, the better."
          :error="fieldErrors.jobOffer"
          :disabled="isPending"
          @input="clearFieldError('jobOffer')"
        />

        <AppTextarea
          id="cv"
          v-model="cv"
          label="Your CV"
          placeholder="Paste your CV content here…"
          :rows="9"
          required
          hint="Plain text works best."
          :error="fieldErrors.cv"
          :disabled="isPending"
          @input="clearFieldError('cv')"
        />
      </div>

      <div class="home__soft-skills">
        <AppTextarea
          id="soft-skills"
          v-model="softSkills"
          label="Soft Skills"
          placeholder="e.g. Strong communicator, empathetic leader, detail-oriented, fast learner, collaborative under pressure…"
          :rows="3"
          hint="Optional — 1 to 2 will be woven naturally into your cover letter."
          :disabled="isPending"
        />
      </div>

      <div class="home__actions">
        <AppButton type="submit" :loading="isPending" :disabled="!canSubmit">
          {{ isPending ? 'Analyzing…' : 'Analyze my match' }}
        </AppButton>
      </div>
    </form>

    <!-- Error -->
    <div v-if="error" class="home__error" role="alert">
      <span class="home__error-icon" aria-hidden="true">⚠</span>
      <p>{{ error }}</p>
    </div>

    <!-- Loading -->
    <AnalysisLoader v-if="isPending" />

    <!-- Results -->
    <transition name="fade">
      <div v-if="result" class="results">
        <ScoreCard :score="result.matchScore" :reason="result.reason" />

        <div class="results__insights">
          <InsightList title="Strengths" variant="strength" :items="result.strengths" />
          <InsightList title="Weaknesses" variant="weakness" :items="result.weaknesses" />
        </div>

        <ResultCard title="Cover Letter">
          <template #actions>
            <button class="copy-btn" :class="{ 'copy-btn--copied': copied }" @click="copyLetter">
              <span class="copy-btn__icon" aria-hidden="true">{{ copied ? '✓' : '⎘' }}</span>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </template>
          <p class="results__cover-letter">{{ result.coverLetter }}</p>
        </ResultCard>

        <div class="results__retry">
          <AppButton variant="secondary" type="button" @click="handleAnalyze" :disabled="isPending">
            Re-analyze
          </AppButton>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useJobAnalysis } from '~/composables/useJobAnalysis'

definePageMeta({ layout: 'default' })

const { jobOffer, cv, softSkills, isPending, canSubmit, result, error, fieldErrors, clearFieldError, handleAnalyze } = useJobAnalysis()

const copied = ref(false)

async function copyLetter() {
  if (!result.value?.coverLetter) return
  await navigator.clipboard.writeText(result.value.coverLetter)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: $space-8;

  @media (min-width: $bp-tablet) { gap: $space-12; }
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
.home__hero {
  text-align: center;
  padding-top: $space-4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;

  @media (min-width: $bp-mobile) { padding-top: $space-6; gap: $space-4; }
  @media (min-width: $bp-tablet) { padding-top: $space-8; }
}

.home__hero-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: $font-weight-semibold;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: $color-primary;
  background: $color-primary-light;
  border: 1px solid rgba($color-primary, 0.2);
  padding: 5px 14px;
  border-radius: 999px;
}

.home__title {
  font-size: clamp(1.65rem, 6vw, 3rem);
  font-weight: $font-weight-extrabold;
  color: $color-text;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.home__title-accent {
  font-style: normal;
  background: $gradient-brand;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.home__subtitle {
  font-size: $font-size-base;
  color: $color-text-muted;
  line-height: 1.65;
  max-width: 54ch;

  @media (min-width: $bp-mobile) { font-size: $font-size-lg; }
}

.home__br { display: none; @media (min-width: 520px) { display: inline; } }

// ─── Form ─────────────────────────────────────────────────────────────────────
.home__form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $border-radius-lg;
  padding: $space-4;
  box-shadow: $shadow-base;

  @media (min-width: $bp-mobile) {
    gap: $space-6;
    padding: $space-6;
    border-radius: $border-radius-xl;
  }

  @media (min-width: $bp-tablet) { padding: $space-8; }
}

.home__form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-4;

  @media (min-width: $bp-tablet) {
    grid-template-columns: 1fr 1fr;
    gap: $space-6;
  }
}

.home__soft-skills {
  padding-top: $space-2;
  border-top: 1px dashed $color-border;
}

.home__actions {
  display: flex;
  justify-content: stretch;

  @media (min-width: $bp-mobile) { justify-content: flex-end; }

  :deep(.app-button) {
    width: 100%;

    @media (min-width: $bp-mobile) { width: auto; }
  }
}

// ─── Error ────────────────────────────────────────────────────────────────────
.home__error {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
  background: $color-danger-bg;
  border: 1px solid rgba($color-error, 0.2);
  border-radius: $border-radius-base;
  color: $color-error;
  font-size: $font-size-sm;

  @media (min-width: $bp-mobile) { padding: $space-4 $space-6; }

  &-icon { font-size: $font-size-lg; }
}

// ─── Results ──────────────────────────────────────────────────────────────────
.results {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  @media (min-width: $bp-mobile) { gap: $space-6; }

  &__insights {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-4;

    @media (min-width: $bp-mobile) {
      grid-template-columns: 1fr 1fr;
      gap: $space-6;
    }
  }

  &__cover-letter {
    font-size: $font-size-base;
    color: $color-text;
    line-height: 1.85;
    white-space: pre-wrap;
    max-width: 68ch;
  }

  &__retry {
    display: flex;
    justify-content: center;
  }
}

// ─── Copy button ──────────────────────────────────────────────────────────────
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  padding: 4px 12px;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-muted;
  background: transparent;
  border: 1px solid $color-border;
  border-radius: $border-radius-base;
  cursor: pointer;
  transition: color $transition-base, border-color $transition-base, background $transition-base;

  &:hover {
    color: $color-primary;
    border-color: $color-primary;
    background: $color-primary-light;
  }

  &--copied {
    color: $color-success;
    border-color: $color-success;
    background: $color-success-bg;
  }

  &__icon { font-size: 0.9rem; }
}

// ─── Fade transition ──────────────────────────────────────────────────────────
.fade-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-enter-from   { opacity: 0; transform: translateY(12px); }

</style>
