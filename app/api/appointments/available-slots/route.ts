import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const chatbotId = searchParams.get('chatbotId')
    const date = searchParams.get('date')

    if (!chatbotId) {
      return NextResponse.json(
        { error: 'chatbotId is required' },
        { status: 400 }
      )
    }

    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    })

    if (!chatbot || !chatbot.enableBooking) {
      return NextResponse.json(
        { error: 'Booking not enabled' },
        { status: 400 }
      )
    }

    // Get the target date or default to today
    const targetDate = date ? new Date(date) : new Date()
    targetDate.setHours(0, 0, 0, 0)

    // Get existing appointments for this day
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        chatbotId,
        scheduledAt: {
          gte: targetDate,
          lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
        },
        status: {
          not: 'cancelled',
        },
      },
      select: {
        scheduledAt: true,
        duration: true,
      },
    })

    // Generate available slots (9 AM - 5 PM, every 30 minutes)
    const slots: { time: string; available: boolean }[] = []
    const businessHoursStart = 9
    const businessHoursEnd = 17
    const slotDuration = 30 // minutes

    for (let hour = businessHoursStart; hour < businessHoursEnd; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotTime = new Date(targetDate)
        slotTime.setHours(hour, minute, 0, 0)

        // Skip past times
        if (slotTime < new Date()) {
          continue
        }

        // Check if this slot is already booked
        const isBooked = existingAppointments.some((apt) => {
          const aptStart = new Date(apt.scheduledAt)
          const aptEnd = new Date(aptStart.getTime() + apt.duration * 60 * 1000)
          return slotTime >= aptStart && slotTime < aptEnd
        })

        slots.push({
          time: slotTime.toISOString(),
          available: !isBooked,
        })
      }
    }

    return NextResponse.json({ slots })
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
