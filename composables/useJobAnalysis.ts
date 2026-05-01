import { ref, computed } from 'vue'

interface AnalyzeResponse {
  coverLetter: string
  matchScore: number
  reason: string
  strengths: string[]
  weaknesses: string[]
}

export function useJobAnalysis() {
  const jobOffer = ref<string>('')
  const cv = ref<string>('')
  const softSkills = ref<string>('')
  const isPending = ref<boolean>(false)
  const result = ref<AnalyzeResponse | null>(null)
  const error = ref<string | null>(null)

  const canSubmit = computed(
    () => jobOffer.value.trim().length > 0 && cv.value.trim().length > 0,
  )

  async function handleAnalyze(): Promise<void> {
    if (!canSubmit.value) return

    isPending.value = true
    result.value = null
    error.value = null

    try {
      const data = await $fetch<AnalyzeResponse>('/api/analyze', {
        method: 'POST',
        body: { cv: cv.value, jobOffer: jobOffer.value, softSkills: softSkills.value || undefined },
      })
      result.value = data
    } catch {
      error.value = 'Something went wrong. Please try again.'
    } finally {
      isPending.value = false
    }
  }

  return { jobOffer, cv, softSkills, isPending, canSubmit, result, error, handleAnalyze }
}
