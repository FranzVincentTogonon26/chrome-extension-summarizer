import { createOpenAI } from '@ai-sdk/openai'
import { ENV } from "../config/ENV.ts";

export const openRouter = createOpenAI({
    baseURL: ENV.BASE_URL,
    apiKey: ENV.API_KEY
})

// You can swap this model string to any model on OpenRouter
export const SUMMARIZE_MODEL = "anthropic/claude-3-haiku";