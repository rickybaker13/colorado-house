// Daily payments job (Vercel Cron, see vercel.json): collects balances,
// places damage-deposit holds on arrival day, asks about damage at checkout,
// and releases unclaimed deposits. Vercel sends "Authorization: Bearer
// <CRON_SECRET>"; without CRON_SECRET set, the job refuses to run.
import { runDailyPayments } from '@/lib/payments/stay';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  const log = await runDailyPayments();
  return Response.json({ ok: true, log });
}
