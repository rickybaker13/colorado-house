import { createClient } from "@supabase/supabase-js";

// Public client (for browser-side reads and booking submissions)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Server-only client with service role (for API routes that need full access)
// NEVER expose this in client-side code
export function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
