import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import BlogPostClient from './BlogPostClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface PexelsPhoto {
  src: { large2x: string }
  alt: string
}

async function searchPexels(query: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return null
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`
    const res = await fetch(url, {
      headers: { Authorization: apiKey },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    const data = await res.json()
    const photo = data.photos?.[0] as PexelsPhoto | undefined
    return photo?.src.large2x ?? null
  } catch {
    return null
  }
}

const IMAGE_KEYWORD_MAP: [RegExp, string][] = [
  [/san juan|mountain.*panoram|morning mist|peaks/i, 'hero-mountain.jpg'],
  [/sunset|alpenglow|evening/i, 'alpenglow-sunset.jpg'],
  [/alpine.*valley|valley.*view/i, 'alpine-valley.jpg'],
  [/wildflower|meadow|bloom/i, 'wildflower-meadow-peaks.jpg'],
  [/ice lake|ice.*basin/i, 'ice-lake-panoramic.jpg'],
  [/columbine.*lake/i, 'columbine-lake.jpg'],
  [/island.*lake/i, 'island-lake-panoramic.jpg'],
  [/kayak|paddl/i, 'kayak-mountain-lake.jpg'],
  [/waterfall|falls|cascade/i, 'waterfall.jpg'],
  [/trail|hik|path/i, 'ice-lakes-trail-alpine.jpg'],
  [/engineer.*mountain/i, 'engineer-mountain.jpg'],
  [/downtown.*durango|durango.*town|main.*avenue/i, 'durango-downtown-main.jpg'],
  [/mesa verde|cliff.*dwelling/i, 'mesa-verde-cliff-palace.jpg'],
  [/railroad|train|narrow gauge/i, 'durango-downtown-main.jpg'],
  [/winter|snow|ski/i, 'durango-downtown-winter.jpg'],
  [/exterior|townhouse|property|cabin/i, 'exterior-1.jpg'],
  [/interior|living|kitchen|bedroom|cozy/i, 'living-room-1.jpg'],
  [/lake/i, 'bullion-king-lake.jpg'],
  [/sunflower/i, 'sunflowers-mountain-valley.jpg'],
]

function findLocalImage(description: string, usedImages: Set<string>): string | null {
  for (const [pattern, filename] of IMAGE_KEYWORD_MAP) {
    if (pattern.test(description) && !usedImages.has(filename)) {
      return filename
    }
  }
  return null
}

async function resolveImageComments(content: string): Promise<string> {
  const commentPattern = /^<!--\s*Image\s*suggestion:\s*(.+?)\s*-->$/gim
  const matches = [...content.matchAll(commentPattern)]
  if (matches.length === 0) return content

  const usedImages = new Set<string>()
  let result = content

  for (const match of matches) {
    const description = match[1]
    let imageRef: string

    const localFile = findLocalImage(description, usedImages)
    if (localFile) {
      usedImages.add(localFile)
      imageRef = localFile
    } else {
      const pexelsUrl = await searchPexels(`${description} Colorado mountains`)
      if (pexelsUrl) {
        imageRef = pexelsUrl
      } else {
        // Last resort: pick any unused local image
        const fallbacks = ['alpine-valley.jpg', 'wildflower-meadow-peaks.jpg', 'engineer-mountain.jpg', 'views-1.jpg']
        const unused = fallbacks.find(f => !usedImages.has(f)) ?? 'hero-mountain.jpg'
        usedImages.add(unused)
        imageRef = unused
      }
    }

    result = result.replace(match[0], `![${description}](${imageRef})`)
  }

  return result
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, seo_keywords')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    return { title: 'Post Not Found | Purgatory Townhouse' }
  }

  return {
    title: `${post.title} | Purgatory Townhouse`,
    description: post.excerpt,
    keywords: post.seo_keywords ?? undefined,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    notFound()
  }

  const resolvedContent = await resolveImageComments(post.content)

  return <BlogPostClient post={{ ...post, content: resolvedContent }} />
}
