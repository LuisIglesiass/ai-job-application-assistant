import { ref } from 'vue'
import type { ReviewResponse } from '~/server/api/review'
import { useI18n } from '~/composables/useI18n'

export function useReview() {
  const { t } = useI18n()
  const isPending = ref(false)
  const result    = ref<ReviewResponse | null>(null)
  const error     = ref<string | null>(null)

  async function review(cv: string): Promise<void> {
    isPending.value = true
    result.value = null
    error.value = null

    try {
      result.value = await $fetch<ReviewResponse>('/api/review', {
        method: 'POST',
        body: { cv },
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

  return { isPending, result, error, review }
}
