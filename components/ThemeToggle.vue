<template>
  <button
    class="theme-toggle"
    :class="{ 'theme-toggle--dark': isDark }"
    type="button"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <span class="theme-toggle__track">
      <span class="theme-toggle__thumb">
        <!-- Sun (light mode) -->
        <svg v-if="!isDark" class="theme-toggle__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="4" fill="currentColor"/>
          <g stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <line x1="10" y1="2" x2="10" y2="4"/>
            <line x1="10" y1="16" x2="10" y2="18"/>
            <line x1="2" y1="10" x2="4" y2="10"/>
            <line x1="16" y1="10" x2="18" y2="10"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="14.36" y1="14.36" x2="15.78" y2="15.78"/>
            <line x1="4.22" y1="15.78" x2="5.64" y2="14.36"/>
            <line x1="14.36" y1="5.64" x2="15.78" y2="4.22"/>
          </g>
        </svg>
        <!-- Moon (dark mode) -->
        <svg v-else class="theme-toggle__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

const { isDark, toggle } = useTheme()
</script>

<style lang="scss" scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 999px;

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 3px;
  }

  &__track {
    position: relative;
    width: 44px;
    height: 24px;
    background: var(--color-border);
    border-radius: 999px;
    border: 1.5px solid var(--color-border-strong);
    transition: background 220ms ease, border-color 220ms ease;
    display: flex;
    align-items: center;
  }

  &--dark &__track {
    background: rgba($color-primary, 0.25);
    border-color: rgba($color-primary, 0.45);
  }

  &__thumb {
    position: absolute;
    left: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
    display: grid;
    place-items: center;
    transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), background 220ms ease;
    color: #f59e0b;
  }

  &--dark &__thumb {
    transform: translateX(20px);
    color: #818cf8;
  }

  &__icon {
    width: 11px;
    height: 11px;
    display: block;
  }
}
</style>
