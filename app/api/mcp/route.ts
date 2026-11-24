// MCP endpoint for AI agents: https://skipurgatoryhouse.com/api/mcp
// Stateless Streamable HTTP. Each request gets a fresh server instance.
import { createMcpHandler } from '@modelcontextprotocol/server';
import { createRentalServer } from '@/lib/agent/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const handler = createMcpHandler(({ requestInfo }) => createRentalServer(requestInfo));

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version',
};

async function serve(request: Request): Promise<Response> {
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
