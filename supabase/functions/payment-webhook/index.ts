// Supabase Edge Function: payment-webhook
// Purpose: Idempotent payment gateway webhook processor. Marks order completed, generates enrollments, clears user cart, and updates statistics.

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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const { transactionId, orderId, eventStatus } = body;

    if (eventStatus !== "payment_intent.succeeded" && eventStatus !== "PAID") {
      return new Response(JSON.stringify({ received: true, status: "ignored" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Check idempotency on payment record
    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("transaction_id", transactionId)
      .single();

    if (existingPayment && existingPayment.status === "succeeded") {
      return new Response(JSON.stringify({ received: true, message: "Webhook already processed" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Retrieve Order & Order Items
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Update Order and Payment records
    await supabaseAdmin
      .from("payments")
      .update({ status: "succeeded", paid_at: new Date().toISOString() })
      .eq("transaction_id", transactionId);

    await supabaseAdmin
      .from("orders")
      .update({ status: "completed", payment_status: "paid" })
      .eq("id", order.id);

    // 4. Create Enrollments for student (Idempotent ON CONFLICT)
    for (const item of order.order_items) {
      await supabaseAdmin
        .from("enrollments")
        .upsert(
          { user_id: order.user_id, course_id: item.course_id, order_id: order.id },
          { onConflict: "user_id,course_id" }
        );

      // Increment student count on course
      await supabaseAdmin.rpc("record_course_view", { p_user_id: order.user_id, p_course_id: item.course_id });
    }

    // 5. Clear purchased items from Cart
    await supabaseAdmin
      .from("cart")
      .delete()
      .eq("user_id", order.user_id);

    // 6. Generate Notification
    await supabaseAdmin.from("notifications").insert({
      user_id: order.user_id,
      type: "course_purchased",
      title: "Enrollment Successful!",
      message: `Your payment for order ${order.order_number} has been processed successfully. Enjoy your learning!`,
      data: { order_id: order.id, order_number: order.order_number }
    });

    return new Response(
      JSON.stringify({ success: true, message: "Payment webhook processed successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Webhook processing failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
