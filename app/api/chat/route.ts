import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateChatResponse } from '@/lib/openai'
import { nanoid } from 'nanoid'
import { sendNewLeadNotification } from '@/lib/email/notifications'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { chatbotId, message, conversationId, visitorId, visitorData, qualificationAnswers } = body

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
        user: {
          select: {
            email: true,
            name: true,
          },
        },
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

    // Check if we should create/update a lead
    let lead = null
    let leadScore = 0
    const shouldCollectLead = chatbot.collectLeads && visitorData?.email

    if (shouldCollectLead) {
      // Calculate lead score based on qualification answers
      if (qualificationAnswers) {
        const questions = (chatbot.qualificationQuestions as any[]) || []
        questions.forEach((q: any) => {
          if (qualificationAnswers[q.id] !== undefined) {
            leadScore += q.score || 0
          }
        })
      }

      // Add score for contact info completeness
      if (visitorData.name) leadScore += 15
      if (visitorData.email) leadScore += 15
      if (visitorData.phone) leadScore += 15

      // Create or update lead
      lead = await prisma.lead.create({
        data: {
          chatbotId,
          conversationId: conversation.id,
          name: visitorData.name,
          email: visitorData.email,
          phone: visitorData.phone,
          message,
          status: leadScore >= 50 ? 'qualified' : 'new',
          score: Math.min(leadScore, 100),
          qualificationData: qualificationAnswers || {},
          source: 'chat',
        },
      })

      // Send notification for qualified leads
      if (leadScore >= 50 && chatbot.user?.email) {
        try {
          await sendNewLeadNotification({
            to: chatbot.user.email,
            ownerName: chatbot.user.name || 'User',
            chatbotName: chatbot.name,
            leadName: visitorData.name || 'Anonymous',
            leadEmail: visitorData.email,
            leadPhone: visitorData.phone,
            leadMessage: message,
            leadScore,
          })
        } catch (emailError) {
          console.error('Error sending lead notification:', emailError)
        }
      }
    }

    // Determine if we should show booking UI
    const showBooking = chatbot.enableBooking && leadScore >= 50

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversation.id,
      leadId: lead?.id,
      leadScore,
      showBooking,
      qualificationQuestions: chatbot.enableQualification ? chatbot.qualificationQuestions : null,
    })
  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
