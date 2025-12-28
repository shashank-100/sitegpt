import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendAppointmentConfirmation } from '@/lib/email/notifications'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const chatbotId = searchParams.get('chatbotId')

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
      // Get all appointments for user's chatbots
      const userChatbots = await prisma.chatbot.findMany({
        where: { userId: session.user.id },
        select: { id: true },
      })

      where.chatbotId = {
        in: userChatbots.map((c) => c.id),
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        chatbot: {
          select: {
            id: true,
            name: true,
          },
        },
        lead: {
          select: {
            id: true,
            status: true,
            qualificationData: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Error fetching appointments:', error)
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
      leadId,
      visitorName,
      visitorEmail,
      visitorPhone,
      scheduledAt,
      duration = 30,
      notes,
    } = body

    if (!chatbotId || !visitorName || !visitorEmail || !scheduledAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get chatbot to check if booking is enabled
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    })

    if (!chatbot || !chatbot.enableBooking) {
      return NextResponse.json(
        { error: 'Booking not enabled for this chatbot' },
        { status: 400 }
      )
    }

    // Create or get lead
    let lead
    if (leadId) {
      lead = await prisma.lead.findUnique({ where: { id: leadId } })
    } else {
      lead = await prisma.lead.create({
        data: {
          chatbotId,
          name: visitorName,
          email: visitorEmail,
          phone: visitorPhone,
          status: 'qualified',
          source: 'chat',
        },
      })
    }

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        chatbotId,
        leadId: lead.id,
        visitorName,
        visitorEmail,
        visitorPhone: visitorPhone || '',
        scheduledAt: new Date(scheduledAt),
        duration,
        notes,
        status: 'scheduled',
      },
      include: {
        chatbot: true,
        lead: true,
      },
    })

    // Send confirmation email
    try {
      await sendAppointmentConfirmation({
        to: visitorEmail,
        visitorName,
        chatbotName: chatbot.name,
        scheduledAt: new Date(scheduledAt),
        duration,
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Don't fail the appointment creation if email fails
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
