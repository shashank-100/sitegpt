import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateChatResponse(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  trainingContext: string,
  model: string = 'gpt-4.1-mini',
  temperature: number = 0.7
) {
  const systemMessage = {
    role: 'system' as const,
    content: `You are a helpful AI assistant trained on the following information:\n\n${trainingContext}\n\nUse this information to answer user questions accurately. If you don't know the answer based on the training data, politely say so.`,
  }

  const response = await openai.chat.completions.create({
    model: model === 'gpt-4.1' ? 'gpt-4-turbo-preview' : 'gpt-3.5-turbo',
    messages: [systemMessage, ...messages],
    temperature,
    max_tokens: 1000,
  })

  return response.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.'
}

export async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  })

  return response.data[0].embedding
}
