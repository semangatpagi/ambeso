import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const XENDIT_SECRET_KEY = Deno.env.get("XENDIT_SECRET_KEY");
    if (!XENDIT_SECRET_KEY) {
      throw new Error("XENDIT_SECRET_KEY is not configured");
    }

    const body = await req.json();
    const { orderId, amount, customerName, customerEmail, customerPhone, items } = body;

    if (!orderId || !amount || !customerName || !customerEmail) {
      throw new Error("Missing required fields");
    }

    // Create Xendit invoice
    const xenditResponse = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(XENDIT_SECRET_KEY + ":")}`,
      },
      body: JSON.stringify({
        external_id: orderId,
        amount,
        payer_email: customerEmail,
        description: `Ambeso Order #${orderId.slice(0, 8)}`,
        currency: "IDR",
        customer: {
          given_names: customerName,
          email: customerEmail,
          mobile_number: customerPhone || undefined,
        },
        items: items?.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        success_redirect_url: `${req.headers.get("origin")}/checkout/success?order_id=${orderId}`,
        failure_redirect_url: `${req.headers.get("origin")}/checkout/failed?order_id=${orderId}`,
      }),
    });

    const xenditData = await xenditResponse.json();

    if (!xenditResponse.ok) {
      console.error("Xendit API error:", xenditData);
      throw new Error(`Xendit error: ${JSON.stringify(xenditData)}`);
    }

    // Update order with invoice URL
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from("orders")
      .update({ status: "awaiting_payment" })
      .eq("id", orderId);

    return new Response(
      JSON.stringify({
        invoice_url: xenditData.invoice_url,
        invoice_id: xenditData.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
