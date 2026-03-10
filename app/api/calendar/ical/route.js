import { getServiceClient } from "@/lib/supabase";

export const revalidate = 300;

function formatICalDate(dateStr) {
  return dateStr.replace(/-/g, "");
}

function addOneDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export async function GET() {
  try {
    const supabase = getServiceClient();

    const { data: bookings } = await supabase
      .from("bookings")
      .select("id, check_in, check_out, guest_name, status")
      .in("status", ["confirmed", "requested", "pending_approval"])
      .order("check_in", { ascending: true });

    const { data: blockedDates } = await supabase
      .from("blocked_dates")
      .select("id, start_date, end_date, reason")
      .order("start_date", { ascending: true });

    const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

    let ical = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Purgatory Townhouse//Direct Bookings//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Purgatory Townhouse Direct Bookings",
    ];

    if (bookings) {
      for (const booking of bookings) {
        const dtStart = formatICalDate(booking.check_in);
        const dtEnd = formatICalDate(addOneDay(booking.check_out));
        const uid = `booking-${booking.id}@purgatorytownhouse.com`;
        const summary = booking.status === "confirmed"
          ? `Booked: ${booking.guest_name}`
          : `Pending Approval: ${booking.guest_name}`;

        ical.push(
          "BEGIN:VEVENT",
          `DTSTART;VALUE=DATE:${dtStart}`,
          `DTEND;VALUE=DATE:${dtEnd}`,
          `DTSTAMP:${now}`,
          `UID:${uid}`,
          `SUMMARY:${summary}`,
          "STATUS:CONFIRMED",
          "END:VEVENT"
        );
      }
    }

    if (blockedDates) {
      for (const block of blockedDates) {
        const dtStart = formatICalDate(block.start_date);
        const dtEnd = formatICalDate(addOneDay(block.end_date));
        const uid = `blocked-${block.id}@purgatorytownhouse.com`;
        const summary = block.reason || "Blocked";

        ical.push(
          "BEGIN:VEVENT",
          `DTSTART;VALUE=DATE:${dtStart}`,
          `DTEND;VALUE=DATE:${dtEnd}`,
          `DTSTAMP:${now}`,
          `UID:${uid}`,
          `SUMMARY:${summary}`,
          "STATUS:CONFIRMED",
          "END:VEVENT"
        );
      }
    }

    ical.push("END:VCALENDAR");

    return new Response(ical.join("\r\n"), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="purgatory-direct.ics"',
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("iCal generation error:", error);
    return new Response("Error generating calendar", { status: 500 });
  }
}
