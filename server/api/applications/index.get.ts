import type { Application } from '~/features/job-tracker/types'

export default defineEventHandler(async (): Promise<Application[]> => {
  return await getApplications()
})
