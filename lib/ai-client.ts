const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions'
const DEFAULT_MODEL = 'deepseek-chat'

interface GenerateTextOptions {
  system: string
  prompt: string
  temperature?: number
  maxTokens?: number
  model?: string
  apiKey?: string
}

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface DeepSeekResponse {
  choices: Array<{
    message: DeepSeekMessage
    finish_reason: string
  }>
}

export async function generateText(options: GenerateTextOptions): Promise<string> {
  const apiKey = options.apiKey ?? process.env.AI_API_KEY

  if (!apiKey) {
    throw new Error('AI_API_KEY is not set')
  }

  const { system, prompt, temperature = 0.3, maxTokens = 500, model = DEFAULT_MODEL } = options

  const body = {
    model,
    messages: [
      { role: 'system' as const, content: system },
      { role: 'user' as const, content: prompt },
    ],
    temperature,
    max_tokens: maxTokens,
  }

  let response: Response

  try {
    response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch (err) {
    console.error('[ai-client] Network error contacting DeepSeek API:', err)
    throw new Error('Failed to reach DeepSeek API')
  }

  if (!response.ok) {
    const status = response.status
    let detail = ''
    try {
      detail = await response.text()
    } catch {}
    console.error(`[ai-client] DeepSeek API returned ${status}:`, detail)
    throw new Error(`DeepSeek API error: ${status}`)
  }

  const data = (await response.json()) as DeepSeekResponse
  const text = data.choices?.[0]?.message?.content

  if (!text) {
    throw new Error('DeepSeek API returned an empty response')
  }

  return text
}
