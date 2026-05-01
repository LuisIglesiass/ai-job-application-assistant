import { generateText } from '~/lib/ai-client'

interface AnalyzeRequest {
  cv: string
  jobOffer: string
}

interface CoverLetterResponse {
  coverLetter: string
}

const SYSTEM_PROMPT =
  'You are a precise career assistant. Write concise and realistic cover letters. Avoid generic phrases. Respond ONLY with a valid JSON object — no markdown, no extra text.'

function buildPrompt(cv: string, jobOffer: string): string {
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

export default defineEventHandler(async (event): Promise<CoverLetterResponse> => {
  const body = await readBody<AnalyzeRequest>(event)

  if (!body?.cv || typeof body.cv !== 'string' || body.cv.trim() === '') {
    throw createError({ statusCode: 400, message: 'Field "cv" is required and must be a non-empty string.' })
  }

  if (!body?.jobOffer || typeof body.jobOffer !== 'string' || body.jobOffer.trim() === '') {
    throw createError({ statusCode: 400, message: 'Field "jobOffer" is required and must be a non-empty string.' })
  }

  const { aiApiKey } = useRuntimeConfig()

  let raw: string
  try {
    raw = await generateText({
      system: SYSTEM_PROMPT,
      prompt: buildPrompt(body.cv.trim(), body.jobOffer.trim()),
      temperature: 0.4,
      maxTokens: 400,
      apiKey: aiApiKey,
    })
  } catch (err) {
    console.error('[analyze] AI generation failed:', err)
    throw createError({ statusCode: 502, message: 'AI service unavailable.' })
  }

  let parsed: CoverLetterResponse
  try {
    parsed = JSON.parse(raw) as CoverLetterResponse
  } catch {
    console.error('[analyze] Failed to parse AI response as JSON')
    throw createError({ statusCode: 502, message: 'AI returned an unexpected response format.' })
  }

  if (typeof parsed.coverLetter !== 'string' || parsed.coverLetter.trim() === '') {
    console.error('[analyze] AI response missing coverLetter field')
    throw createError({ statusCode: 502, message: 'AI response is incomplete.' })
  }

  return parsed
})
