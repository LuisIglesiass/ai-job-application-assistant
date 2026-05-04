import { ref } from 'vue'
import type { ApplyResponse } from '~/server/api/apply'
import { useI18n } from '~/composables/useI18n'
import { useOutputLanguage } from '~/composables/useOutputLanguage'

export function useApply() {
  const { t } = useI18n()
  const { outputLanguage } = useOutputLanguage()
  const isPending = ref(false)
  const result    = ref<ApplyResponse | null>(null)
  const error     = ref<string | null>(null)

  async function apply(cv: string, jobOffer: string): Promise<void> {
    isPending.value = true
    result.value = null
    error.value = null

    try {
      result.value = await $fetch<ApplyResponse>('/api/apply', {
        method: 'POST',
        body: { cv, jobOffer, outputLanguage: outputLanguage.value },
      })
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string }; status?: number } | null

      if (apiError?.status === 503) {
        error.value = t('error_ai_unavailable')
      } else if (apiError?.data?.message) {
        error.value = apiError.data.message
      } else {
        error.value = t('error_generic')
      }
    } finally {
      isPending.value = false
    }
  }

  return { isPending, result, error, apply }
}
