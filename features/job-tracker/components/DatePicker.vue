<template>
  <div ref="rootEl" class="dp">

    <!-- Trigger — same visual language as the text inputs -->
    <button
      ref="triggerEl"
      type="button"
      class="dp__trigger"
      :class="{ 'dp__trigger--open': open }"
      @click="toggle"
      @keydown.escape="close"
    >
      <svg class="dp__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" stroke-width="1.25"/>
        <path d="M1.5 6h11M4.5 1v3M9.5 1v3" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
      </svg>
      <span class="dp__value" :class="{ 'dp__value--empty': !modelValue }">
        {{ displayValue }}
      </span>
      <svg class="dp__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
        <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.6"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Calendar — Teleported so overflow:hidden never clips it -->
    <Teleport to="body">
      <transition name="dp-pop">
        <div
          v-if="open"
          ref="calEl"
          class="dp__cal"
          :style="calStyle"
          @click.stop
        >

          <!-- Month / year navigation -->
          <div class="dp__nav">
            <button type="button" class="dp__nav-btn" :title="'Previous month'" @click="prevMonth">
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
                <path d="M7 1L1 6.5 7 12" stroke="currentColor" stroke-width="1.6"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button type="button" class="dp__nav-label" @click="toggleYearView">
              {{ monthYear }}
            </button>
            <button type="button" class="dp__nav-btn" :title="'Next month'" @click="nextMonth">
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
                <path d="M1 1l6 5.5L1 12" stroke="currentColor" stroke-width="1.6"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Year picker (shows on label click) -->
          <div v-if="showYearView" class="dp__years">
            <button
              v-for="y in yearRange"
              :key="y"
              type="button"
              class="dp__year"
              :class="{ 'dp__year--active': y === viewYear }"
              @click="selectYear(y)"
            >
              {{ y }}
            </button>
          </div>

          <!-- Day view -->
          <template v-else>
            <!-- Weekday headers -->
            <div class="dp__weekdays">
              <span v-for="wd in weekdays" :key="wd" class="dp__wd">{{ wd }}</span>
            </div>

            <!-- Day grid -->
            <div class="dp__days">
              <button
                v-for="day in calendarDays"
                :key="day.key"
                type="button"
                class="dp__day"
                :class="{
                  'dp__day--other':    day.other,
                  'dp__day--today':    day.isToday,
                  'dp__day--selected': day.isSelected,
                }"
                :tabindex="day.other ? -1 : 0"
                @click="!day.other && selectDay(day.iso)"
              >
                {{ day.d }}
              </button>
            </div>

            <!-- Today shortcut -->
            <div class="dp__footer">
              <button type="button" class="dp__today-btn" @click="goToday">
                Today
              </button>
            </div>
          </template>

        </div>
      </transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { CSSProperties } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit  = defineEmits<{ 'update:modelValue': [v: string] }>()

// ── Display ───────────────────────────────────────────────────────────────────
const displayValue = computed(() => {
  if (!props.modelValue) return '—'
  const d = new Date(props.modelValue + 'T00:00:00')
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
})

// ── Calendar view state ───────────────────────────────────────────────────────
const todayISO = new Date().toISOString().slice(0, 10)

function parseISO(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return { year: d.getFullYear(), month: d.getMonth() }
}

const initial    = props.modelValue ? parseISO(props.modelValue) : parseISO(todayISO)
const viewYear   = ref(initial.year)
const viewMonth  = ref(initial.month)   // 0–11
const showYearView = ref(false)

// Sync view when value changes externally
watch(() => props.modelValue, v => {
  if (v) {
    const { year, month } = parseISO(v)
    viewYear.value  = year
    viewMonth.value = month
  }
})

// ── Weekday headers (locale-aware, Monday-first) ───────────────────────────────
const weekdays = computed(() => {
  const monday = new Date(2024, 0, 1) // Jan 1 2024 is a Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(1 + i)
    return d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2)
  })
})

// ── Month/year label ──────────────────────────────────────────────────────────
const monthYear = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1)
    .toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
)

// ── Calendar day grid ─────────────────────────────────────────────────────────
interface CalDay {
  key: string; d: number; iso: string
  other: boolean; isToday: boolean; isSelected: boolean
}

const calendarDays = computed((): CalDay[] => {
  const y = viewYear.value
  const m = viewMonth.value

  const firstWeekday   = new Date(y, m, 1).getDay()
  const leadingCount   = (firstWeekday + 6) % 7     // Monday = 0
  const daysInMonth    = new Date(y, m + 1, 0).getDate()
  const daysInPrevMon  = new Date(y, m, 0).getDate()

  const pad = (n: number) => String(n).padStart(2, '0')
  const iso  = (year: number, mon: number, day: number) =>
    `${year}-${pad(mon + 1)}-${pad(day)}`

  const days: CalDay[] = []

  // Leading (prev month)
  for (let i = leadingCount; i > 0; i--) {
    const d = daysInPrevMon - i + 1
    const pm = m === 0 ? 11 : m - 1
    const py = m === 0 ? y - 1 : y
    days.push({ key: `p${i}`, d, iso: iso(py, pm, d), other: true, isToday: false, isSelected: false })
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const s = iso(y, m, d)
    days.push({ key: `c${d}`, d, iso: s, other: false, isToday: s === todayISO, isSelected: s === props.modelValue })
  }

  // Trailing (next month) — fill to 42 cells (6 rows)
  for (let d = 1; days.length < 42; d++) {
    const nm = m === 11 ? 0  : m + 1
    const ny = m === 11 ? y + 1 : y
    days.push({ key: `n${d}`, d, iso: iso(ny, nm, d), other: true, isToday: false, isSelected: false })
  }

  return days
})

// ── Year range ────────────────────────────────────────────────────────────────
const yearRange = computed(() => {
  const cur = new Date().getFullYear()
  return Array.from({ length: 12 }, (_, i) => cur - 5 + i)
})

// ── Navigation ────────────────────────────────────────────────────────────────
function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
  showYearView.value = false
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
  showYearView.value = false
}
function toggleYearView() { showYearView.value = !showYearView.value }
function selectYear(y: number) {
  viewYear.value = y
  showYearView.value = false
}

// ── Selection ─────────────────────────────────────────────────────────────────
function selectDay(iso: string) {
  emit('update:modelValue', iso)
  close()
}
function goToday() {
  const { year, month } = parseISO(todayISO)
  viewYear.value  = year
  viewMonth.value = month
  showYearView.value = false
  emit('update:modelValue', todayISO)
  close()
}

// ── Open / close + positioning ────────────────────────────────────────────────
const open      = ref(false)
const rootEl    = ref<HTMLElement | null>(null)
const triggerEl = ref<HTMLButtonElement | null>(null)
const calEl     = ref<HTMLElement | null>(null)
const calStyle  = ref<CSSProperties>({})

function recalc() {
  if (!triggerEl.value) return
  const r = triggerEl.value.getBoundingClientRect()
  calStyle.value = { position: 'fixed', top: `${r.bottom + 6}px`, left: `${r.left}px`, zIndex: '9999' }
}

function toggle() { open.value ? close() : openCal() }
function openCal() { recalc(); open.value = true }
function close()  { open.value = false; showYearView.value = false }

function onClickOutside(e: MouseEvent) {
  const t = e.target as Node
  if (rootEl.value?.contains(t) || calEl.value?.contains(t)) return
  close()
}
function onScroll() { if (open.value) recalc() }

onMounted(() => {
  document.addEventListener('click', onClickOutside, true)
  window.addEventListener('scroll',  onScroll, true)
  window.addEventListener('resize',  onScroll)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside, true)
  window.removeEventListener('scroll',  onScroll, true)
  window.removeEventListener('resize',  onScroll)
})
</script>

<style lang="scss" scoped>
// ── Trigger ───────────────────────────────────────────────────────────────────
.dp { position: relative; display: block; width: 100%; }

.dp__trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 40px;
  padding: 0 $space-3;
  border: 1.5px solid var(--color-border);
  border-radius: $border-radius-base;
  background: var(--color-surface);
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
  transition: border-color $transition-base, box-shadow $transition-base;

  &:hover { border-color: var(--color-border-strong); }

  &:focus-visible,
  &--open {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.12);
  }
}

.dp__icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
  transition: color $transition-base;
  .dp__trigger--open &,
  .dp__trigger:focus-visible & { color: $color-primary; }
}

.dp__value {
  flex: 1;
  font-size: $font-size-sm;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &--empty { color: var(--color-text-muted); opacity: 0.55; }
}

.dp__chevron {
  color: var(--color-text-muted);
  flex-shrink: 0;
  transition: transform $transition-base;
  .dp__trigger--open & { transform: rotate(180deg); }
}

// ── Transition ────────────────────────────────────────────────────────────────
.dp-pop-enter-active { transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.34,1.3,0.64,1); }
.dp-pop-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.dp-pop-enter-from,
.dp-pop-leave-to     { opacity: 0; transform: translateY(-6px) scale(0.97); }
</style>

<!-- Unscoped — calendar is Teleported to <body> -->
<style lang="scss">
.dp__cal {
  width: 272px;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #e4e3f5);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  user-select: none;
}

// ── Navigation header ─────────────────────────────────────────────────────────
.dp__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 10px;
  border-bottom: 1px solid var(--color-border, #e4e3f5);
}

.dp__nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted, #6b6b8a);
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;

  &:hover {
    background: var(--color-primary-light, #eef2ff);
    color: #4f46e5;
  }
}

.dp__nav-label {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text, #1a1740);
  letter-spacing: -0.01em;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 120ms ease, color 120ms ease;

  &:hover {
    background: var(--color-primary-light, #eef2ff);
    color: #4f46e5;
  }
}

// ── Weekday row ───────────────────────────────────────────────────────────────
.dp__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 8px 10px 4px;
}

.dp__wd {
  text-align: center;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted, #6b6b8a);
}

// ── Day grid ──────────────────────────────────────────────────────────────────
.dp__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  padding: 4px 10px 10px;
}

.dp__day {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin: 0 auto;
  border: none;
  border-radius: 50%;
  background: transparent;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text, #1a1740);
  cursor: pointer;
  transition: background 100ms ease, color 100ms ease;

  &:hover:not(&--other):not(&--selected) {
    background: var(--color-primary-light, #eef2ff);
    color: #4f46e5;
  }

  // Days from prev/next month
  &--other {
    color: var(--color-text-muted, #6b6b8a);
    opacity: 0.35;
    cursor: default;
    pointer-events: none;
  }

  // Today indicator — indigo ring
  &--today:not(&--selected) {
    color: #4f46e5;
    font-weight: 700;
    box-shadow: inset 0 0 0 1.5px rgba(79,70,229,0.55);
  }

  // Selected — filled indigo pill
  &--selected {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: #fff !important;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(79,70,229,0.35);
  }
}

// ── Year picker ───────────────────────────────────────────────────────────────
.dp__years {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 10px;
}

.dp__year {
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--color-text, #1a1740);
  cursor: pointer;
  transition: background 100ms ease, color 100ms ease;

  &:hover {
    background: var(--color-primary-light, #eef2ff);
    color: #4f46e5;
  }

  &--active {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: #fff !important;
    font-weight: 700;
  }
}

// ── Footer ────────────────────────────────────────────────────────────────────
.dp__footer {
  display: flex;
  justify-content: center;
  padding: 8px 10px 10px;
  border-top: 1px solid var(--color-border, #e4e3f5);
}

.dp__today-btn {
  border: none;
  background: transparent;
  font-size: 0.78rem;
  font-weight: 600;
  color: #4f46e5;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 6px;
  transition: background 100ms ease;
  letter-spacing: 0.01em;

  &:hover { background: var(--color-primary-light, #eef2ff); }
}
</style>
