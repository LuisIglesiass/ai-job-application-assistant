<template>
  <div class="app-textarea">
    <label v-if="label" :for="id" class="app-textarea__label">
      {{ label }}
      <span v-if="required" class="app-textarea__required" aria-hidden="true">*</span>
    </label>
    <textarea
      :id="id"
      class="app-textarea__field"
      :placeholder="placeholder"
      :rows="rows"
      :required="required"
      :disabled="disabled"
      :value="modelValue"
      @input="onInput"
    />
    <p v-if="hint" class="app-textarea__hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  modelValue?: string
  label?: string
  placeholder?: string
  hint?: string
  rows?: number
  required?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  rows: 6,
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event): void {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<style lang="scss" scoped>
.app-textarea {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text;
  }

  &__required {
    color: $color-error;
    margin-left: $space-1;
  }

  &__field {
    width: 100%;
    padding: $space-3;
    border: 1px solid $color-border;
    border-radius: $border-radius-base;
    background-color: $color-surface;
    color: $color-text;
    resize: vertical;
    transition: border-color $transition-base, box-shadow $transition-base;

    &::placeholder {
      color: $color-text-muted;
    }

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.12);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: $color-bg;
    }
  }

  &__hint {
    font-size: $font-size-sm;
    color: $color-text-muted;
  }
}
</style>
