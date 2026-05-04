<template>
  <div class="tracker-page">

    <!-- Hero header -->
    <header class="tracker-page__hero">
      <div class="tracker-page__hero-text">
        <span class="tracker-page__badge">{{ t('nav_tracker') }}</span>
        <h1 class="tracker-page__title">{{ t('tracker_title') }}</h1>
        <p class="tracker-page__subtitle">{{ t('tracker_subtitle') }}</p>
      </div>
      <AppButton
        class="tracker-page__add-btn"
        :class="{ 'tracker-page__add-btn--open': showForm }"
        variant="primary"
        @click="toggleForm"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            :d="showForm ? 'M2 7h10' : 'M7 2v10M2 7h10'"
            stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
          />
        </svg>
        {{ showForm ? t('tracker_cancel') : t('tracker_add') }}
      </AppButton>
    </header>

    <!-- Stats -->
    <TrackerStats :counts="counts" />

    <!-- Add form (slide in) -->
    <transition name="tracker-slide">
      <TrackerForm
        v-if="showForm"
        @submitted="showForm = false"
        @cancel="showForm = false"
      />
    </transition>

    <!-- Filters -->
    <TrackerFilters v-model="activeFilter" :counts="counts" />

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="tracker-page__list">
      <div v-for="n in 3" :key="n" class="tracker-page__skeleton" />
    </div>

    <!-- Application list -->
    <div v-else-if="filtered.length > 0" class="tracker-page__list">
      <transition-group name="tracker-list" tag="div" class="tracker-page__list-inner">
        <TrackerCard
          v-for="app in filtered"
          :key="app.id"
          :app="app"
        />
      </transition-group>
    </div>

    <!-- Empty state -->
    <TrackerEmpty
      v-else
      :title="activeFilter === 'all' ? t('tracker_empty_title') : t('tracker_empty_filtered')"
      :text="activeFilter === 'all' ? t('tracker_empty_text') : ''"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { filtered, counts, activeFilter, isLoading, fetchAll } = useApplications()

const showForm = ref(false)

function toggleForm() {
  showForm.value = !showForm.value
}

onMounted(fetchAll)
</script>

<style lang="scss" scoped>
.tracker-page {
  display: flex;
  flex-direction: column;
  gap: $space-6;

  @media (min-width: $bp-tablet) { gap: $space-8; }
}

// ─── Hero ───────────────────────────────────────────────────────────────────
.tracker-page__hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: $space-4;
  flex-wrap: wrap;
}

.tracker-page__hero-text {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.tracker-page__badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: $font-weight-semibold;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: $color-primary;
  background: var(--color-primary-light);
  border: 1px solid rgba($color-primary, 0.2);
  padding: 4px 12px;
  border-radius: 999px;
  width: fit-content;
}

.tracker-page__title {
  font-size: clamp(1.5rem, 5vw, 2.25rem);
  font-weight: $font-weight-extrabold;
  color: var(--color-text);
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.tracker-page__subtitle {
  font-size: $font-size-base;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.tracker-page__add-btn {
  flex-shrink: 0;
  align-self: flex-start;

  @media (min-width: $bp-mobile) { align-self: flex-end; }
}

// ─── List ───────────────────────────────────────────────────────────────────
.tracker-page__list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.tracker-page__list-inner {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────
.tracker-page__skeleton {
  height: 120px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-border);
  border-radius: $border-radius-lg;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, var(--color-surface-2, rgba(255,255,255,0.4)) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 1.4s ease infinite;
  }
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

// ─── Transitions ─────────────────────────────────────────────────────────────
.tracker-slide-enter-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.tracker-slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.tracker-slide-enter-from,
.tracker-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.tracker-list-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.tracker-list-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  position: absolute;
  width: 100%;
}
.tracker-list-enter-from { opacity: 0; transform: translateY(-8px); }
.tracker-list-leave-to   { opacity: 0; transform: scale(0.97); }
.tracker-list-move       { transition: transform 0.3s ease; }
</style>
