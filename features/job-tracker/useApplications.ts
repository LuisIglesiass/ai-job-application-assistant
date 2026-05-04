import { computed } from 'vue'
import type { Application, ApplicationStatus } from './types'

/**
 * Shared state for the job tracker.
 * Uses useState so any component that calls useApplications()
 * gets the same reactive store — no Pinia or Vuex needed.
 */
export function useApplications() {
  const applications = useState<Application[]>('tracker-apps',   () => [])
  const isLoading    = useState<boolean>('tracker-loading',      () => false)
  const activeFilter = useState<ApplicationStatus | 'all'>('tracker-filter', () => 'all')

  // ── Derived ─────────────────────────────────────────────────────────────────
  const filtered = computed(() =>
    activeFilter.value === 'all'
      ? applications.value
      : applications.value.filter(a => a.status === activeFilter.value),
  )

  const counts = computed(() => {
    const c = { all: 0, applied: 0, interview: 0, offer: 0, rejected: 0 }
    for (const app of applications.value) {
      c.all++
      c[app.status]++
    }
    return c
  })

  // ── API calls ────────────────────────────────────────────────────────────────
  async function fetchAll() {
    isLoading.value = true
    try {
      applications.value = await $fetch<Application[]>('/api/applications')
    } finally {
      isLoading.value = false
    }
  }

  async function create(data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
    const app = await $fetch<Application>('/api/applications', {
      method: 'POST',
      body: data,
    })
    applications.value.unshift(app)
    return app
  }

  async function update(
    id: string,
    patch: Partial<Pick<Application, 'status' | 'notes' | 'company' | 'position' | 'dateApplied'>>,
  ): Promise<Application> {
    const app = await $fetch<Application>(`/api/applications/${id}`, {
      method: 'PATCH',
      body: patch,
    })
    const idx = applications.value.findIndex(a => a.id === id)
    if (idx !== -1) applications.value[idx] = app
    return app
  }

  async function remove(id: string): Promise<void> {
    await $fetch(`/api/applications/${id}`, { method: 'DELETE' })
    applications.value = applications.value.filter(a => a.id !== id)
  }

  return {
    applications,
    filtered,
    counts,
    activeFilter,
    isLoading,
    fetchAll,
    create,
    update,
    remove,
  }
}
