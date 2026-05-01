// scripts/test-ai.ts
import { generateText } from '../lib/ai-client.js'

const result = await generateText({
    system: 'You are a helpful assistant.',
    prompt: 'Say hello in exactly one sentence.',
    temperature: 0.3,
    maxTokens: 50,
})

console.log('Response:', result)