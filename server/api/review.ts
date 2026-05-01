import { generateText } from '~/lib/ai-client'

interface ReviewRequest {
  cv: string
}

export interface ReviewResponse {
  issues: string[]
  improvements: string[]
  rewrites: {
    summary: string
    experience: string[]
  }
  tips: string[]
}

const MIN_LENGTH = 20
const MAX_LENGTH = 6000

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '\n[truncated]' : text
}

function safeParseJSON<T>(raw: string): T {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  return JSON.parse(cleaned) as T
}

const SYSTEM =
  'You are a strict and highly practical CV reviewer. Analyze the CV and provide high-impact improvements to increase interview chances. Return ONLY valid JSON — no markdown, no extra text.'

function buildPrompt(cv: string): string {
  return `CV:
${cv}

Analyze this CV and provide high-impact improvements to increase interview chances.

Return ONLY this JSON structure:
{
  "issues": ["string"],
  "improvements": ["string"],
  "rewrites": {
    "summary": "string",
    "experience": ["string"]
  },
  "tips": ["string"]
}

Rules:
- issues: max 5 real problems (e.g. "No measurable achievements", "Missing skills section")
- improvements: max 5 actionable items (e.g. "Add metrics to describe impact")
- rewrites.summary: max 60 words, strong, professional, and clear
- rewrites.experience: max 3 bullet points, each under 20 words, focus on impact
- tips: max 5 practical career tips that increase chances of getting interviews
- Think like a recruiter reviewing hundreds of CVs quickly
- No generic advice, no vague suggestions, no long explanations`
}

export default defineEventHandler(async (event): Promise<ReviewResponse> => {
  const body = await readBody<ReviewRequest>(event)

  const cv = typeof body?.cv === 'string' ? body.cv.trim() : ''

  if (!cv || cv.length < MIN_LENGTH) {
    throw createError({ statusCode: 400, message: 'Your CV is required and must have at least 20 characters.' })
  }

  const { aiApiKey } = useRuntimeConfig()

  if (!aiApiKey) {
    console.error('[review] AI_API_KEY is not configured')
    throw createError({ statusCode: 503, message: 'The AI service is not configured. Please contact support.' })
  }

  let raw: string
  try {
    raw = await generateText({
      system: SYSTEM,
      prompt: buildPrompt(truncate(cv, MAX_LENGTH)),
      temperature: 0.2,
      maxTokens: 700,
      apiKey: aiApiKey,
    })
  } catch (err) {
    console.error('[review] AI generation failed:', err)
    throw createError({ statusCode: 502, message: 'The AI could not process your request. Please try again.' })
  }

  let parsed: ReviewResponse
  try {
    parsed = safeParseJSON<ReviewResponse>(raw)
  } catch {
    console.error('[review] Failed to parse AI response')
    throw createError({ statusCode: 502, message: 'AI returned an unexpected response format.' })
  }

  if (
    !Array.isArray(parsed?.issues) ||
    !Array.isArray(parsed?.improvements) ||
    typeof parsed?.rewrites?.summary !== 'string' ||
    !Array.isArray(parsed?.rewrites?.experience) ||
    !Array.isArray(parsed?.tips)
  ) {
    console.error('[review] AI response missing required fields')
    throw createError({ statusCode: 502, message: 'AI response is incomplete.' })
  }

  return {
    issues:       parsed.issues.slice(0, 5),
    improvements: parsed.improvements.slice(0, 5),
    rewrites: {
      summary:    parsed.rewrites.summary,
      experience: parsed.rewrites.experience.slice(0, 3),
    },
    tips: parsed.tips.slice(0, 5),
  }
})
