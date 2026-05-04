export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected'

export interface Application {
  id: string
  company: string
  position: string
  dateApplied: string   // 'YYYY-MM-DD'
  status: ApplicationStatus
  notes: string
  createdAt: string     // ISO timestamp
  updatedAt: string     // ISO timestamp
}

export const ALLOWED_STATUSES: ApplicationStatus[] = [
  'applied',
  'interview',
  'offer',
  'rejected',
]
