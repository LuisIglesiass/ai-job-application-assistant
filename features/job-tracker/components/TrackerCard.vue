<template>
  <div class="t-card" :class="`t-card--${app.status}`">

    <!-- Top row: company / position / date / delete -->
    <div class="t-card__top">
      <div class="t-card__info">
        <h3 class="t-card__company">{{ app.company }}</h3>
        <p class="t-card__position">{{ app.position }}</p>
      </div>
      <div class="t-card__actions">
        <time class="t-card__date" :datetime="app.dateApplied">{{ formatDate(app.dateApplied) }}</time>
        <button
          class="t-card__delete-btn"
          :class="{ 't-card__delete-btn--confirm': confirmingDelete }"
          :title="confirmingDelete ? t('tracker_delete_confirm') : 'Delete'"
          @click="handleDelete"
        >
          <template v-if="confirmingDelete">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            {{ t('tracker_delete_confirm') }}
          </template>
          <template v-else>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1.75 3.5h10.5M5.25 3.5V2.333A.583.583 0 0 1 5.833 1.75h2.334A.583.583 0 0 1 8.75 2.333V3.5M11.083 3.5l-.583 8.167A.583.583 0 0 1 9.917 12H4.083a.583.583 0 0 1-.583-.533L2.917 3.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
        </button>
      </div>
    </div>

    <!-- Status row -->
    <div class="t-card__mid">
      <StatusSelect
        v-model="localStatus"
        :disabled="saving"
        @update:model-value="saveStatus"
      />
      <span v-if="saving" class="t-card__saving" aria-label="Saving…">
        <svg class="t-card__spinner" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-dasharray="20" stroke-dashoffset="10"/>
        </svg>
      </span>
    </div>

    <!-- Notes -->
    <div class="t-card__notes">
      <textarea
        class="t-card__notes-input"
        v-model="localNotes"
        :placeholder="t('tracker_notes_ph')"
        rows="2"
        @blur="saveNotes"
        @keydown.ctrl.enter="saveNotes"
        @keydown.meta.enter="saveNotes"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Application, ApplicationStatus } from '../types'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{ app: Application }>()

const { t } = useI18n()
const { update, remove } = useApplications()

// ── Local state (mirrors props, so card stays responsive) ────────────────────
const localStatus       = ref<ApplicationStatus>(props.app.status)
const localNotes        = ref(props.app.notes)
const saving            = ref(false)
const confirmingDelete  = ref(false)
let   deleteTimer: ReturnType<typeof setTimeout> | null = null

// Sync when the app prop changes from outside (e.g. after a PATCH response)
watch(() => props.app.status, v => { localStatus.value = v })
watch(() => props.app.notes,  v => { if (document.activeElement !== notesEl.value) localNotes.value = v })

const notesEl = ref<HTMLTextAreaElement | null>(null)

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

// ── Actions ──────────────────────────────────────────────────────────────────
async function saveStatus(newStatus?: ApplicationStatus) {
  const next = newStatus ?? localStatus.value
  if (next === props.app.status) return
  localStatus.value = next
  saving.value = true
  try {
    await update(props.app.id, { status: next })
  } catch {
    localStatus.value = props.app.status   // revert on error
  } finally {
    saving.value = false
  }
}

async function saveNotes() {
  const trimmed = localNotes.value.trim()
  if (trimmed === props.app.notes.trim()) return
  saving.value = true
  try {
    await update(props.app.id, { notes: trimmed })
  } catch {
    localNotes.value = props.app.notes    // revert on error
  } finally {
    saving.value = false
  }
}

function handleDelete() {
  if (!confirmingDelete.value) {
    confirmingDelete.value = true
    deleteTimer = setTimeout(() => { confirmingDelete.value = false }, 3000)
    return
  }
  if (deleteTimer) clearTimeout(deleteTimer)
  remove(props.app.id)
}
</script>

<style lang="scss" scoped>
// ─── Status border colors ─────────────────────────────────────────────────
$s-applied:   $color-primary;
$s-interview: #f59e0b;
$s-offer:     $color-success;
$s-rejected:  #9ca3af;

.t-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: $border-radius-lg;
  border-left-width: 4px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow $transition-base, border-color $transition-base;

  &:hover { box-shadow: var(--shadow-base); }

  &--applied   { border-left-color: $s-applied; }
  &--interview { border-left-color: $s-interview; }
  &--offer     { border-left-color: $s-offer; }
  &--rejected  { border-left-color: $s-rejected; }
}

// ─── Top row ───────────────────────────────────────────────────────────────
.t-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
  padding: $space-4 $space-4 0;

  @media (min-width: $bp-mobile) { padding: $space-4 $space-6 0; }
}

.t-card__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.t-card__company {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: var(--color-text);
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.t-card__position {
  font-size: $font-size-sm;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.t-card__actions {
  display: flex;
  align-items: center;
  gap: $space-2;
  flex-shrink: 0;
}

.t-card__date {
  font-size: $font-size-sm;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.t-card__delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: $border-radius-sm;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.72rem;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: color $transition-base, background $transition-base, border-color $transition-base;

  &:hover:not(&--confirm) {
    color: $color-error;
    background: var(--color-danger-bg);
  }

  &--confirm {
    color: $color-error;
    background: var(--color-danger-bg);
    border-color: rgba($color-error, 0.25);
    animation: confirm-pulse 0.5s ease;
  }
}

@keyframes confirm-pulse {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.05); }
  100% { transform: scale(1); }
}

// ─── Mid row (status) ───────────────────────────────────────────────────────
.t-card__mid {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;

  @media (min-width: $bp-mobile) { padding: $space-3 $space-6; }
}

// ─── Saving spinner ─────────────────────────────────────────────────────────
.t-card__spinner {
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.t-card__saving { color: var(--color-text-muted); }

// ─── Notes ──────────────────────────────────────────────────────────────────
.t-card__notes {
  padding: 0 $space-4 $space-4;

  @media (min-width: $bp-mobile) { padding: 0 $space-6 $space-4; }
}

.t-card__notes-input {
  width: 100%;
  resize: vertical;
  min-height: 52px;
  padding: $space-2 $space-3;
  border: 1px solid transparent;
  border-radius: $border-radius-base;
  background: var(--color-surface-2, rgba(0,0,0,0.03));
  color: var(--color-text);
  font-size: $font-size-sm;
  line-height: $line-height-base;
  transition: border-color $transition-base, background $transition-base, box-shadow $transition-base;

  &::placeholder { color: var(--color-text-muted); opacity: 0.6; }

  &:hover {
    border-color: var(--color-border);
  }

  &:focus {
    outline: none;
    border-color: $color-primary;
    background: var(--color-surface);
    box-shadow: 0 0 0 3px rgba($color-primary, 0.10);
  }
}
</style>
