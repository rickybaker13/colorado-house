// Known AI and search crawlers, matched on User-Agent. Order matters: the first
// match wins, so specific names (OAI-SearchBot) come before generic ones.
const BOTS: [name: string, pattern: RegExp][] = [
  ['ChatGPT-User', /ChatGPT-User/i],
  ['OAI-SearchBot', /OAI-SearchBot/i],
  ['GPTBot', /GPTBot/i],
  ['Claude-User', /Claude-User/i],
  ['Claude-SearchBot', /Claude-SearchBot/i],
  ['ClaudeBot', /ClaudeBot|anthropic-ai/i],
  ['Perplexity-User', /Perplexity-User/i],
  ['PerplexityBot', /PerplexityBot/i],
  ['Google-CloudVertexBot', /Google-CloudVertexBot/i],
  ['Googlebot', /Googlebot|Google-InspectionTool|GoogleOther/i],
  ['bingbot', /bingbot|BingPreview/i],
  ['Applebot', /Applebot/i],
  ['Amazonbot', /Amazonbot/i],
  ['meta-externalagent', /meta-external(agent|fetcher)/i],
  ['DuckAssistBot', /DuckAssistBot/i],
  ['MistralAI-User', /MistralAI-User/i],
  ['YouBot', /YouBot/i],
  ['Bytespider', /Bytespider/i],
  ['CCBot', /CCBot/i],
  ['DuckDuckBot', /DuckDuckBot/i],
  ['BrickBlueBot', /BrickBlueBot/i],
];

export function identifyCrawler(userAgent: string | null): string | null {
  if (!userAgent) return null;
  for (const [name, pattern] of BOTS) if (pattern.test(userAgent)) return name;
  return null;
}

// Best-effort insert through Supabase REST, so it works in middleware without
// pulling in the Supabase client. Never throws.
export async function logCrawlerVisit(visit: {
  bot: string;
  path: string;
  userAgent: string | null;
  referer: string | null;
  country: string | null;
}): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  try {
    await fetch(`${url}/rest/v1/crawler_visits`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        bot: visit.bot,
        path: visit.path.slice(0, 300),
        user_agent: visit.userAgent?.slice(0, 300) ?? null,
        referer: visit.referer?.slice(0, 300) ?? null,
        country: visit.country,
      }),
    });
  } catch (err) {
    console.error('Crawler log insert failed:', err);
  }
}
