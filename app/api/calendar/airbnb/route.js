import { getServiceClient } from "@/lib/supabase";

export const revalidate = 900;

function parseICalDates(icalText) {
  const blocked = [];
  const events = icalText.split("BEGIN:VEVENT");

  for (let i = 1; i < events.length; i++) {
    const event = events[i];
    const startMatch = event.match(/DTSTART(?:;VALUE=DATE)?:(\d{4})(\d{2})(\d{2})/);
    const endMatch = event.match(/DTEND(?:;VALUE=DATE)?:(\d{4})(\d{2})(\d{2})/);

    if (startMatch && endMatch) {
      const start = `${startMatch[1]}-${startMatch[2]}-${startMatch[3]}`;
      const endDate = new Date(`${endMatch[1]}-${endMatch[2]}-${endMatch[3]}`);
      endDate.setDate(endDate.getDate() - 1);
      const end = endDate.toISOString().split("T")[0];

      const current = new Date(start);
      const last = new Date(end);
      while (current <= last) {
        blocked.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    }
  }
  return blocked;
}

export async function GET() {
  try {
    const allBlockedDates = new Set();

    // 1. Fetch Airbnb iCal
    const icalUrl = process.env.AIRBNB_ICAL_URL;
    if (icalUrl) {
      try {
        const response = await fetch(icalUrl, { next: { revalidate: 900 } });
        if (response.ok) {
          const icalText = await response.text();
          const airbnbDates = parseICalDates(icalText);
          airbnbDates.forEach((d) => allBlockedDates.add(d));
        }
      } catch (err) {
        console.error("Failed to fetch Airbnb iCal:", err);
      }
    }

    // 2. Fetch direct bookings from Supabase
    const supabase = getServiceClient();
    const { data: bookings } = await supabase
      .from("bookings")
      .select("check_in, check_out")
      .in("status", ["confirmed", "requested"]);

    if (bookings) {
      for (const booking of bookings) {
        const current = new Date(booking.check_in);
        const last = new Date(booking.check_out);
        last.setDate(last.getDate() - 1);
        while (current <= last) {
          allBlockedDates.add(current.toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }
      }
    }

    // 3. Fetch manually blocked dates
    const { data: manualBlocks } = await supabase
      .from("blocked_dates")
      .select("start_date, end_date");

    if (manualBlocks) {
      for (const block of manualBlocks) {
        const current = new Date(block.start_date);
        const last = new Date(block.end_date);
        while (current <= last) {
          allBlockedDates.add(current.toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }
      }
    }

    const sorted = Array.from(allBlockedDates).sort();

    return Response.json(
      { blockedDates: sorted, lastUpdated: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } }
    );
  } catch (error) {
    console.error("Calendar API error:", error);
    return Response.json({ blockedDates: [], error: "Failed to fetch calendar data" }, { status: 500 });
  }
}
