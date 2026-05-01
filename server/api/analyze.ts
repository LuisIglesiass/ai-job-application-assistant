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

const SYSTEM_PROMPT = `You are an expert career coach and recruiter.
Given a CV and a job offer, you must respond ONLY with a valid JSON object — no markdown, no explanation.
The JSON must follow this exact structure:
{
  "coverLetter": "string",
  "matchScore": number between 0 and 100,
  "reason": "string",
  "strengths": ["string", ...],
  "weaknesses": ["string", ...]
}
Write the coverLetter in the same language as the job offer.`

export default defineEventHandler(async (event): Promise<AnalyzeResponse> => {
  const body = await readBody<AnalyzeRequest>(event)

  if (!body?.cv || typeof body.cv !== 'string' || body.cv.trim() === '') {
    throw createError({ statusCode: 400, message: 'Field "cv" is required and must be a non-empty string.' })
  }

  if (!body?.jobOffer || typeof body.jobOffer !== 'string' || body.jobOffer.trim() === '') {
    throw createError({ statusCode: 400, message: 'Field "jobOffer" is required and must be a non-empty string.' })
  }

  const prompt = `CV:\n${body.cv.trim()}\n\nJob Offer:\n${body.jobOffer.trim()}`

  const { aiApiKey } = useRuntimeConfig()

  let raw: string
  try {
    raw = await generateText({
      system: SYSTEM_PROMPT,
      prompt,
      temperature: 0.3,
      maxTokens: 1500,
      apiKey: aiApiKey,
    })
  } catch (err) {
    console.error('[analyze] AI generation failed:', err)
    throw createError({ statusCode: 502, message: 'AI service unavailable.' })
  }

  let parsed: AnalyzeResponse
  try {
    parsed = JSON.parse(raw) as AnalyzeResponse
  } catch {
    console.error('[analyze] Failed to parse AI response as JSON:', raw)
    throw createError({ statusCode: 502, message: 'AI returned an unexpected response format.' })
  }

  if (
    typeof parsed.coverLetter !== 'string' ||
    typeof parsed.matchScore !== 'number' ||
    typeof parsed.reason !== 'string' ||
    !Array.isArray(parsed.strengths) ||
    !Array.isArray(parsed.weaknesses)
  ) {
    console.error('[analyze] AI response missing required fields:', parsed)
    throw createError({ statusCode: 502, message: 'AI response is incomplete.' })
  }

  return parsed
})
