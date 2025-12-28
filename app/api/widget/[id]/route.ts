import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const chatbot = await prisma.chatbot.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        name: true,
        welcomeMessage: true,
        theme: true,
        logo: true,
        quickPrompts: true,
      },
    })

    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 })
    }

    return NextResponse.json({ chatbot })
  } catch (error) {
    console.error('Error fetching chatbot config:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
