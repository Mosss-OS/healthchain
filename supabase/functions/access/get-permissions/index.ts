import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyPrivyToken } from "../../_shared/privy.ts";

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
    const privyClaims = await verifyPrivyToken(authHeader);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const walletAddress = privyClaims.wallet_address || '';

    // Get permissions where user is patient
    const { data: grantedPermissions, error } = await supabase
      .from('access_permissions')
      .select(`
        *,
        medical_records:record_id (
          id, title, record_type, date_of_record
        )
      `)
      .eq('patient_wallet', walletAddress)
      .eq('is_active', true);

    if (error) throw error;

    // Get requests where user is patient
    const { data: accessRequests, error: reqError } = await supabase
      .from('access_requests')
      .select('*')
      .eq('patient_wallet', walletAddress)
      .eq('status', 'pending');

    if (reqError) throw reqError;

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          permissions: grantedPermissions,
          pendingRequests: accessRequests,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
