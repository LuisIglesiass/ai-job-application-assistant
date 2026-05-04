<template>
  <div ref="rootEl" class="ss" :class="{ 'ss--open': open, 'ss--disabled': disabled }">

    <!-- Trigger -->
    <button
      ref="triggerEl"
      type="button"
      class="ss__trigger"
      :class="`ss__trigger--${modelValue}`"
      :disabled="disabled"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown.escape="close"
      @keydown.arrow-down.prevent="openAndFocus"
      @keydown.arrow-up.prevent="openAndFocus"
    >
      <span class="ss__dot" />
      <span class="ss__label">{{ currentLabel }}</span>
      <svg
        class="ss__chevron"
        width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"
      >
        <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.6"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Dropdown — rendered at <body> so overflow:hidden never clips it -->
    <Teleport to="body">
      <transition name="ss-drop">
        <ul
          v-if="open"
          ref="listEl"
          class="ss__list"
          :style="listStyle"
          role="listbox"
          @keydown.escape="close"
          @keydown.arrow-down.prevent="focusNext"
          @keydown.arrow-up.prevent="focusPrev"
        >
          <li
            v-for="opt in options"
            :key="opt.value"
            class="ss__option"
            :class="[`ss__option--${opt.value}`, { 'ss__option--active': modelValue === opt.value }]"
            role="option"
            :aria-selected="modelValue === opt.value"
            tabindex="-1"
            @click="select(opt.value)"
            @keydown.enter.prevent="select(opt.value)"
            @keydown.space.prevent="select(opt.value)"
          >
            <span class="ss__option-dot" />
            <span class="ss__option-label">{{ opt.label }}</span>
            <svg
              v-if="modelValue === opt.value"
              class="ss__check"
              width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
            >
              <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.7"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </li>
        </ul>
      </transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { CSSProperties } from 'vue'
import type { ApplicationStatus } from '../types'
import { useI18n } from '~/composables/useI18n'

const props = withDefaults(defineProps<{
  modelValue: ApplicationStatus
  disabled?:  boolean
}>(), { disabled: false })

const emit = defineEmits<{ 'update:modelValue': [value: ApplicationStatus] }>()

const { t } = useI18n()

const options = computed(() => [
  { value: 'applied'   as ApplicationStatus, label: t('status_applied')   },
  { value: 'interview' as ApplicationStatus, label: t('status_interview') },
  { value: 'offer'     as ApplicationStatus, label: t('status_offer')     },
  { value: 'rejected'  as ApplicationStatus, label: t('status_rejected')  },
])

const currentLabel = computed(
  () => options.value.find(o => o.value === props.modelValue)?.label ?? props.modelValue,
)

// ── Refs ─────────────────────────────────────────────────────────────────────
const open      = ref(false)
const rootEl    = ref<HTMLElement | null>(null)
const triggerEl = ref<HTMLButtonElement | null>(null)
const listEl    = ref<HTMLElement | null>(null)
const listStyle = ref<CSSProperties>({})

// ── Positioning (needed because we Teleport to body) ─────────────────────────
function recalcPosition() {
  if (!triggerEl.value) return
  const r = triggerEl.value.getBoundingClientRect()
  listStyle.value = {
    position: 'fixed',
    top:      `${r.bottom + 6}px`,
    left:     `${r.left}px`,
    minWidth: `${Math.max(r.width, 160)}px`,
    zIndex:   '9999',
  }
}

// ── Open / close ─────────────────────────────────────────────────────────────
function toggle() {
  if (props.disabled) return
  open.value ? close() : openDropdown()
}

function openDropdown() {
  recalcPosition()
  open.value = true
}

function close() {
  open.value = false
}

function openAndFocus() {
  if (props.disabled) return
  recalcPosition()
  open.value = true
  nextTick(() => {
    listEl.value?.querySelector<HTMLElement>('.ss__option--active')?.focus()
      ?? listEl.value?.querySelector<HTMLElement>('.ss__option')?.focus()
  })
}

// Click outside
function onClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (
    rootEl.value  && !rootEl.value.contains(target) &&
    listEl.value  && !listEl.value.contains(target)
  ) close()
}

// Reposition on scroll / resize so the list follows the trigger
function onScroll() { if (open.value) recalcPosition() }

onMounted(() => {
  document.addEventListener('click',  onClickOutside, true)
  window.addEventListener('scroll',   onScroll, true)
  window.addEventListener('resize',   onScroll)
})
onBeforeUnmount(() => {
  document.removeEventListener('click',  onClickOutside, true)
  window.removeEventListener('scroll',   onScroll, true)
  window.removeEventListener('resize',   onScroll)
})

// ── Selection ─────────────────────────────────────────────────────────────────
function select(value: ApplicationStatus) {
  emit('update:modelValue', value)
  close()
}

// ── Keyboard navigation ───────────────────────────────────────────────────────
function getFocusable() {
  return [...(listEl.value?.querySelectorAll<HTMLElement>('.ss__option') ?? [])]
}
function focusNext() {
  const items = getFocusable()
  const idx = items.findIndex(el => el === document.activeElement)
  items[Math.min(idx + 1, items.length - 1)]?.focus()
}
function focusPrev() {
  const items = getFocusable()
  const idx = items.findIndex(el => el === document.activeElement)
  items[Math.max(idx - 1, 0)]?.focus()
}
</script>

<style lang="scss" scoped>
$s-applied:   $color-primary;
$s-interview: #f59e0b;
$s-offer:     $color-success;
$s-rejected:  #9ca3af;

// ── Root ──────────────────────────────────────────────────────────────────────
.ss {
  position: relative;
  display: inline-block;
  user-select: none;
}

// ── Trigger ───────────────────────────────────────────────────────────────────
.ss__trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1.5px solid transparent;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: $font-weight-semibold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    color            $transition-base,
    border-color     $transition-base,
    background-color $transition-base,
    box-shadow       $transition-base;

  &--applied   { color: $s-applied;   border-color: rgba($s-applied,   0.35); background: rgba($s-applied,   0.08); }
  &--interview { color: $s-interview; border-color: rgba($s-interview, 0.35); background: rgba($s-interview, 0.08); }
  &--offer     { color: $s-offer;     border-color: rgba($s-offer,     0.35); background: rgba($s-offer,     0.08); }
  &--rejected  { color: $s-rejected;  border-color: rgba($s-rejected,  0.35); background: rgba($s-rejected,  0.06); }

  &:hover:not(:disabled) {
    filter: brightness(1.06);
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  }

  .ss--open & {
    border-color: $color-primary;
    color: $color-primary;
    background: var(--color-primary-light);
    box-shadow: 0 0 0 3px rgba($color-primary, 0.12);
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.2);
  }
}

.ss__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
  .ss--open .ss__trigger & { background: $color-primary; }
}

.ss__chevron {
  color: currentColor;
  opacity: 0.65;
  transition: transform $transition-base;
  flex-shrink: 0;
  .ss--open & { transform: rotate(180deg); }
}

// ── Dropdown list  (Teleported → body, so NO scoped attr from parent card)
// These rules target the teleported element via :global so scoping doesn't
// strip the selectors.
</style>

<!-- Unscoped block for the teleported content -->
<style lang="scss">
$s-applied:   #4f46e5;
$s-interview: #f59e0b;
$s-offer:     #059669;
$s-rejected:  #9ca3af;

.ss__list {
  list-style: none;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #e4e3f5);
  border-radius: 12px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.13),
    0 2px  8px rgba(0, 0, 0, 0.07);
  padding: 4px;
  overflow: hidden;
}

.ss__option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--color-text, #1a1740);
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
  outline: none;

  &:hover,
  &:focus {
    background: var(--color-primary-light, #eef2ff);
    color: $s-applied;

    .ss__option-dot { background: $s-applied !important; }
  }

  &--active {
    font-weight: 600;
  }
}

.ss__option-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background 120ms ease;

  .ss__option--applied   & { background: $s-applied; }
  .ss__option--interview & { background: $s-interview; }
  .ss__option--offer     & { background: $s-offer; }
  .ss__option--rejected  & { background: $s-rejected; }
}

.ss__option-label { flex: 1; }

.ss__check {
  color: $s-applied;
  flex-shrink: 0;
  opacity: 0.85;
}

// ── Transition ────────────────────────────────────────────────────────────────
.ss-drop-enter-active {
  transition: opacity 0.14s ease, transform 0.18s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.ss-drop-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.ss-drop-enter-from,
.ss-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
