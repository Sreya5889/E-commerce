// Supabase Edge Function: generate-certificate
// Purpose: Server-side validation of 100% course completion before generating official certificate record and verification code.

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

    const { courseId } = await req.json();

    // 1. Fetch student enrollment
    const { data: enrollment, error: enrollErr } = await supabaseClient
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (enrollErr || !enrollment) {
      return new Response(JSON.stringify({ success: false, error: { code: "NOT_ENROLLED", message: "You are not enrolled in this course" } }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (Number(enrollment.progress_percentage) < 100 && !enrollment.completed) {
      return new Response(JSON.stringify({ success: false, error: { code: "INCOMPLETE_COURSE", message: "You must complete 100% of all lessons to claim a certificate" } }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 2. Generate certificate credentials
    const certNumber = `CERT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const verificationCode = `VERIFY-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`;
    const certUrl = `https://eduacademy.app/certificates/verify/${verificationCode}`;

    const { data: cert, error: certErr } = await supabaseAdmin
      .from("certificates")
      .upsert({
        user_id: user.id,
        course_id: courseId,
        enrollment_id: enrollment.id,
        certificate_number: certNumber,
        certificate_url: certUrl,
        verification_code: verificationCode
      }, { onConflict: "user_id,course_id" })
      .select()
      .single();

    if (certErr) throw certErr;

    // Send notification
    await supabaseAdmin.from("notifications").insert({
      user_id: user.id,
      type: "certificate_generated",
      title: "Certificate Issued!",
      message: `Congratulations! Your certificate for course completion is now available for download.`,
      data: { certificate_id: cert.id, verification_code: verificationCode }
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: cert
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: "CERTIFICATE_GEN_FAILED", message: err.message } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
