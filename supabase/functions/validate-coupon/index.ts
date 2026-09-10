// Supabase Edge Function: validate-coupon
// Purpose: Server-side validation of promotional coupons and discount preview calculation.

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
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { code, cartSubtotal } = await req.json();

    if (!code || typeof cartSubtotal !== "number") {
      return new Response(JSON.stringify({ success: false, error: { code: "INVALID_INPUT", message: "Coupon code and subtotal are required" } }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: coupon, error: couponErr } = await supabaseClient
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (couponErr || !coupon) {
      return new Response(JSON.stringify({ success: false, error: { code: "INVALID_COUPON", message: "Invalid or expired coupon code" } }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      return new Response(JSON.stringify({ success: false, error: { code: "COUPON_EXPIRED", message: "This coupon code has expired" } }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (cartSubtotal < Number(coupon.minimum_order_amount)) {
      return new Response(JSON.stringify({ success: false, error: { code: "MINIMUM_SUBTOTAL_NOT_MET", message: `Minimum order amount of $${coupon.minimum_order_amount} required` } }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === "percentage") {
      discountAmount = (cartSubtotal * Number(coupon.discount_value)) / 100;
      if (coupon.maximum_discount && discountAmount > Number(coupon.maximum_discount)) {
        discountAmount = Number(coupon.maximum_discount);
      }
    } else {
      discountAmount = Number(coupon.discount_value);
    }

    discountAmount = Math.min(discountAmount, cartSubtotal);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          couponId: coupon.id,
          code: coupon.code,
          discountType: coupon.discount_type,
          discountValue: coupon.discount_value,
          calculatedDiscount: Number(discountAmount.toFixed(2)),
          finalTotal: Number((cartSubtotal - discountAmount).toFixed(2))
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: "COUPON_VALIDATION_ERROR", message: err.message } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
