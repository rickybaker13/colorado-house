import { createSupabaseServerClient } from '@/lib/supabase-server'
import InstructClient from './InstructClient'

export default async function InstructPage() {
  const supabase = await createSupabaseServerClient()

  const { data: instructions } = await supabase
    .from('agent_instructions')
    .select('*')
    .order('created_at', { ascending: false })

  return <InstructClient initialInstructions={instructions ?? []} />
}
