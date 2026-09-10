// Supabase Edge Function: create-order
// Purpose: Secure checkout creation. Validates cart items, server-side price verification, coupon application, tax calculation, and order generation.

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

    const { couponCode } = await req.json();

    // 1. Fetch user cart items
    const { data: cartItems, error: cartError } = await supabaseClient
      .from("cart")
      .select("course_id, courses(id, title, price, discount_price, instructor_id)")
      .eq("user_id", user.id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return new Response(JSON.stringify({ success: false, error: { code: "CART_EMPTY", message: "Your shopping cart is empty" } }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Server-side subtotal calculation
    let subtotal = 0;
    const orderItemsPayload = [];

    for (const item of cartItems) {
      const course = item.courses;
      const unitPrice = course.discount_price !== null && course.discount_price < course.price 
        ? Number(course.discount_price) 
        : Number(course.price);

      subtotal += unitPrice;

      orderItemsPayload.push({
        course_id: course.id,
        instructor_id: course.instructor_id,
        course_title: course.title,
        unit_price: course.price,
        discount: Number(course.price) - unitPrice,
        final_price: unitPrice
      });
    }

    // 3. Coupon validation & discount calculation
    let discount = 0;
    let couponId = null;

    if (couponCode) {
      const { data: coupon, error: couponErr } = await supabaseClient
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (!couponErr && coupon) {
        const now = new Date();
        const isValidDate = (!coupon.expires_at || new Date(coupon.expires_at) > now) && new Date(coupon.starts_at) <= now;
        const isValidMin = subtotal >= Number(coupon.minimum_order_amount);
        const isValidLimit = !coupon.usage_limit || coupon.used_count < coupon.usage_limit;

        if (isValidDate && isValidMin && isValidLimit) {
          couponId = coupon.id;
          if (coupon.discount_type === "percentage") {
            discount = (subtotal * Number(coupon.discount_value)) / 100;
            if (coupon.maximum_discount && discount > Number(coupon.maximum_discount)) {
              discount = Number(coupon.maximum_discount);
            }
          } else {
            discount = Number(coupon.discount_value);
          }
        }
      }
    }

    const netAmount = Math.max(0, subtotal - discount);
    const taxRate = 0.05; // 5% tax
    const tax = Number((netAmount * taxRate).toFixed(2));
    const total = Number((netAmount + tax).toFixed(2));
    const orderNumber = `EDU-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Create pending order in database using Service Role client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: newOrder, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        subtotal,
        discount,
        tax,
        total,
        currency: "USD",
        coupon_id: couponId,
        status: "pending",
        payment_status: "pending"
      })
      .select()
      .single();

    if (orderErr) {
      throw orderErr;
    }

    // Insert order items
    const itemsToInsert = orderItemsPayload.map(i => ({ ...i, order_id: newOrder.id }));
    await supabaseAdmin.from("order_items").insert(itemsToInsert);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          orderId: newOrder.id,
          orderNumber: newOrder.order_number,
          subtotal,
          discount,
          tax,
          total,
          currency: "USD",
          itemCount: itemsToInsert.length
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: "CREATE_ORDER_FAILED", message: err.message || "Failed to create order" } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
