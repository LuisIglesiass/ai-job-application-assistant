import { generateText } from '~/lib/ai-client'
import { withLanguage, sanitizeLanguage } from '~/lib/language-prompt'

interface OptimizeRequest {
  cv: string
  jobOffer: string
  outputLanguage?: string
}

export interface OptimizeResponse {
  matchAnalysis: {
    missingSkills: string[]
    weakAlignment: string[]
  }
  improvements: string[]
  rewrites: {
    summary: string
    experience: string[]
  }
}

const MIN_CHARS = { cv: 20, jobOffer: 20 }
const MAX_CHARS = { cv: 6000, jobOffer: 12000 }

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '\n[truncated]' : text
}

function safeParseJSON<T>(raw: string): T {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  return JSON.parse(cleaned) as T
}

const SYSTEM =
  'You are a strict and highly practical career optimization assistant. Analyze a CV against a job offer and improve it to maximize interview chances. Return ONLY valid JSON — no markdown, no extra text.'

function buildPrompt(cv: string, jobOffer: string): string {
  return `CV:
${cv}

Job Offer:
${jobOffer}

Return ONLY this JSON structure:
{
  "matchAnalysis": {
    "missingSkills": ["string"],
    "weakAlignment": ["string"]
  },
  "improvements": ["string"],
  "rewrites": {
    "summary": "string",
    "experience": ["string"]
  }
}

Rules:
- missingSkills: max 5 — only real, job-relevant gaps (e.g. "Angular experience", "REST API integration")
- weakAlignment: max 4 — areas where CV exists but is not well presented or relevant for this job
- improvements: max 5 — specific, actionable, directly improve chances for THIS job — no generic advice
- rewrites.summary: max 60 words, tailored to this job, relevant strengths only, no generic phrases
- rewrites.experience: max 3 bullet points, each under 18 words, focus on impact, use action verbs
- Think like a recruiter quickly scanning the CV to decide if the candidate is worth interviewing`
}

export default defineEventHandler(async (event): Promise<OptimizeResponse> => {
  const body = await readBody<OptimizeRequest>(event)

  const cv       = typeof body?.cv       === 'string' ? body.cv.trim()       : ''
  const jobOffer = typeof body?.jobOffer === 'string' ? body.jobOffer.trim() : ''

  if (!cv || cv.length < MIN_CHARS.cv) {
    throw createError({ statusCode: 400, message: 'Your CV is required and must have at least 20 characters.' })
  }
  if (!jobOffer || jobOffer.length < MIN_CHARS.jobOffer) {
    throw createError({ statusCode: 400, message: 'The job description is required and must have at least 20 characters.' })
  }

  const { aiApiKey } = useRuntimeConfig()
  if (!aiApiKey) {
    console.error('[optimize] AI_API_KEY is not configured')
    throw createError({ statusCode: 503, message: 'The AI service is not configured. Please contact support.' })
  }

  const outputLanguage = sanitizeLanguage(body.outputLanguage)

  let raw: string
  try {
    raw = await generateText({
      system: withLanguage(SYSTEM, outputLanguage),
      prompt: buildPrompt(truncate(cv, MAX_CHARS.cv), truncate(jobOffer, MAX_CHARS.jobOffer)),
      temperature: 0.2,
      maxTokens: 800,
      apiKey: aiApiKey,
    })
  } catch (err) {
    console.error('[optimize] AI generation failed:', err)
    throw createError({ statusCode: 502, message: 'The AI could not process your request. Please try again.' })
  }

  let parsed: OptimizeResponse
  try {
    parsed = safeParseJSON<OptimizeResponse>(raw)
  } catch {
    console.error('[optimize] Failed to parse AI response')
    throw createError({ statusCode: 502, message: 'AI returned an unexpected response format.' })
  }

  if (
    !parsed?.matchAnalysis ||
    !Array.isArray(parsed.matchAnalysis.missingSkills) ||
    !Array.isArray(parsed.matchAnalysis.weakAlignment) ||
    !Array.isArray(parsed.improvements) ||
    typeof parsed.rewrites?.summary !== 'string' ||
    !Array.isArray(parsed.rewrites?.experience)
  ) {
    console.error('[optimize] AI response missing required fields')
    throw createError({ statusCode: 502, message: 'AI response is incomplete.' })
  }

  return {
    matchAnalysis: {
      missingSkills: parsed.matchAnalysis.missingSkills.slice(0, 5),
      weakAlignment: parsed.matchAnalysis.weakAlignment.slice(0, 4),
    },
    improvements: parsed.improvements.slice(0, 5),
    rewrites: {
      summary:    parsed.rewrites.summary,
      experience: parsed.rewrites.experience.slice(0, 3),
    },
  }
})
