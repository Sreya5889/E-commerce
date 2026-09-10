// Supabase Edge Function: search-courses
// Purpose: Full-text course search, pagination, and multi-facet filtering engine.

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

    const {
      query = "",
      categorySlug,
      level,
      priceFilter, // 'free' | 'paid' | 'all'
      ratingMin,
      sortBy = "popular", // 'popular' | 'rating' | 'newest' | 'price_low' | 'price_high'
      page = 1,
      limit = 12
    } = await req.json();

    let dbQuery = supabaseClient
      .from("courses")
      .select("*, teachers(*, profiles(*)), categories(*)", { count: "exact" })
      .eq("status", "published");

    if (query.trim()) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (level && level !== "all") {
      dbQuery = dbQuery.eq("level", level);
    }

    if (priceFilter === "free") {
      dbQuery = dbQuery.eq("price", 0);
    } else if (priceFilter === "paid") {
      dbQuery = dbQuery.gt("price", 0);
    }

    if (ratingMin) {
      dbQuery = dbQuery.gte("average_rating", ratingMin);
    }

    // Sort order
    if (sortBy === "rating") {
      dbQuery = dbQuery.order("average_rating", { ascending: false });
    } else if (sortBy === "newest") {
      dbQuery = dbQuery.order("created_at", { ascending: false });
    } else if (sortBy === "price_low") {
      dbQuery = dbQuery.order("price", { ascending: true });
    } else if (sortBy === "price_high") {
      dbQuery = dbQuery.order("price", { ascending: false });
    } else {
      dbQuery = dbQuery.order("student_count", { ascending: false });
    }

    // Pagination bounds
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    dbQuery = dbQuery.range(from, to);

    const { data: courses, count, error } = await dbQuery;
    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / limit);

    return new Response(
      JSON.stringify({
        success: true,
        data: courses,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: { code: "SEARCH_FAILED", message: err.message } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
