<template>
  <div class="app-textarea" :class="{ 'app-textarea--invalid': !!error }">
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
    <p v-if="error" class="app-textarea__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="app-textarea__hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  modelValue?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string | null
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
    font-weight: $font-weight-semibold;
    color: var(--color-text);
    letter-spacing: -0.01em;
  }

  &__required {
    color: $color-primary;
    margin-left: $space-1;
  }

  &__field {
    width: 100%;
    padding: $space-3 $space-4;
    border: 1.5px solid var(--color-border);
    border-radius: $border-radius-base;
    background-color: var(--color-surface-alpha);
    color: var(--color-text);
    resize: vertical;
    transition: border-color $transition-base, box-shadow $transition-base, background-color $transition-base;

    &::placeholder {
      color: var(--color-text-muted);
      opacity: 0.7;
    }

    &:focus {
      outline: none;
      border-color: $color-primary;
      background-color: var(--color-surface);
      box-shadow: $shadow-glow;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: var(--color-bg-disabled);
    }
  }

  &--invalid &__field {
    border-color: $color-error;
    &:focus { box-shadow: 0 0 0 4px rgba($color-error, 0.10); }
  }

  &__hint {
    font-size: $font-size-sm;
    color: var(--color-text-muted);
  }

  &__error {
    font-size: $font-size-sm;
    color: $color-error;
  }
}
</style>
