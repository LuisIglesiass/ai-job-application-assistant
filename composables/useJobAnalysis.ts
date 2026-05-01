import { ref, computed } from 'vue'

export function useJobAnalysis() {
  const jobOffer = ref<string>('')
  const cv = ref<string>('')
  const isPending = ref<boolean>(false)

  const canSubmit = computed(
    () => jobOffer.value.trim().length > 0 && cv.value.trim().length > 0,
  )

  async function handleAnalyze(): Promise<void> {
    if (!canSubmit.value) return

    isPending.value = true
    try {
      // TODO: call /api/analyze
    } finally {
      isPending.value = false
    }
  }

  return { jobOffer, cv, isPending, canSubmit, handleAnalyze }
}
