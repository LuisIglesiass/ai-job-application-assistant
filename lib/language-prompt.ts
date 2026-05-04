/**
 * Injects language handling into any system prompt.
 * Tells the model to understand input in any language
 * but always respond in the specified output language.
 */
export function withLanguage(systemPrompt: string, outputLanguage: string): string {
  const languageBlock = `LANGUAGE (CRITICAL):
Input may be in any language — understand it fully regardless.
Respond ONLY in: ${outputLanguage}.
Never mix languages. Never include words from other languages.
JSON keys must stay in English; all string values must be in ${outputLanguage}.
Write naturally in ${outputLanguage}, not word-for-word translations.`

  return `${languageBlock}\n\n${systemPrompt}`
}

export const ALLOWED_LANGUAGES = ['German', 'English', 'Spanish', 'Portuguese'] as const
export type OutputLanguage = typeof ALLOWED_LANGUAGES[number]

export function sanitizeLanguage(raw: unknown): OutputLanguage {
  return ALLOWED_LANGUAGES.includes(raw as OutputLanguage)
    ? (raw as OutputLanguage)
    : 'English'
}
