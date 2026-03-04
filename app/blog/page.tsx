import { Metadata } from 'next'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import BlogListClient from './BlogListClient'

export const metadata: Metadata = {
  title: 'Stories from the San Juans | Purgatory Townhouse',
  description:
    'Explore the San Juan Mountains through stories of alpine adventure, local history, and mountain culture from our luxury vacation rental near Durango, Colorado.',
  keywords:
    'San Juan Mountains blog, Durango Colorado stories, Purgatory vacation, alpine adventure, mountain culture',
}

export default async function BlogPage() {
  const supabase = await createSupabaseServerClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return <BlogListClient posts={posts ?? []} />
}
