import { createSupabaseServerClient } from '@/lib/supabase-server'
import BlogClient from './BlogClient'

export default async function BlogPage() {
  const supabase = await createSupabaseServerClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .in('status', ['draft', 'approved'])
    .order('created_at', { ascending: false })

  return <BlogClient initialPosts={posts ?? []} />
}
