import { createSupabaseServerClient } from '@/lib/supabase-server'
import DashboardClient from './DashboardClient'

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient()

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: draftSocialCount },
    { count: publishedThisWeekCount },
    { count: draftBlogCount },
    { data: recentPosts },
  ] = await Promise.all([
    supabase
      .from('social_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft'),
    supabase
      .from('social_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .gte('published_at', sevenDaysAgo),
    supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft'),
    supabase
      .from('social_posts')
      .select('id, platform, content, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  return (
    <DashboardClient
      draftSocialCount={draftSocialCount ?? 0}
      publishedThisWeekCount={publishedThisWeekCount ?? 0}
      draftBlogCount={draftBlogCount ?? 0}
      recentPosts={recentPosts ?? []}
    />
  )
}
