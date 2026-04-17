import { groq } from '@ai-sdk/groq'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { buildBetoSystemPrompt } from '@/app/lib/beto/system-prompt'

export const runtime = 'edge'
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: buildBetoSystemPrompt(),
    messages: modelMessages,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse()
}
