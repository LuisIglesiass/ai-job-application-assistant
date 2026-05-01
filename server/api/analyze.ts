import { generateText } from '~/lib/ai-client'

interface AnalyzeRequest {
  cv: string
  jobOffer: string
}

interface AnalyzeResponse {
  coverLetter: string
  matchScore: number
  reason: string
  strengths: string[]
  weaknesses: string[]
}

const MAX_CHARS = { cv: 6000, jobOffer: 12000 }

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '\n[truncated]' : text
}

// ─── Cover Letter ────────────────────────────────────────────────────────────

const COVER_LETTER_SYSTEM =
  'You are a precise career assistant. Write concise and realistic cover letters. Avoid generic phrases. Respond ONLY with a valid JSON object — no markdown, no extra text.'

function coverLetterPrompt(cv: string, jobOffer: string): string {
  return `CV:
${cv}

Job Offer:
${jobOffer}

Task:
Write a professional cover letter in German.

Rules:
- Max 150 words
- Focus on relevant experience only
- No fluff
- No repetition
- Sound natural and human

Respond with this JSON structure only:
{"coverLetter": "string"}`
}

async function generateCoverLetter(cv: string, jobOffer: string, apiKey: string): Promise<string> {
  const raw = await generateText({
    system: COVER_LETTER_SYSTEM,
    prompt: coverLetterPrompt(cv, jobOffer),
    temperature: 0.4,
    maxTokens: 600,
    apiKey,
  })

  const parsed = JSON.parse(raw) as { coverLetter: string }

  if (typeof parsed.coverLetter !== 'string' || parsed.coverLetter.trim() === '') {
    throw new Error('coverLetter field missing or empty')
  }

  return parsed.coverLetter
}

// ─── Match Score ─────────────────────────────────────────────────────────────

const MATCH_SCORE_SYSTEM =
  'You are a precise career evaluator. You assess how well a candidate matches a job based on skills and experience. Be realistic and critical.'

function matchScorePrompt(cv: string, jobOffer: string): string {
  return `CV:
${cv}

Job Offer:
${jobOffer}

Task:
Evaluate how well the candidate matches the job.

Scoring rules:
- 90–100: very strong match
- 70–89: good match
- 50–69: partial match
- below 50: weak match

Instructions:
- Base the score on skills, experience, and relevance
- Be realistic (avoid inflated scores)
- Keep explanation short and concrete

Return ONLY valid JSON:
{"matchScore": number, "reason": "string"}

Constraints:
- reason max 30 words
- no markdown
- no extra text`
}

interface MatchScoreResult {
  matchScore: number
  reason: string
}

async function generateMatchScore(cv: string, jobOffer: string, apiKey: string): Promise<MatchScoreResult> {
  const raw = await generateText({
    system: MATCH_SCORE_SYSTEM,
    prompt: matchScorePrompt(cv, jobOffer),
    temperature: 0.2,
    maxTokens: 100,
    apiKey,
  })

  const parsed = JSON.parse(raw) as MatchScoreResult

  if (typeof parsed.matchScore !== 'number' || parsed.matchScore < 0 || parsed.matchScore > 100) {
    throw new Error('matchScore missing or out of range')
  }

  if (typeof parsed.reason !== 'string' || parsed.reason.trim() === '') {
    throw new Error('reason field missing or empty')
  }

  return parsed
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default defineEventHandler(async (event): Promise<AnalyzeResponse> => {
  const body = await readBody<AnalyzeRequest>(event)

  if (!body?.cv || typeof body.cv !== 'string' || body.cv.trim() === '') {
    throw createError({ statusCode: 400, message: 'Field "cv" is required and must be a non-empty string.' })
  }

  if (!body?.jobOffer || typeof body.jobOffer !== 'string' || body.jobOffer.trim() === '') {
    throw createError({ statusCode: 400, message: 'Field "jobOffer" is required and must be a non-empty string.' })
  }

  const cv = truncate(body.cv.trim(), MAX_CHARS.cv)
  const jobOffer = truncate(body.jobOffer.trim(), MAX_CHARS.jobOffer)
  const { aiApiKey } = useRuntimeConfig()

  try {
    const [coverLetter, { matchScore, reason }] = await Promise.all([
      generateCoverLetter(cv, jobOffer, aiApiKey),
      generateMatchScore(cv, jobOffer, aiApiKey),
    ])

    return {
      coverLetter,
      matchScore,
      reason,
      strengths: [],
      weaknesses: [],
    }
  } catch (err) {
    console.error('[analyze] generation failed:', err)
    throw createError({ statusCode: 502, message: 'AI service unavailable.' })
  }
})
