import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyPrivyToken } from "../_shared/privy.ts";

interface MarkReadRequest {
  notificationIds?: string[];
  markAll?: boolean;
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const privyClaims = await verifyPrivyToken(authHeader);

    const { notificationIds, markAll }: MarkReadRequest = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const walletAddress = privyClaims.wallet_address || '';

    if (markAll) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_wallet', walletAddress)
        .eq('read', false);

      if (error) throw error;
    } else if (notificationIds && notificationIds.length > 0) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', notificationIds)
        .eq('user_wallet', walletAddress);

      if (error) throw error;
    } else {
      throw new Error('No notification ids provided');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
