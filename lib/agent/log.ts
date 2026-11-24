import { getServiceClient } from '@/lib/supabase';

// Guest contact details are never written to the agent log.
const PRIVATE_FIELDS = new Set(['guest_name', 'guest_email', 'guest_phone', 'message']);

export interface AgentCallLog {
  tool: string;
  args: Record<string, unknown>;
  outcome: 'ok' | 'rejected' | 'error';
  detail?: string;
  durationMs: number;
  request?: Request;
}

export async function logAgentCall(entry: AgentCallLog): Promise<void> {
  try {
    const args: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(entry.args)) args[k] = PRIVATE_FIELDS.has(k) ? '[redacted]' : v;
    await getServiceClient()
      .from('agent_requests')
      .insert({
        tool: entry.tool,
        arguments: args,
        outcome: entry.outcome,
        detail: entry.detail?.slice(0, 500) ?? null,
        duration_ms: entry.durationMs,
        user_agent: entry.request?.headers.get('user-agent')?.slice(0, 300) ?? null,
        referer: entry.request?.headers.get('referer')?.slice(0, 300) ?? null,
      });
  } catch (err) {
    // Logging is best-effort and must never break a tool call.
    console.error('Agent log insert failed:', err);
  }
}
