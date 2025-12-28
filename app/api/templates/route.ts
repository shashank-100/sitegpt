import { NextResponse } from 'next/server'
import { getAllTemplates, getTemplateByIndustry } from '@/lib/templates/industry-templates'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')

    if (industry) {
      const template = getTemplateByIndustry(industry)
      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
      }
      return NextResponse.json({ template })
    }

    const templates = getAllTemplates()
    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
