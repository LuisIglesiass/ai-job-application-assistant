import { randomUUID } from 'crypto'
import type { Application } from '~/features/job-tracker/types'
import { ALLOWED_STATUSES } from '~/features/job-tracker/types'

export default defineEventHandler(async (event): Promise<Application> => {
  const body = await readBody(event)

  const company     = typeof body?.company     === 'string' ? body.company.trim()     : ''
  const position    = typeof body?.position    === 'string' ? body.position.trim()    : ''
  const dateApplied = typeof body?.dateApplied === 'string' ? body.dateApplied        : new Date().toISOString().slice(0, 10)
  const status      = ALLOWED_STATUSES.includes(body?.status) ? body.status           : 'applied'
  const notes       = typeof body?.notes       === 'string' ? body.notes.trim()       : ''

  if (!company)  throw createError({ statusCode: 400, message: 'Company is required.' })
  if (!position) throw createError({ statusCode: 400, message: 'Position is required.' })

  const now = new Date().toISOString()
  const app: Application = {
    id: randomUUID(),
    company, position, dateApplied, status, notes,
    createdAt: now,
    updatedAt: now,
  }

  const apps = await getApplications()
  apps.unshift(app)
  await saveApplications(apps)
  return app
})
