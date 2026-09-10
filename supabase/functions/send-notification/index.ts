// Supabase Edge Function: send-notification
// Purpose: Internal system trigger for delivering targeted student or instructor notifications.

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

    const { userId, type, title, message, data } = await req.json();

    const { data: notif, error } = await supabaseAdmin
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data: data || {}
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data: notif }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: "NOTIFICATION_FAILED", message: err.message } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
