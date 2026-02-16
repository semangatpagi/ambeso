import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE_URL = "https://rajaongkir.komerce.id/api/v1";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const API_KEY = Deno.env.get("RAJAONGKIR_API_KEY");
    if (!API_KEY) {
      throw new Error("RAJAONGKIR_API_KEY is not configured");
    }

    const body = await req.json();
    const { action } = body;
    const apiHeaders = { key: API_KEY };

    if (action === "provinces") {
      const res = await fetch(`${BASE_URL}/destination/province`, { headers: apiHeaders });
      const data = await res.json();
      console.log("Province response:", res.status);
      return new Response(
        JSON.stringify(data.data || []),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "cities") {
      const { province_id } = body;
      const res = await fetch(`${BASE_URL}/destination/city/${province_id}`, { headers: apiHeaders });
      const data = await res.json();
      return new Response(
        JSON.stringify(data.data || []),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "districts") {
      const { city_id } = body;
      const res = await fetch(`${BASE_URL}/destination/district/${city_id}`, { headers: apiHeaders });
      const data = await res.json();
      return new Response(
        JSON.stringify(data.data || []),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "subdistricts") {
      const { district_id } = body;
      const res = await fetch(
        `${BASE_URL}/destination/domestic-destination?search=${district_id}&limit=50&offset=0`,
        { headers: apiHeaders }
      );
      const data = await res.json();
      return new Response(
        JSON.stringify(data.data || []),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "cost") {
      const { origin, destination, weight, courier } = body;
      if (!destination || !weight || !courier) {
        throw new Error("Missing required fields");
      }

      // Origin default: Panakkukang, Makassar district_id
      const originId = origin || "6736";

      const formBody = new URLSearchParams();
      formBody.append("origin", String(originId));
      formBody.append("destination", String(destination));
      formBody.append("weight", String(weight));
      formBody.append("courier", courier);

      const res = await fetch(`${BASE_URL}/calculate/domestic-cost`, {
        method: "POST",
        headers: {
          ...apiHeaders,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      const data = await res.json();
      console.log("Cost response:", res.status, JSON.stringify(data).slice(0, 500));
      return new Response(
        JSON.stringify(data.data || []),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (error: any) {
    console.error("RajaOngkir error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
