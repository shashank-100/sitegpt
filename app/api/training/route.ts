import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { scrapeWebsite } from '@/lib/scraper'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { chatbotId, type, source, content } = body

    if (!chatbotId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

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

    let trainingContent = content

    // If type is URL, scrape the website
    if (type === 'url' && source) {
      try {
        trainingContent = await scrapeWebsite(source)
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to scrape website' },
          { status: 400 }
        )
      }
    }

    const trainingData = await prisma.trainingData.create({
      data: {
        chatbotId,
        type,
        source: source || '',
        content: trainingContent,
      },
    })

    return NextResponse.json({ trainingData })
  } catch (error) {
    console.error('Error creating training data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Training data ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership through chatbot
    const trainingData = await prisma.trainingData.findFirst({
      where: {
        id,
      },
      include: {
        chatbot: true,
      },
    })

    if (!trainingData || trainingData.chatbot.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Training data not found' },
        { status: 404 }
      )
    }

    await prisma.trainingData.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting training data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
