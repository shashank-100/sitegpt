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
    const { status, scheduledAt, duration, notes } = body

    // Verify ownership through chatbot
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        chatbot: true,
      },
    })

    if (!appointment || appointment.chatbot.userId !== session.user.id) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
        ...(duration && { duration }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date(),
      },
      include: {
        chatbot: true,
        lead: true,
      },
    })

    return NextResponse.json({ appointment: updated })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        chatbot: true,
      },
    })

    if (!appointment || appointment.chatbot.userId !== session.user.id) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    await prisma.appointment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
