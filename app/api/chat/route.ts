import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateChatResponse } from '@/lib/openai'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { chatbotId, message, conversationId, visitorId, visitorData } = body

    if (!chatbotId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get chatbot and training data
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      include: {
        trainingData: true,
      },
    })

    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 })
    }

    // Combine all training data
    const trainingContext = chatbot.trainingData
      .map((data) => data.content)
      .join('\n\n')

    // Get or create conversation
    let conversation
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 20, // Last 20 messages for context
          },
        },
      })
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          chatbotId,
          visitorId: visitorId || nanoid(),
          visitorName: visitorData?.name,
          visitorEmail: visitorData?.email,
          visitorPhone: visitorData?.phone,
        },
        include: {
          messages: true,
        },
      })
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
      },
    })

    // Prepare messages for OpenAI
    const messages = [
      ...conversation.messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ]

    // Generate response
    const aiResponse = await generateChatResponse(
      messages,
      trainingContext,
      chatbot.model,
      chatbot.temperature
    )

    // Save assistant message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
      },
    })

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversation.id,
    })
  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
