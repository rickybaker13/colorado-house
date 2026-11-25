// Calendar feed that Airbnb imports ("Colorado-house direct booking calendar"),
// so website and agent bookings block the dates on Airbnb.
//
// - Always generated live (never cached or prerendered), so Airbnb gets the
//   current state every time it refreshes.
// - Pending requests are included, so dates are held on Airbnb while the
//   owner decides.
// - No guest names: this URL is public.
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ymd = (dateStr) => dateStr.replace(/-/g, "");

function addOneDay(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function event(uid, start, endExclusive, summary, stamp) {
  return [
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${ymd(start)}`,
    `DTEND;VALUE=DATE:${ymd(endExclusive)}`,
    `DTSTAMP:${stamp}`,
    `UID:${uid}`,
    `SUMMARY:${summary}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
  ];
}

export async function GET() {
  try {
    const supabase = getServiceClient();
    const [{ data: bookings, error: e1 }, { data: blocks, error: e2 }] = await Promise.all([
      supabase
        .from("bookings")
        .select("id, check_in, check_out, status")
        .in("status", ["confirmed", "requested", "pending_approval"])
        .order("check_in", { ascending: true }),
      supabase
        .from("blocked_dates")
        .select("id, start_date, end_date")
        .order("start_date", { ascending: true }),
    ]);

    // Fail loudly rather than serve an empty calendar, which would tell
    // Airbnb every date is open.
    if (e1 || e2 || !bookings || !blocks) throw new Error((e1 || e2)?.message || "no data");

    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Purgatory Townhouse//Direct Bookings//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Purgatory Townhouse Direct Bookings",
    ];

    // DTEND is exclusive, so a stay's DTEND is its check-out date. The
    // check-out day stays open for a same-day check-in on Airbnb.
    for (const b of bookings) {
      lines.push(...event(`booking-${b.id}@skipurgatoryhouse.com`, b.check_in, b.check_out,
        b.status === "pending_approval" ? "Hold: direct booking request" : "Reserved: direct booking", stamp));
    }
    // Manual blocks include their end date, so DTEND is the day after.
    for (const m of blocks) {
      lines.push(...event(`blocked-${m.id}@skipurgatoryhouse.com`, m.start_date, addOneDay(m.end_date), "Blocked", stamp));
    }
    lines.push("END:VCALENDAR");

    return new Response(lines.join("\r\n") + "\r\n", {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="purgatory-direct.ics"',
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("iCal generation error:", error);
    return new Response("Error generating calendar", { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
