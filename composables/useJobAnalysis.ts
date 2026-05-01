import { ref, computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

interface AnalyzeResponse {
  coverLetter: string
  matchScore: number
  reason: string
  strengths: string[]
  weaknesses: string[]
}

interface FieldErrors {
  cv: string | null
  jobOffer: string | null
}

const MIN_LENGTH = 20

export function useJobAnalysis() {
  const { t } = useI18n()

  const jobOffer      = ref<string>('')
  const cv            = ref<string>('')
  const softSkills    = ref<string>('')
  const outputLanguage = ref<string>('German')
  const isPending     = ref<boolean>(false)
  const result        = ref<AnalyzeResponse | null>(null)
  const error         = ref<string | null>(null)
  const fieldErrors   = ref<FieldErrors>({ cv: null, jobOffer: null })

  const canSubmit = computed(
    () => jobOffer.value.trim().length > 0 && cv.value.trim().length > 0,
  )

  function validate(): boolean {
    fieldErrors.value = { cv: null, jobOffer: null }

    if (!cv.value.trim()) {
      fieldErrors.value.cv = t('err_cv_required')
    } else if (cv.value.trim().length < MIN_LENGTH) {
      fieldErrors.value.cv = t('err_cv_short')
    }

    if (!jobOffer.value.trim()) {
      fieldErrors.value.jobOffer = t('err_job_required')
    } else if (jobOffer.value.trim().length < MIN_LENGTH) {
      fieldErrors.value.jobOffer = t('err_job_short')
    }

    return !fieldErrors.value.cv && !fieldErrors.value.jobOffer
  }

  function clearFieldError(field: keyof FieldErrors) {
    fieldErrors.value[field] = null
  }

  async function handleAnalyze(): Promise<void> {
    error.value = null

    if (!validate()) return

    isPending.value = true
    result.value = null

    try {
      const data = await $fetch<AnalyzeResponse>('/api/analyze', {
        method: 'POST',
        body: {
          cv: cv.value,
          jobOffer: jobOffer.value,
          softSkills: softSkills.value || undefined,
          outputLanguage: outputLanguage.value,
        },
      })
      result.value = data
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

  return {
    jobOffer, cv, softSkills, outputLanguage,
    isPending, canSubmit, result, error, fieldErrors,
    clearFieldError, handleAnalyze,
  }
}
