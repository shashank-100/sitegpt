import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, score, qualificationData, message } = body

    // Verify ownership through chatbot
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Verify chatbot ownership
    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id: lead.chatbotId,
        userId: session.user.id,
      },
    })

    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updated = await prisma.lead.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(score !== undefined && { score }),
        ...(qualificationData && { qualificationData }),
        ...(message !== undefined && { message }),
        updatedAt: new Date(),
      },
      include: {
        appointment: true,
      },
    })

    return NextResponse.json({ lead: updated })
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
