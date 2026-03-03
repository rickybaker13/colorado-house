import { createSupabaseServerClient } from '@/lib/supabase-server'
import QueueClient from './QueueClient'

export default async function QueuePage() {
  const supabase = await createSupabaseServerClient()

  const { data: posts } = await supabase
    .from('social_posts')
    .select('*')
    .in('status', ['draft', 'approved'])
    .order('created_at', { ascending: false })

  return <QueueClient initialPosts={posts ?? []} />
}
