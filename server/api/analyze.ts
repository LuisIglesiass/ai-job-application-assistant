import { generateText } from '~/lib/ai-client'

interface AnalyzeRequest {
  cv: string
  jobOffer: string
  softSkills?: string
}

interface AnalyzeResponse {
  coverLetter: string
  matchScore: number
  reason: string
  strengths: string[]
  weaknesses: string[]
}

const MIN_CHARS = { cv: 20, jobOffer: 20 }
const MAX_CHARS = { cv: 6000, jobOffer: 12000, softSkills: 800 }

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '\n[truncated]' : text
}

function safeParseJSON<T>(raw: string): T {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  return JSON.parse(cleaned) as T
}

// ─── Cover Letter ────────────────────────────────────────────────────────────

const COVER_LETTER_SYSTEM =
  'You are a precise career assistant. Write concise and realistic cover letters. Avoid generic phrases. Respond ONLY with a valid JSON object — no markdown, no extra text.'

function coverLetterPrompt(cv: string, jobOffer: string, softSkills?: string): string {
  const softSkillsBlock = softSkills
    ? `\nCandidate's soft skills:\n${softSkills}\n- Weave 1–2 of the most relevant ones naturally into the letter\n- Do NOT list them explicitly — integrate them through examples or tone\n`
    : ''

  return `CV:
${cv}

Job Offer:
${jobOffer}
${softSkillsBlock}
Task:
Write a professional cover letter in German.

Rules:
- Max 180 words
- Focus on relevant experience and fit
- No fluff, no repetition
- Sound natural and human

Respond with this JSON structure only:
{"coverLetter": "string"}`
}

async function generateCoverLetter(cv: string, jobOffer: string, apiKey: string, softSkills?: string): Promise<string> {
  const raw = await generateText({
    system: COVER_LETTER_SYSTEM,
    prompt: coverLetterPrompt(cv, jobOffer, softSkills),
    temperature: 0.4,
    maxTokens: 600,
    apiKey,
  })

  const parsed = safeParseJSON<{ coverLetter: string }>(raw)

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

  const parsed = safeParseJSON<MatchScoreResult>(raw)

  if (typeof parsed.matchScore !== 'number' || parsed.matchScore < 0 || parsed.matchScore > 100) {
    throw new Error('matchScore missing or out of range')
  }

  if (typeof parsed.reason !== 'string' || parsed.reason.trim() === '') {
    throw new Error('reason field missing or empty')
  }

  return parsed
}

// ─── Strengths & Weaknesses ───────────────────────────────────────────────────

const STRENGTHS_WEAKNESSES_SYSTEM =
  'You are a strict and practical career evaluator. You identify relevant strengths and weaknesses based on job requirements. Be concise and realistic.'

function strengthsWeaknessesPrompt(cv: string, jobOffer: string): string {
  return `CV:
${cv}

Job Offer:
${jobOffer}

Task:
Identify key strengths and weaknesses of the candidate relative to the job.

Instructions:
- Focus only on relevant points
- Avoid generic phrases
- Be specific and concrete
- Think like a recruiter

Return ONLY valid JSON:
{"strengths": ["string"], "weaknesses": ["string"]}

Constraints:
- strengths: max 4 items
- weaknesses: max 3 items
- each item max 10 words
- no repetition
- no markdown
- no extra text`
}

interface StrengthsWeaknessesResult {
  strengths: string[]
  weaknesses: string[]
}

async function generateStrengthsWeaknesses(
  cv: string,
  jobOffer: string,
  apiKey: string,
): Promise<StrengthsWeaknessesResult> {
  const raw = await generateText({
    system: STRENGTHS_WEAKNESSES_SYSTEM,
    prompt: strengthsWeaknessesPrompt(cv, jobOffer),
    temperature: 0.2,
    maxTokens: 200,
    apiKey,
  })

  const parsed = safeParseJSON<StrengthsWeaknessesResult>(raw)

  if (!Array.isArray(parsed.strengths) || !Array.isArray(parsed.weaknesses)) {
    throw new Error('strengths or weaknesses field missing or not an array')
  }

  return {
    strengths: parsed.strengths.slice(0, 4),
    weaknesses: parsed.weaknesses.slice(0, 3),
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default defineEventHandler(async (event): Promise<AnalyzeResponse> => {
  const body = await readBody<AnalyzeRequest>(event)

  const cv = typeof body?.cv === 'string' ? body.cv.trim() : ''
  const jobOffer = typeof body?.jobOffer === 'string' ? body.jobOffer.trim() : ''

  if (!cv) {
    throw createError({ statusCode: 400, message: 'Your CV is required.' })
  }
  if (cv.length < MIN_CHARS.cv) {
    throw createError({ statusCode: 400, message: 'Your CV is too short. Please add more detail.' })
  }
  if (!jobOffer) {
    throw createError({ statusCode: 400, message: 'The job description is required.' })
  }
  if (jobOffer.length < MIN_CHARS.jobOffer) {
    throw createError({ statusCode: 400, message: 'The job description is too short. Please add more detail.' })
  }

  const { aiApiKey } = useRuntimeConfig()

  if (!aiApiKey) {
    console.error('[analyze] AI_API_KEY is not configured')
    throw createError({ statusCode: 503, message: 'The AI service is not configured. Please contact support.' })
  }

  const cvTruncated = truncate(cv, MAX_CHARS.cv)
  const jobOfferTruncated = truncate(jobOffer, MAX_CHARS.jobOffer)
  const softSkills = body.softSkills ? truncate(body.softSkills.trim(), MAX_CHARS.softSkills) : undefined

  try {
    const [coverLetter, { matchScore, reason }, { strengths, weaknesses }] = await Promise.all([
      generateCoverLetter(cvTruncated, jobOfferTruncated, aiApiKey, softSkills),
      generateMatchScore(cvTruncated, jobOfferTruncated, aiApiKey),
      generateStrengthsWeaknesses(cvTruncated, jobOfferTruncated, aiApiKey),
    ])

    return { coverLetter, matchScore, reason, strengths, weaknesses }
  } catch (err) {
    console.error('[analyze] generation failed:', err)
    throw createError({ statusCode: 502, message: 'The AI could not process your request. Please try again.' })
  }
})
