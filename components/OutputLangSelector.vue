<template>
  <div class="output-lang">
    <span class="output-lang__label">{{ label }}</span>
    <div class="output-lang__options" role="group">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="output-lang__btn"
        :class="{ 'output-lang__btn--active': modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const options = [
  { value: 'German',     label: 'Deutsch'    },
  { value: 'English',    label: 'English'    },
  { value: 'Spanish',    label: 'Español'    },
  { value: 'Portuguese', label: 'Português'  },
]
</script>

<style lang="scss" scoped>
.output-lang {
  display: flex;
  align-items: center;
  gap: $space-3;
  flex-wrap: wrap;

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text;
    white-space: nowrap;
  }

  &__options {
    display: flex;
    gap: $space-2;
    flex-wrap: wrap;
  }

  &__btn {
    padding: 5px 14px;
    border: 1.5px solid $color-border;
    border-radius: $border-radius-base;
    background: transparent;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-muted;
    cursor: pointer;
    transition: color $transition-base, border-color $transition-base, background $transition-base, box-shadow $transition-base;

    &:hover:not(&--active) {
      border-color: $color-primary;
      color: $color-primary;
      background: $color-primary-light;
    }

    &--active {
      background: $gradient-brand;
      border-color: transparent;
      color: #fff;
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.30);
    }
  }
}
</style>
