import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendNewLeadNotification } from '@/lib/email/notifications'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const chatbotId = searchParams.get('chatbotId')
    const status = searchParams.get('status')

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const where: any = {}

    if (chatbotId) {
      // Verify chatbot ownership
      const chatbot = await prisma.chatbot.findFirst({
        where: {
          id: chatbotId,
          userId: session.user.id,
        },
      })

      if (!chatbot) {
        return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 })
      }

      where.chatbotId = chatbotId
    } else {
      // Get all leads for user's chatbots
      const userChatbots = await prisma.chatbot.findMany({
        where: { userId: session.user.id },
        select: { id: true },
      })

      where.chatbotId = {
        in: userChatbots.map((c) => c.id),
      }
    }

    if (status) {
      where.status = status
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        appointment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ leads })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      chatbotId,
      conversationId,
      name,
      email,
      phone,
      message,
      qualificationData = {},
      source = 'chat',
    } = body

    if (!chatbotId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate lead score based on qualification data
    let score = 0
    if (qualificationData.budget) score += 20
    if (qualificationData.timeline) score += 20
    if (qualificationData.decision_maker) score += 30
    if (phone) score += 15
    if (name) score += 15

    const lead = await prisma.lead.create({
      data: {
        chatbotId,
        conversationId,
        name,
        email,
        phone,
        message,
        qualificationData,
        score,
        source,
        status: score >= 50 ? 'qualified' : 'new',
      },
    })

    // Get chatbot for email notification
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    })

    // Send notification to chatbot owner
    if (chatbot?.user?.email) {
      try {
        await sendNewLeadNotification({
          to: chatbot.user.email,
          ownerName: chatbot.user.name || 'User',
          chatbotName: chatbot.name,
          leadName: name || 'Anonymous',
          leadEmail: email,
          leadPhone: phone,
          leadMessage: message,
          leadScore: score,
        })
      } catch (emailError) {
        console.error('Error sending lead notification:', emailError)
      }
    }

    return NextResponse.json({ lead })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
