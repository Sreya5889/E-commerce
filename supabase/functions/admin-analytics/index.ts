// Supabase Edge Function: admin-analytics
// Purpose: Executive dashboard analytics. Aggregates monthly revenue, student growth, sales trends, and top performers.

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
      return new Response(JSON.stringify({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify Admin role
    const { data: isAdmin } = await supabaseAdmin.rpc("is_admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ success: false, error: { code: "FORBIDDEN", message: "Admin privileges required" } }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Read summary view
    const { data: summary } = await supabaseAdmin
      .from("admin_platform_summary")
      .select("*")
      .single();

    // Top selling courses
    const { data: topCourses } = await supabaseAdmin
      .from("courses")
      .select("id, title, price, student_count, average_rating, review_count")
      .eq("status", "published")
      .order("student_count", { ascending: false })
      .limit(5);

    // Recent orders
    const { data: recentOrders } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, total, payment_status, status, created_at, profiles(display_name)")
      .order("created_at", { ascending: false })
      .limit(8);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          summary,
          topCourses,
          recentOrders
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: "ANALYTICS_FETCH_FAILED", message: err.message } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
