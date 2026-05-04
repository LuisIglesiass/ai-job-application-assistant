export default defineEventHandler(async (event) => {
  const id   = getRouterParam(event, 'id') ?? ''
  const apps = await getApplications()
  const next = apps.filter(a => a.id !== id)

  if (next.length === apps.length) throw createError({ statusCode: 404, message: 'Application not found.' })

  await saveApplications(next)
  return { ok: true }
})
