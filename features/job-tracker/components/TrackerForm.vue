<template>
  <div class="t-form">
    <form class="t-form__inner" @submit.prevent="handleSubmit">

      <div class="t-form__grid">

        <!-- Company -->
        <div class="t-form__field">
          <label class="t-form__label" for="tf-company">
            {{ t('tracker_company') }}
          </label>
          <div class="t-form__input-wrap" :class="{ 'is-error': errors.company }">
            <svg class="t-form__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1.5" y="3.5" width="11" height="9" rx="1" stroke="currentColor" stroke-width="1.25"/>
              <path d="M4.5 3.5V2.5A.5.5 0 0 1 5 2h4a.5.5 0 0 1 .5.5v1M5.5 7h3M5.5 9.5h3" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
            </svg>
            <input
              id="tf-company"
              v-model="form.company"
              class="t-form__input"
              type="text"
              :placeholder="t('tracker_company_ph')"
              autocomplete="organization"
              @input="errors.company = ''"
            />
          </div>
          <span v-if="errors.company" class="t-form__error">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/>
              <path d="M6 4v2.5M6 8.5v.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            {{ errors.company }}
          </span>
        </div>

        <!-- Position -->
        <div class="t-form__field">
          <label class="t-form__label" for="tf-position">
            {{ t('tracker_position') }}
          </label>
          <div class="t-form__input-wrap" :class="{ 'is-error': errors.position }">
            <svg class="t-form__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="4.5" r="2" stroke="currentColor" stroke-width="1.25"/>
              <path d="M2 12c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
            </svg>
            <input
              id="tf-position"
              v-model="form.position"
              class="t-form__input"
              type="text"
              :placeholder="t('tracker_position_ph')"
              @input="errors.position = ''"
            />
          </div>
          <span v-if="errors.position" class="t-form__error">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/>
              <path d="M6 4v2.5M6 8.5v.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            {{ errors.position }}
          </span>
        </div>

        <!-- Date Applied -->
        <div class="t-form__field">
          <label class="t-form__label">{{ t('tracker_date_applied') }}</label>
          <DatePicker v-model="form.dateApplied" />
        </div>

        <!-- Status -->
        <div class="t-form__field">
          <label class="t-form__label">{{ t('tracker_status') }}</label>
          <StatusSelect v-model="form.status" />
        </div>

      </div>

      <!-- Notes (full width) -->
      <div class="t-form__field">
        <label class="t-form__label" for="tf-notes">
          {{ t('tracker_notes') }}
          <span class="t-form__label-hint">optional</span>
        </label>
        <textarea
          id="tf-notes"
          v-model="form.notes"
          class="t-form__textarea"
          :placeholder="t('tracker_notes_ph')"
          rows="3"
        />
      </div>

      <!-- Actions -->
      <div class="t-form__footer">
        <button type="button" class="t-form__cancel" @click="$emit('cancel')">
          {{ t('tracker_cancel') }}
        </button>
        <AppButton type="submit" :loading="submitting">
          {{ t('tracker_save') }}
        </AppButton>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ApplicationStatus } from '../types'
import { useI18n } from '~/composables/useI18n'

const emit = defineEmits<{ cancel: []; submitted: [] }>()

const { t } = useI18n()
const { create } = useApplications()

const today = new Date().toISOString().slice(0, 10)

const form = reactive({
  company:     '',
  position:    '',
  dateApplied: today,
  status:      'applied' as ApplicationStatus,
  notes:       '',
})

const errors     = reactive({ company: '', position: '' })
const submitting = ref(false)

function validate(): boolean {
  errors.company  = form.company.trim()  ? '' : t('tracker_err_company')
  errors.position = form.position.trim() ? '' : t('tracker_err_position')
  return !errors.company && !errors.position
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    await create({
      company:     form.company.trim(),
      position:    form.position.trim(),
      dateApplied: form.dateApplied,
      status:      form.status,
      notes:       form.notes.trim(),
    })
    Object.assign(form, { company: '', position: '', dateApplied: today, status: 'applied', notes: '' })
    emit('submitted')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
// ─── Card shell ───────────────────────────────────────────────────────────────
.t-form {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: $border-radius-lg;
  box-shadow: var(--shadow-base);
}

.t-form__inner {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  padding: $space-4;

  @media (min-width: $bp-mobile) { padding: $space-6; }
}

// ─── 2-column grid ────────────────────────────────────────────────────────────
.t-form__grid {
  display: grid;
  gap: $space-4;
  grid-template-columns: 1fr;

  @media (min-width: $bp-mobile) { grid-template-columns: 1fr 1fr; }
}

// ─── Field ────────────────────────────────────────────────────────────────────
.t-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.t-form__label {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: var(--color-text);
}

.t-form__label-hint {
  font-size: 0.7rem;
  font-weight: $font-weight-normal;
  color: var(--color-text-muted);
  letter-spacing: 0.03em;
}

// ─── Input wrapper (icon + input) ─────────────────────────────────────────────
.t-form__input-wrap {
  position: relative;
  display: flex;
  align-items: center;

  &.is-error .t-form__input {
    border-color: $color-error;
    background: var(--color-danger-bg);

    &:focus { box-shadow: 0 0 0 3px rgba($color-error, 0.12); }
  }
}

.t-form__icon {
  position: absolute;
  left: 11px;
  color: var(--color-text-muted);
  flex-shrink: 0;
  pointer-events: none;
  transition: color $transition-base;

  .t-form__input-wrap:focus-within & { color: $color-primary; }
}

// ─── Text / date inputs ───────────────────────────────────────────────────────
.t-form__input {
  width: 100%;
  height: 40px;
  padding: 0 $space-3 0 34px;   // left room for icon
  border: 1.5px solid var(--color-border);
  border-radius: $border-radius-base;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: $font-size-sm;
  transition: border-color $transition-base, box-shadow $transition-base, background $transition-base;

  &::placeholder { color: var(--color-text-muted); opacity: 0.55; }

  &:hover { border-color: var(--color-border-strong); }

  &:focus {
    outline: none;
    border-color: $color-primary;
    background: var(--color-surface);
    box-shadow: 0 0 0 3px rgba($color-primary, 0.12);
  }

}

// ─── Textarea ─────────────────────────────────────────────────────────────────
.t-form__textarea {
  width: 100%;
  min-height: 80px;
  padding: $space-2 $space-3;
  border: 1.5px solid var(--color-border);
  border-radius: $border-radius-base;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: $font-size-sm;
  line-height: $line-height-base;
  resize: vertical;
  transition: border-color $transition-base, box-shadow $transition-base;

  &::placeholder { color: var(--color-text-muted); opacity: 0.55; }
  &:hover { border-color: var(--color-border-strong); }
  &:focus {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.12);
  }
}

// ─── Error message ────────────────────────────────────────────────────────────
.t-form__error {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: $font-size-sm;
  color: $color-error;
  animation: err-in 0.2s ease;
}

@keyframes err-in {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

// ─── Footer ───────────────────────────────────────────────────────────────────
.t-form__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: $space-3;
  padding-top: $space-2;
  border-top: 1px solid var(--color-border);
}

.t-form__cancel {
  height: 40px;
  padding: 0 $space-4;
  border: 1.5px solid var(--color-border);
  border-radius: $border-radius-base;
  background: transparent;
  color: var(--color-text-muted);
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: color $transition-base, border-color $transition-base, background $transition-base;

  &:hover {
    color: var(--color-text);
    border-color: var(--color-border-strong);
    background: var(--color-surface-2, rgba(0,0,0,0.03));
  }
}
</style>
