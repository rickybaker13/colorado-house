import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/agent/property';

// AI agents: see /llms.txt for how to check dates, quote, and request a booking
// through the MCP server at /api/mcp.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt'],
        disallow: ['/admin', '/auth', '/booking/status/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
