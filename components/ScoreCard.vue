<template>
  <div class="score-card">
    <div class="score-card__ring" :style="{ '--score': score }">
      <div class="score-card__inner">
        <span class="score-card__number">{{ displayScore }}</span>
        <span class="score-card__unit">/ 100</span>
      </div>
    </div>
    <div class="score-card__meta">
      <div class="score-card__label-row">
        <span class="score-card__pill" :class="scorePillClass">{{ scoreLabel }}</span>
        <h2 class="score-card__label">Match Score</h2>
      </div>
      <p class="score-card__reason">{{ reason }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  score: number
  reason: string
}>()

const displayScore = ref(0)

onMounted(() => {
  const end = props.score
  const duration = 900
  const frameRate = 16
  const totalFrames = duration / frameRate
  const increment = end / totalFrames
  let current = 0

  const timer = setInterval(() => {
    current += increment
    if (current >= end) {
      displayScore.value = end
      clearInterval(timer)
    } else {
      displayScore.value = Math.round(current)
    }
  }, frameRate)
})

const scoreLabel = computed(() => {
  if (props.score >= 90) return 'Excellent'
  if (props.score >= 70) return 'Good match'
  if (props.score >= 50) return 'Partial match'
  return 'Weak match'
})

const scorePillClass = computed(() => {
  if (props.score >= 70) return 'score-card__pill--good'
  if (props.score >= 50) return 'score-card__pill--partial'
  return 'score-card__pill--weak'
})
</script>

<style lang="scss" scoped>
.score-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: $space-6;
  padding: $space-6;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: $border-radius-lg;
  box-shadow: var(--shadow-base);

  @media (min-width: $bp-mobile) {
    flex-direction: row;
    text-align: left;
    gap: $space-8;
    padding: $space-8;
    border-radius: $border-radius-xl;
  }

  &__ring {
    width: 108px;
    height: 108px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      $color-primary 0%,
      $color-accent calc(var(--score, 0) * 1%),
      var(--score-ring-track) calc(var(--score, 0) * 1%)
    );
    display: grid;
    place-items: center;
    flex-shrink: 0;
    box-shadow: 0 0 0 1px var(--color-border), 0 4px 24px rgba(79, 70, 229, 0.18);

    @media (min-width: $bp-mobile) { width: 136px; height: 136px; }
  }

  &__inner {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--color-surface);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;

    @media (min-width: $bp-mobile) { width: 104px; height: 104px; }
  }

  &__number {
    font-size: 2rem;
    font-weight: $font-weight-extrabold;
    line-height: 1;
    background: $gradient-brand;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (min-width: $bp-mobile) { font-size: 2.5rem; }
  }

  &__unit {
    font-size: $font-size-sm;
    color: var(--color-text-muted);
    line-height: 1;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    flex: 1;
  }

  &__label-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-3;
    flex-wrap: wrap;

    @media (min-width: $bp-mobile) { justify-content: flex-start; }
  }

  &__label {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: var(--color-text);
    letter-spacing: -0.02em;
  }

  &__pill {
    font-size: 0.72rem;
    font-weight: $font-weight-semibold;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 999px;

    &--good    { background: var(--color-success-bg); color: $color-success; }
    &--partial { background: var(--color-partial-bg); color: var(--color-partial-text); }
    &--weak    { background: var(--color-danger-bg);  color: $color-error; }
  }

  &__reason {
    font-size: $font-size-base;
    color: var(--color-text-muted);
    line-height: $line-height-base;
    max-width: 52ch;
  }
}
</style>
