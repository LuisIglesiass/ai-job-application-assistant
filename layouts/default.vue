<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="container app-header__inner">

        <a href="/" class="app-header__logo">
          <img
            :src="logoSrc"
            alt="AI Job Assistant"
            class="app-header__logo-img"
            width="160"
            height="40"
          />
        </a>

        <!-- Desktop nav (hidden on mobile) -->
        <nav class="app-header__nav">
          <NuxtLink to="/" class="app-header__nav-link">{{ t('nav_job_match') }}</NuxtLink>
          <NuxtLink to="/review" class="app-header__nav-link">{{ t('nav_cv_review') }}</NuxtLink>
          <NuxtLink to="/tracker" class="app-header__nav-link">{{ t('nav_tracker') }}</NuxtLink>
        </nav>

        <!-- Right controls -->
        <div class="app-header__right">
          <ThemeToggle />
          <!-- Lang switcher: desktop only -->
          <div class="app-header__lang-desktop">
            <LangSwitcher />
          </div>
          <span class="app-header__badge">Beta</span>

          <!-- Hamburger (mobile only) -->
          <button
            class="app-header__burger"
            type="button"
            :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="mobileOpen"
            @click="mobileOpen = !mobileOpen"
          >
            <svg
              class="app-header__burger-icon"
              :class="{ 'app-header__burger-icon--open': mobileOpen }"
              width="18" height="14" viewBox="0 0 18 14"
              fill="currentColor" aria-hidden="true"
            >
              <!-- All three bars share the same shape, positioned at center
                   and offset via transform so the morph to × is pixel-perfect -->
              <rect class="b-bar b-bar--1" x="0" y="6.25" width="18" height="1.5" rx="0.75"/>
              <rect class="b-bar b-bar--2" x="0" y="6.25" width="18" height="1.5" rx="0.75"/>
              <rect class="b-bar b-bar--3" x="0" y="6.25" width="18" height="1.5" rx="0.75"/>
            </svg>
          </button>
        </div>

      </div>

      <!-- Mobile menu -->
      <transition name="mobile-menu">
        <div v-if="mobileOpen" class="app-mobile-menu">
          <nav class="app-mobile-menu__nav">
            <NuxtLink
              to="/"
              class="app-mobile-menu__link"
              @click="mobileOpen = false"
            >
              {{ t('nav_job_match') }}
            </NuxtLink>
            <NuxtLink
              to="/review"
              class="app-mobile-menu__link"
              @click="mobileOpen = false"
            >
              {{ t('nav_cv_review') }}
            </NuxtLink>
            <NuxtLink
              to="/tracker"
              class="app-mobile-menu__link"
              @click="mobileOpen = false"
            >
              {{ t('nav_tracker') }}
            </NuxtLink>
          </nav>
          <div class="app-mobile-menu__footer">
            <LangSwitcher />
            <span class="app-header__badge" style="display:inline-block">Beta</span>
          </div>
        </div>
      </transition>
    </header>

    <main class="app-main">
      <div class="container">
        <slot />
      </div>
    </main>

    <footer class="app-footer">
      <div class="container">
        <p class="app-footer__text">MatchAI &copy; {{ year }} — Made by Luis Iglesias</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import logoLight from '~/assets/images/16-9-logo-ai.png'
import logoDark  from '~/assets/images/16-9-logo-ai-dark.png'
import { useI18n }  from '~/composables/useI18n'
import { useTheme } from '~/composables/useTheme'

const year = new Date().getFullYear()
const { t }          = useI18n()
const { isDark, init } = useTheme()
const logoSrc = computed(() => isDark.value ? logoDark : logoLight)

const mobileOpen = ref(false)

// Close menu on route change
const route = useRoute()
watch(() => route.path, () => { mobileOpen.value = false })

onMounted(() => init())
</script>

<style lang="scss" scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

// ─── Header ──────────────────────────────────────────────────────────────────
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: $space-3;
    padding-block: $space-3;
    max-width: 1100px;
  }

  &__logo {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    text-decoration: none;
    &:hover { text-decoration: none; }
  }

  &__logo-img {
    height: 44px;
    width: auto;
    display: block;
    object-fit: contain;

    @media (min-width: $bp-mobile) { height: 60px; }
    @media (min-width: $bp-tablet) { height: 80px; }
  }

  // Desktop nav — hidden below mobile breakpoint
  &__nav {
    display: none;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;

    @media (min-width: $bp-mobile) { display: flex; }
  }

  &__nav-link {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: var(--color-text-muted);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: $border-radius-base;
    white-space: nowrap;
    transition: color $transition-base, background $transition-base;

    &:hover {
      color: $color-primary;
      background: var(--color-primary-light);
    }

    &.router-link-active {
      color: $color-primary;
      background: var(--color-primary-light);
      font-weight: $font-weight-semibold;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $space-2;
    flex-shrink: 0;
  }

  // Lang switcher visible only on tablet+
  &__lang-desktop {
    display: none;
    @media (min-width: $bp-mobile) { display: flex; }
  }

  &__badge {
    display: none;
    font-size: 0.7rem;
    font-weight: $font-weight-semibold;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $color-primary;
    background: var(--color-primary-light);
    padding: 3px 10px;
    border-radius: 999px;
    border: 1px solid rgba($color-primary, 0.2);
    white-space: nowrap;

    @media (min-width: $bp-tablet) { display: inline-block; }
  }

  // ── Hamburger ─────────────────────────────────────────────────────────────
  &__burger {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: 1.5px solid var(--color-border);
    border-radius: $border-radius-base;
    background: transparent;
    color: var(--color-text);
    cursor: pointer;
    transition: background $transition-base, border-color $transition-base, color $transition-base;

    @media (min-width: $bp-mobile) { display: none; }

    &:hover {
      background: var(--color-primary-light);
      border-color: rgba($color-primary, 0.3);
      color: $color-primary;
    }
  }

  &__burger-icon {
    display: block;
    overflow: visible;
  }

  // ── SVG bars — all identical rects, offset via transform ──────────────────
  .b-bar {
    transform-box:    fill-box;
    transform-origin: center;
    transition:
      transform 240ms cubic-bezier(0.4, 0, 0.2, 1),
      opacity   180ms ease;
  }

  .b-bar--1 { transform: translateY(-5px); }
  .b-bar--2 { /* sits at center */ }
  .b-bar--3 { transform: translateY(5px); }

  .app-header__burger-icon--open {
    .b-bar--1 { transform: rotate(45deg); }
    .b-bar--2 { opacity: 0; transform: scaleX(0.1); }
    .b-bar--3 { transform: rotate(-45deg); }
  }
}

// ─── Mobile menu ─────────────────────────────────────────────────────────────
.app-mobile-menu {
  display: flex;
  flex-direction: column;
  gap: $space-1;
  padding: $space-3 $space-4 $space-4;
  border-top: 1px solid var(--color-border);
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  @media (min-width: $bp-mobile) { display: none; }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__link {
    display: flex;
    align-items: center;
    padding: $space-3 $space-3;
    border-radius: $border-radius-base;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color $transition-base, background $transition-base;

    &:hover {
      color: $color-primary;
      background: var(--color-primary-light);
    }

    &.router-link-active {
      color: $color-primary;
      background: var(--color-primary-light);
      font-weight: $font-weight-semibold;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding-top: $space-3;
    margin-top: $space-2;
    border-top: 1px solid var(--color-border);
  }
}

// ─── Mobile menu transition ───────────────────────────────────────────────────
.mobile-menu-enter-active {
  transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.mobile-menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// ─── Main & footer ────────────────────────────────────────────────────────────
.app-main {
  flex: 1;
  padding-block: $space-8;

  @media (min-width: $bp-tablet) { padding-block: $space-12; }
}

.app-footer {
  border-top: 1px solid var(--color-border);
  padding-block: $space-6;

  &__text {
    font-size: $font-size-sm;
    color: var(--color-text-muted);
    text-align: center;
  }
}
</style>
