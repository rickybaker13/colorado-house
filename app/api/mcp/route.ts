// MCP endpoint for AI agents: https://skipurgatoryhouse.com/api/mcp
// Stateless Streamable HTTP. Each request gets a fresh server instance.
import { createMcpHandler } from '@modelcontextprotocol/server';
import { after } from 'next/server';
import { createRentalServer } from '@/lib/agent/server';
import { logAgentCall } from '@/lib/agent/log';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const handler = createMcpHandler(({ requestInfo }) => createRentalServer(requestInfo));

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version',
};

// Tool calls are logged by the tools themselves. This records the discovery steps
// (connecting, listing tools) so agents that look but don't call a tool still show up.
const DISCOVERY = new Set(['initialize', 'tools/list', 'resources/list', 'prompts/list']);

async function logDiscovery(request: Request): Promise<void> {
  try {
    const body = JSON.parse(await request.text());
    for (const msg of Array.isArray(body) ? body : [body]) {
      if (!msg || typeof msg.method !== 'string' || !DISCOVERY.has(msg.method)) continue;
      const client = msg.params?.clientInfo;
      await logAgentCall({
        tool: `mcp/${msg.method}`,
        args: msg.method === 'initialize'
          ? {
              client: typeof client?.name === 'string' ? client.name.slice(0, 100) : null,
              client_version: typeof client?.version === 'string' ? client.version.slice(0, 40) : null,
              protocol: typeof msg.params?.protocolVersion === 'string' ? msg.params.protocolVersion : null,
            }
          : {},
        outcome: 'ok',
        durationMs: 0,
        request,
      });
    }
  } catch {
    // Not JSON or not a discovery message: nothing to log.
  }
}

async function serve(request: Request): Promise<Response> {
  if (request.method === 'POST') {
    const copy = request.clone();
    after(() => logDiscovery(copy));
  }
  const res = await handler.fetch(request);
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export const POST = serve;
export const GET = serve;
export const DELETE = serve;

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
