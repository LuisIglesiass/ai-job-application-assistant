import { generateText } from '~/lib/ai-client'
import { withLanguage, sanitizeLanguage } from '~/lib/language-prompt'

interface ApplyRequest {
  cv: string
  jobOffer: string
  outputLanguage?: string
}

export interface ApplyResponse {
  optimizedCV: {
    summary: string
    experience: string[]
  }
  coverLetter: string
  keywords: string[]
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
  'You are a highly precise career optimization assistant. Create a fully optimized job application based on a CV and a job offer. Return ONLY valid JSON — no markdown, no extra text.'

function buildPrompt(cv: string, jobOffer: string): string {
  return `CV:
${cv}

Job Offer:
${jobOffer}

Return ONLY this JSON structure:
{
  "optimizedCV": {
    "summary": "string",
    "experience": ["string"]
  },
  "coverLetter": "string",
  "keywords": ["string"]
}

Rules:
- optimizedCV.summary: max 60 words, tailored to this job, relevant experience only, no generic phrases
- optimizedCV.experience: max 4 bullet points, each under 18 words, focus on impact and relevance, use action verbs
- coverLetter: max 150 words, professional tone, highly tailored to the job, no generic phrases, clear value proposition
- keywords: max 8 items — most relevant skills, technologies, and concepts that match the job description
- Think like a recruiter reviewing applications quickly
- Goal: produce an application that stands out and is highly aligned with the job requirements`
}

export default defineEventHandler(async (event): Promise<ApplyResponse> => {
  const body = await readBody<ApplyRequest>(event)

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
    console.error('[apply] AI_API_KEY is not configured')
    throw createError({ statusCode: 503, message: 'The AI service is not configured. Please contact support.' })
  }

  const outputLanguage = sanitizeLanguage(body.outputLanguage)

  let raw: string
  try {
    raw = await generateText({
      system: withLanguage(SYSTEM, outputLanguage),
      prompt: buildPrompt(truncate(cv, MAX_CHARS.cv), truncate(jobOffer, MAX_CHARS.jobOffer)),
      temperature: 0.2,
      maxTokens: 900,
      apiKey: aiApiKey,
    })
  } catch (err) {
    console.error('[apply] AI generation failed:', err)
    throw createError({ statusCode: 502, message: 'The AI could not process your request. Please try again.' })
  }

  let parsed: ApplyResponse
  try {
    parsed = safeParseJSON<ApplyResponse>(raw)
  } catch {
    console.error('[apply] Failed to parse AI response')
    throw createError({ statusCode: 502, message: 'AI returned an unexpected response format.' })
  }

  if (
    typeof parsed?.optimizedCV?.summary !== 'string' ||
    !Array.isArray(parsed?.optimizedCV?.experience) ||
    typeof parsed?.coverLetter !== 'string' ||
    !Array.isArray(parsed?.keywords)
  ) {
    console.error('[apply] AI response missing required fields')
    throw createError({ statusCode: 502, message: 'AI response is incomplete.' })
  }

  return {
    optimizedCV: {
      summary:    parsed.optimizedCV.summary,
      experience: parsed.optimizedCV.experience.slice(0, 4),
    },
    coverLetter: parsed.coverLetter,
    keywords:    parsed.keywords.slice(0, 8),
  }
})
