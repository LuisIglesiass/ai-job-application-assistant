/**
 * Storage abstraction for job applications.
 *
 * Currently uses Nitro's fs driver (writes to .data/applications.json).
 * To swap backends, update the 'data' driver in nuxt.config.ts — this
 * file stays the same regardless of underlying storage.
 */
import type { Application } from '~/features/job-tracker/types'

const STORAGE_KEY = 'applications'

export async function getApplications(): Promise<Application[]> {
  return (await useStorage('data').getItem<Application[]>(STORAGE_KEY)) ?? []
}

export async function saveApplications(apps: Application[]): Promise<void> {
  await useStorage('data').setItem(STORAGE_KEY, apps)
}
