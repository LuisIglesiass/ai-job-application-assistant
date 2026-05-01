import { ref, computed } from 'vue'

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
  const jobOffer = ref<string>('')
  const cv = ref<string>('')
  const softSkills = ref<string>('')
  const isPending = ref<boolean>(false)
  const result = ref<AnalyzeResponse | null>(null)
  const error = ref<string | null>(null)
  const fieldErrors = ref<FieldErrors>({ cv: null, jobOffer: null })

  const canSubmit = computed(
    () => jobOffer.value.trim().length > 0 && cv.value.trim().length > 0,
  )

  function validate(): boolean {
    fieldErrors.value = { cv: null, jobOffer: null }

    if (!cv.value.trim()) {
      fieldErrors.value.cv = 'Please paste your CV before analyzing.'
    } else if (cv.value.trim().length < MIN_LENGTH) {
      fieldErrors.value.cv = 'Your CV is too short. Please add more detail.'
    }

    if (!jobOffer.value.trim()) {
      fieldErrors.value.jobOffer = 'Please paste the job description before analyzing.'
    } else if (jobOffer.value.trim().length < MIN_LENGTH) {
      fieldErrors.value.jobOffer = 'The job description is too short. Please add more detail.'
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
        body: { cv: cv.value, jobOffer: jobOffer.value, softSkills: softSkills.value || undefined },
      })
      result.value = data
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string }; status?: number } | null

      if (apiError?.status === 503) {
        error.value = 'The AI service is currently unavailable. Please try again later.'
      } else if (apiError?.data?.message) {
        error.value = apiError.data.message
      } else {
        error.value = 'Something went wrong. Please try again.'
      }
    } finally {
      isPending.value = false
    }
  }

  return { jobOffer, cv, softSkills, isPending, canSubmit, result, error, fieldErrors, clearFieldError, handleAnalyze }
}
