import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getServiceClient();

    const { data: configRows } = await supabase
      .from("site_config")
      .select("key, value");

    const config = {};
    if (configRows) {
      for (const row of configRows) {
        config[row.key] = isNaN(row.value) ? row.value : Number(row.value);
      }
    }

    const { data: pricing } = await supabase
      .from("pricing")
      .select("start_date, end_date, nightly_rate, label")
      .order("start_date", { ascending: true });

    return Response.json(
      {
        defaultNightlyRate: config.default_nightly_rate || 250,
        cleaningFee: config.cleaning_fee || 275,
        petFee: config.pet_fee || 200,
        maxGuests: config.max_guests || 10,
        maxPets: config.max_pets || 2,
        minNights: config.min_nights || 2,
        btcDiscountPercent: config.btc_discount_percent || 15,
        seasonalRates: pricing || [],
      },
      { headers: { "Cache-Control": "no-cache" } }
    );
  } catch (error) {
    console.error("Pricing API error:", error);
    return Response.json({ error: "Failed to fetch pricing" }, { status: 500 });
  }
}
