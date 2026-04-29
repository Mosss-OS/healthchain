import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyPrivyToken } from "../_shared/privy.ts";

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    await verifyPrivyToken(authHeader);

    const url = new URL(req.url);
    const query = url.searchParams.get('q') || '';
    const specialty = url.searchParams.get('specialty') || '';

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    let dbQuery = supabase
      .from('healthcare_providers')
      .select(`
        *,
        profiles:profile_id (
          id, wallet_address, full_name, avatar_url
        )
      `)
      .eq('verified', true);

    if (query) {
      dbQuery = dbQuery.or(`institution_name.ilike.%${query}%,specialty.ilike.%${query}%`);
    }

    if (specialty) {
      dbQuery = dbQuery.eq('specialty', specialty);
    }

    const { data: providers, error } = await dbQuery;

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data: providers }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
