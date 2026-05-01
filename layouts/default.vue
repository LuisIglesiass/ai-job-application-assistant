<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="container app-header__inner">
        <a href="/" class="app-header__logo">
          <img
            src="~/assets/images/16-9-logo-ai.png"
            alt="AI Job Assistant"
            class="app-header__logo-img"
            width="160"
            height="40"
          />
        </a>
        <nav class="app-header__nav">
          <NuxtLink to="/" class="app-header__nav-link">{{ t('nav_job_match') }}</NuxtLink>
          <NuxtLink to="/review" class="app-header__nav-link">{{ t('nav_cv_review') }}</NuxtLink>
        </nav>
        <div class="app-header__right">
          <LangSwitcher />
          <span class="app-header__badge">Beta</span>
        </div>
      </div>
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
import { useI18n } from '~/composables/useI18n'

const year = new Date().getFullYear()
const { t } = useI18n()
</script>

<style lang="scss" scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.80);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid $color-border;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: $space-3;

    @media (min-width: $bp-mobile) { padding-block: $space-4; }
  }

  &__logo {
    display: flex;
    align-items: center;
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

  &__nav {
    display: flex;
    align-items: center;
    gap: $space-1;
  }

  &__nav-link {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-muted;
    text-decoration: none;
    padding: 6px 14px;
    border-radius: $border-radius-base;
    transition: color $transition-base, background $transition-base;

    &:hover {
      color: $color-primary;
      background: $color-primary-light;
    }

    &.router-link-active {
      color: $color-primary;
      background: $color-primary-light;
      font-weight: $font-weight-semibold;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__badge {
    font-size: 0.7rem;
    font-weight: $font-weight-semibold;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $color-primary;
    background: $color-primary-light;
    padding: 3px 10px;
    border-radius: 999px;
    border: 1px solid rgba($color-primary, 0.2);
  }
}

.app-main {
  flex: 1;
  padding-block: $space-8;

  @media (min-width: $bp-tablet) { padding-block: $space-12; }
}

.app-footer {
  border-top: 1px solid $color-border;
  padding-block: $space-6;

  &__text {
    font-size: $font-size-sm;
    color: $color-text-muted;
    text-align: center;
  }
}
</style>
