# Agent access (MCP server)

AI agents can find, price, and request the townhouse through an MCP server at
`https://skipurgatoryhouse.com/api/mcp` (Streamable HTTP, stateless, no auth).
`/llms.txt` points agents to it.

## Tools

| Tool | What it does |
| --- | --- |
| `townhouse_check_availability` | Open or blocked for given dates (Airbnb calendar + direct bookings + manual blocks) |
| `townhouse_get_calendar` | Open date ranges over a window of up to 120 days |
| `townhouse_get_quote` | Exact price from the `pricing` table and `site_config`, deposit, and Airbnb comparison |
| `townhouse_get_property_info` | Capacity, rooms, amenities, location, policies |
| `townhouse_get_photos` | Photo URLs with captions; `area` photos are marked as not the property |
| `townhouse_request_booking` | Creates a `pending_approval` booking and sends the usual Telegram approve/deny message, tagged "AI agent" |

Agent requests go through the same approval flow as website requests. Nothing is
charged; after approving, email the guest to collect the 50% deposit.

## Where things live

- `app/api/mcp/route.ts`: the endpoint
- `lib/agent/server.ts`: tool definitions
- `lib/agent/property.ts`: property facts, house rules, cancellation policy,
  and photo captions. Taken from the website and the Airbnb listing; update
  both together when anything changes.
- `lib/agent/pricing.ts`, `lib/agent/availability.ts`, `lib/agent/dates.ts`: shared logic
- `lib/notify.js`: Telegram notification (shared with the website booking route)

## Settings

- `AGENT_BITCOIN_ENABLED=true` offers Bitcoin (with the BTC discount) to agents.
  Leave unset until a real receiving address or BTCPay setup exists.
- Uses the existing `SUPABASE_SERVICE_ROLE_KEY`, `AIRBNB_ICAL_URL`, and Telegram variables.

## Logging

Every tool call is written to the `agent_requests` table (migration in
`supabase/migrations/20261124_agent_requests.sql`): tool, arguments with guest
contact details redacted, outcome, duration, user agent. Useful queries:

```sql
-- Calls per tool per day
select date_trunc('day', created_at) as day, tool, count(*)
from agent_requests group by 1, 2 order by 1 desc, 3 desc;

-- Which agents are calling
select user_agent, count(*) from agent_requests group by 1 order by 2 desc;

-- What failed and why
select created_at, tool, outcome, detail from agent_requests
where outcome <> 'ok' order by created_at desc limit 50;
```

## Testing locally

```bash
npm run dev
npx @modelcontextprotocol/inspector   # connect to http://localhost:3000/api/mcp
```
