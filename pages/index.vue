<template>
  <div class="home">
    <header class="home__header">
      <h1 class="home__title">AI Job Assistant</h1>
      <p class="home__subtitle">
        Paste a job offer and your CV to get a tailored analysis in seconds.
      </p>
    </header>

    <form class="home__form" @submit.prevent="handleAnalyze">
      <AppTextarea
        id="job-offer"
        v-model="jobOffer"
        label="Job Offer"
        placeholder="Paste the full job description here…"
        :rows="8"
        required
        hint="Copy and paste the job posting text."
      />

      <AppTextarea
        id="cv"
        v-model="cv"
        label="Your CV"
        placeholder="Paste your CV content here…"
        :rows="10"
        required
        hint="Plain text works best. File upload coming soon."
      />

      <div class="home__actions">
        <AppButton type="submit" :loading="isPending" :disabled="!canSubmit">
          Analyze
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useJobAnalysis } from '~/composables/useJobAnalysis'

definePageMeta({ layout: 'default' })

const { jobOffer, cv, isPending, canSubmit, handleAnalyze } = useJobAnalysis()
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: $space-8;

  &__header {
    text-align: center;
  }

  &__title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $color-text;
    margin-bottom: $space-3;
  }

  &__subtitle {
    font-size: $font-size-lg;
    color: $color-text-muted;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $space-6;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $border-radius-lg;
    padding: $space-8;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
