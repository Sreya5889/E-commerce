// Supabase Edge Function: process-payment
// Purpose: Initiate payment checkout session with payment provider (Stripe/Razorpay placeholder architecture).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ success: false, error: { code: "UNAUTHORIZED", message: "User authentication required" } }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { orderId, provider = "stripe" } = await req.json();

    const { data: order, error: orderErr } = await supabaseClient
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ success: false, error: { code: "ORDER_NOT_FOUND", message: "Order not found" } }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate mock payment provider session ID
    const transactionId = `txn_${provider}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const clientSecret = `sec_${Math.random().toString(36).substring(2)}${Date.now()}`;

    // Record pending payment
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseAdmin.from("payments").insert({
      order_id: order.id,
      user_id: user.id,
      provider,
      transaction_id: transactionId,
      amount: order.total,
      currency: order.currency,
      status: "pending",
      payment_method: "card",
      provider_response: { client_secret: clientSecret }
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          transactionId,
          clientSecret,
          amount: order.total,
          currency: order.currency,
          provider
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: "PAYMENT_INITIATION_FAILED", message: err.message } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
