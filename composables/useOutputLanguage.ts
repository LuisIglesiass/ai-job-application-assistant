/**
 * Shared output language state — persists across pages via useState.
 * All AI features (analyze, optimize, review, apply) read from this.
 */
export function useOutputLanguage() {
  const outputLanguage = useState<string>('output-language', () => 'German')
  return { outputLanguage }
}
