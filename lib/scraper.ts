import axios from 'axios'
import * as cheerio from 'cheerio'

export async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SiteGPT/1.0; +http://sitegpt.ai)',
      },
      timeout: 30000,
    })

    const $ = cheerio.load(response.data)

    // Remove script, style, and other non-content elements
    $('script, style, nav, footer, iframe, noscript').remove()

    // Get text content
    const text = $('body').text()

    // Clean up whitespace
    const cleanedText = text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim()

    return cleanedText
  } catch (error) {
    console.error('Error scraping website:', error)
    throw new Error('Failed to scrape website')
  }
}

export async function scrapeSitemap(sitemapUrl: string): Promise<string[]> {
  try {
    const response = await axios.get(sitemapUrl, {
      timeout: 30000,
    })

    const $ = cheerio.load(response.data, { xmlMode: true })
    const urls: string[] = []

    $('url > loc').each((_, elem) => {
      const url = $(elem).text().trim()
      if (url) {
        urls.push(url)
      }
    })

    return urls
  } catch (error) {
    console.error('Error scraping sitemap:', error)
    return []
  }
}
