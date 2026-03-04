import { createSupabaseServerClient } from '@/lib/supabase-server'
import HistoryClient from './HistoryClient'

export default async function HistoryPage() {
  const supabase = await createSupabaseServerClient()

  const [
    { data: socialPosts },
    { data: blogPosts },
  ] = await Promise.all([
    supabase
      .from('social_posts')
      .select('id, platform, content, hashtags, image_filename, image_url, published_at, ayrshare_post_id, performance_notes')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(100),
    supabase
      .from('blog_posts')
      .select('id, title, content, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
  ])

  return (
    <HistoryClient
      socialPosts={socialPosts ?? []}
      blogPosts={blogPosts ?? []}
    />
  )
}
