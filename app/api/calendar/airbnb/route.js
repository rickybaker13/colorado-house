// Blocked nights for the booking page calendar: Airbnb, direct bookings,
// and manual blocks. The final say is always the server-side check made
// before a card is charged and again when the owner approves.
import { getBlockedNights } from "@/lib/agent/availability";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { nights, airbnbSynced } = await getBlockedNights();
    return Response.json(
      { blockedDates: Array.from(nights).sort(), airbnbSynced, lastUpdated: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" } }
    );
  } catch (error) {
    console.error("Calendar API error:", error);
    return Response.json(
      { blockedDates: [], airbnbSynced: false, error: "Failed to fetch calendar data" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
