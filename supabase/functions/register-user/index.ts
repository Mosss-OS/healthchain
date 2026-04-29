import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyPrivyToken } from "../_shared/privy.ts";

interface RegisterUserRequest {
  email: string;
  walletAddress: string;
  fullName?: string;
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
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const privyClaims = await verifyPrivyToken(authHeader);
    
    const { email, walletAddress, fullName }: RegisterUserRequest = await req.json();

    if (!email || !walletAddress) {
      throw new Error('Missing required fields: email and walletAddress');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert({
        privy_user_id: privyClaims.sub,
        wallet_address: walletAddress,
        email,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'privy_user_id',
      })
      .select()
      .single();

    if (error) throw error;

    // Log to audit_log
    await supabase.from('audit_log').insert({
      actor_wallet: walletAddress,
      action: 'user_registered',
      metadata: { privy_user_id: privyClaims.sub },
    });

    return new Response(
      JSON.stringify({ success: true, data: profile }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
