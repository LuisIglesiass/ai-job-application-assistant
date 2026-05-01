<template>
  <div class="rv-loader" role="status" :aria-label="msg">

    <div class="rv-loader__stage">

      <!-- Left chips -->
      <div class="rv-loader__chip rv-loader__chip--left rv-loader__chip--1">
        <span class="rv-loader__chip-dot rv-loader__chip-dot--danger" />
        No metrics found
      </div>
      <div class="rv-loader__chip rv-loader__chip--left rv-loader__chip--3">
        <span class="rv-loader__chip-dot rv-loader__chip-dot--warning" />
        Weak action verbs
      </div>

      <!-- Document -->
      <div class="rv-loader__doc">
        <div class="rv-loader__beam" />

        <!-- Header block -->
        <div class="rv-loader__section">
          <div class="rv-loader__line rv-loader__line--full rv-loader__line--thick" />
          <div class="rv-loader__header-cols">
            <div class="rv-loader__line rv-loader__line--half" />
            <div class="rv-loader__line rv-loader__line--third" />
          </div>
        </div>

        <!-- Body block 1 -->
        <div class="rv-loader__section">
          <div class="rv-loader__line rv-loader__line--full" />
          <div class="rv-loader__line rv-loader__line--long" />
          <div class="rv-loader__line rv-loader__line--med" />
          <div class="rv-loader__line rv-loader__line--short" />
        </div>

        <!-- Body block 2 -->
        <div class="rv-loader__section">
          <div class="rv-loader__line rv-loader__line--full" />
          <div class="rv-loader__line rv-loader__line--long" />
          <div class="rv-loader__line rv-loader__line--full" />
          <div class="rv-loader__line rv-loader__line--xshort" />
        </div>
      </div>

      <!-- Right chips -->
      <div class="rv-loader__chip rv-loader__chip--right rv-loader__chip--2">
        <span class="rv-loader__chip-dot rv-loader__chip-dot--success" />
        Education ✓
      </div>
      <div class="rv-loader__chip rv-loader__chip--right rv-loader__chip--4">
        <span class="rv-loader__chip-dot rv-loader__chip-dot--primary" />
        Add career summary
      </div>

    </div>

    <!-- Message -->
    <div class="rv-loader__text" aria-live="polite">
      <transition name="rv-msg" mode="out-in">
        <p :key="msgIdx" class="rv-loader__msg">{{ currentMessages[msgIdx] }}</p>
      </transition>
      <div class="rv-loader__progress">
        <div class="rv-loader__progress-bar" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { locale } = useI18n()

const messageMap: Record<string, string[]> = {
  en: [
    'Reading your work history…',
    'Identifying skill gaps…',
    'Evaluating your summary…',
    'Crafting improvements…',
    'Generating rewrite suggestions…',
  ],
  es: [
    'Leyendo tu historial laboral…',
    'Identificando brechas de habilidades…',
    'Evaluando tu resumen…',
    'Elaborando mejoras…',
    'Generando sugerencias de reescritura…',
  ],
  de: [
    'Lese deine Berufserfahrung…',
    'Identifiziere Kompetenzlücken…',
    'Bewerte dein Profil…',
    'Erstelle Verbesserungsvorschläge…',
    'Generiere Umformulierungen…',
  ],
  pt: [
    'A ler o teu historial…',
    'A identificar lacunas de competências…',
    'A avaliar o teu resumo…',
    'A criar melhorias…',
    'A gerar sugestões de reescrita…',
  ],
}

const currentMessages = computed(() => messageMap[locale.value] ?? messageMap.en)
const msgIdx = ref(0)
const msg = computed(() => currentMessages.value[msgIdx.value])
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    msgIdx.value = (msgIdx.value + 1) % currentMessages.value.length
  }, 2400)
})

onUnmounted(() => clearInterval(timer))
</script>

<style lang="scss" scoped>
$beam-duration: 3.6s;
$doc-width: 176px;
$doc-height: 232px;
$chip-width: 148px;

// ─── Outer shell ──────────────────────────────────────────────────────────────
.rv-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-8;
  padding: $space-8 $space-4;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-base;
  overflow: hidden;

  @media (min-width: $bp-mobile) { padding: $space-12 $space-8; }
}

// ─── Stage ────────────────────────────────────────────────────────────────────
.rv-loader__stage {
  position: relative;
  width: calc($doc-width + $chip-width * 2 + 32px);
  height: $doc-height;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: $bp-mobile) {
    width: $doc-width;
  }
}

// ─── Document ─────────────────────────────────────────────────────────────────
.rv-loader__doc {
  position: relative;
  width: $doc-width;
  height: $doc-height;
  background: #fff;
  border: 1px solid $color-border;
  border-radius: 6px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: doc-breathe 3.6s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes doc-breathe {
  0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03); }
  50%       { box-shadow: 0 4px 24px rgba($color-primary, 0.18), 0 0 0 1px rgba($color-primary, 0.12); }
}

// ─── Scan beam ────────────────────────────────────────────────────────────────
.rv-loader__beam {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, $color-primary 20%, $color-accent 80%, transparent 100%);
  box-shadow:
    0 0 8px 3px rgba($color-primary, 0.45),
    0 0 20px 8px rgba($color-primary, 0.18);
  border-radius: 1px;
  animation: beam-sweep $beam-duration cubic-bezier(0.45, 0, 0.55, 1) infinite;
  z-index: 2;
}

@keyframes beam-sweep {
  0%   { top: -2px;   opacity: 0; }
  4%   { opacity: 1; }
  96%  { opacity: 1; }
  100% { top: calc(100% + 2px); opacity: 0; }
}

// ─── Skeleton sections ────────────────────────────────────────────────────────
.rv-loader__section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;

  &:last-child { margin-bottom: 0; }
}

.rv-loader__header-cols {
  display: flex;
  gap: 8px;
}

// ─── Skeleton lines ───────────────────────────────────────────────────────────
.rv-loader__line {
  height: 7px;
  background: #e8eaf0;
  border-radius: 4px;

  &--thick { height: 11px; background: #d0d4e0; }
  &--full   { width: 100%; }
  &--long   { width: 88%; }
  &--med    { width: 70%; }
  &--half   { width: 52%; }
  &--third  { width: 32%; }
  &--short  { width: 48%; }
  &--xshort { width: 36%; }
}

// ─── Annotation chips ─────────────────────────────────────────────────────────
.rv-loader__chip {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: $font-weight-semibold;
  padding: 5px 10px;
  border-radius: 999px;
  white-space: nowrap;
  background: $color-surface;
  border: 1px solid $color-border;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: $chip-width;
  animation: chip-appear $beam-duration ease-in-out infinite;

  @media (max-width: $bp-mobile) { display: none; }

  &--left  {
    right: calc(50% + $doc-width * 0.5 + 12px);
    --tx: -10px;
  }
  &--right {
    left: calc(50% + $doc-width * 0.5 + 12px);
    --tx: 10px;
  }

  &--1 { top: 18%;  animation-delay: 0.5s;  }
  &--2 { top: 37%;  animation-delay: 1.25s; }
  &--3 { top: 60%;  animation-delay: 2.05s; }
  &--4 { top: 78%;  animation-delay: 2.7s;  }
}

@keyframes chip-appear {
  0%, 100% { opacity: 0; transform: translateX(var(--tx, 0)) scale(0.88); }
  10%, 34%  { opacity: 1; transform: translateX(0) scale(1); }
  44%       { opacity: 0; transform: translateX(var(--tx, 0)) scale(0.92); }
}

.rv-loader__chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;

  &--danger  { background: $color-error; }
  &--warning { background: #f97316; }
  &--success { background: $color-success; }
  &--primary { background: $color-primary; }
}

// ─── Message + progress ───────────────────────────────────────────────────────
.rv-loader__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
  width: 100%;
  max-width: 320px;
}

.rv-loader__msg {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-muted;
  text-align: center;
  letter-spacing: -0.01em;
}

.rv-loader__progress {
  width: 100%;
  height: 3px;
  background: $color-primary-light;
  border-radius: 99px;
  overflow: hidden;
}

.rv-loader__progress-bar {
  height: 100%;
  border-radius: 99px;
  background: $gradient-brand;
  animation: progress-scan $beam-duration ease-in-out infinite;
}

@keyframes progress-scan {
  0%   { width: 0%;   margin-left: 0; }
  50%  { width: 60%;  margin-left: 20%; }
  100% { width: 0%;   margin-left: 100%; }
}

// ─── Message transition ───────────────────────────────────────────────────────
.rv-msg-enter-active,
.rv-msg-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.rv-msg-enter-from   { opacity: 0; transform: translateY(5px); }
.rv-msg-leave-to     { opacity: 0; transform: translateY(-5px); }
</style>
