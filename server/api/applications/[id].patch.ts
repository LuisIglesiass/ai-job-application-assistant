import type { Application } from '~/features/job-tracker/types'
import { ALLOWED_STATUSES } from '~/features/job-tracker/types'

export default defineEventHandler(async (event): Promise<Application> => {
  const id   = getRouterParam(event, 'id') ?? ''
  const body = await readBody(event)

  const apps = await getApplications()
  const idx  = apps.findIndex(a => a.id === id)
  if (idx === -1) throw createError({ statusCode: 404, message: 'Application not found.' })

  const patch: Partial<Application> = {}
  if (typeof body?.company     === 'string') patch.company     = body.company.trim()
  if (typeof body?.position    === 'string') patch.position    = body.position.trim()
  if (typeof body?.dateApplied === 'string') patch.dateApplied = body.dateApplied
  if (ALLOWED_STATUSES.includes(body?.status))  patch.status  = body.status
  if (typeof body?.notes       === 'string') patch.notes       = body.notes.trim()

  apps[idx] = { ...apps[idx], ...patch, updatedAt: new Date().toISOString() }
  await saveApplications(apps)
  return apps[idx]
})
