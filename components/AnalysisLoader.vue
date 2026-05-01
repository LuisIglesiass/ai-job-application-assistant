<template>
  <div class="loader">
    <div class="loader__rings" aria-hidden="true">
      <span class="loader__ring loader__ring--1" />
      <span class="loader__ring loader__ring--2" />
      <span class="loader__ring loader__ring--3" />
    </div>

    <div class="loader__spinner" aria-hidden="true">
      <div class="loader__arc" />
      <div class="loader__core">
        <img
          src="~/assets/images/1-1-logo-ai.png"
          alt=""
          aria-hidden="true"
          class="loader__logo-img"
        />
      </div>
    </div>

    <div class="loader__text">
      <transition name="msg" mode="out-in">
        <p :key="currentMessage" class="loader__message">{{ currentMessage }}</p>
      </transition>
      <div class="loader__dots" aria-hidden="true">
        <span
          v-for="i in 3"
          :key="i"
          class="loader__dot"
          :style="{ animationDelay: `${(i - 1) * 0.18}s` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const messages = [
  'Reading your experience…',
  'Evaluating job requirements…',
  'Calculating match score…',
  'Crafting your cover letter…',
  'Almost there…',
]

const currentMessage = ref(messages[0])
let idx = 0
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    idx = (idx + 1) % messages.length
    currentMessage.value = messages[idx]
  }, 2200)
})

onUnmounted(() => clearInterval(timer))
</script>

<style lang="scss" scoped>
// ─── Layout ───────────────────────────────────────────────────────────────────
.loader {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-6;
  padding: $space-8 $space-4;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-base;
  overflow: hidden;
  min-height: 260px;

  @media (min-width: $bp-mobile) {
    gap: $space-8;
    padding: $space-12 $space-8;
    border-radius: $border-radius-xl;
    min-height: 320px;
  }

  @media (min-width: $bp-tablet) { padding: $space-16 $space-8; }
}

// ─── Pulsing background rings ─────────────────────────────────────────────────
.loader__rings {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.loader__ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba($color-primary, 0.12);
  animation: pulse-ring $transition-slow ease-out infinite;

  &--1 { width: 120px; height: 120px; animation-duration: 2.4s; animation-delay: 0s; }
  &--2 { width: 200px; height: 200px; animation-duration: 2.4s; animation-delay: 0.5s; }
  &--3 { width: 280px; height: 280px; animation-duration: 2.4s; animation-delay: 1.0s; }

  @media (min-width: $bp-mobile) {
    &--1 { width: 180px; height: 180px; }
    &--2 { width: 280px; height: 280px; }
    &--3 { width: 380px; height: 380px; }
  }
}

@keyframes pulse-ring {
  0%   { opacity: 0.6; transform: scale(0.92); }
  60%  { opacity: 0.15; }
  100% { opacity: 0; transform: scale(1.06); }
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
.loader__spinner {
  position: relative;
  width: 88px;
  height: 88px;
  display: grid;
  place-items: center;
  z-index: 1;
}

.loader__arc {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    $color-primary 0%,
    $color-accent 55%,
    transparent 65%,
    transparent 100%
  );
  animation: spin 1.1s linear infinite;
  mask: radial-gradient(farthest-side, transparent calc(100% - 6px), white 0);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 6px), white 0);
}

.loader__core {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: $color-surface;
  box-shadow: $shadow-sm;
  display: grid;
  place-items: center;
  z-index: 1;
}

.loader__logo-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// ─── Text ─────────────────────────────────────────────────────────────────────
.loader__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
  z-index: 1;
}

.loader__message {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-muted;
  letter-spacing: -0.01em;
}

// ─── Bouncing dots ────────────────────────────────────────────────────────────
.loader__dots {
  display: flex;
  gap: $space-2;
}

.loader__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $gradient-brand;
  animation: bounce-dot 0.9s ease-in-out infinite alternate;
}

@keyframes bounce-dot {
  from { opacity: 0.25; transform: translateY(0); }
  to   { opacity: 1;    transform: translateY(-5px); }
}

// ─── Message transition ───────────────────────────────────────────────────────
.msg-enter-active,
.msg-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.msg-enter-from { opacity: 0; transform: translateY(6px); }
.msg-leave-to   { opacity: 0; transform: translateY(-6px); }
</style>
