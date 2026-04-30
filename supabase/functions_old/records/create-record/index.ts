import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyPrivyToken } from "../../_shared/privy.ts";

interface CreateRecordRequest {
  recordType: string;
  title: string;
  description?: string;
  ipfsHash?: string;
  metadata?: Record<string, unknown>;
  dateOfRecord: string;
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

    const {
      recordType,
      title,
      description,
      ipfsHash,
      metadata,
      dateOfRecord,
    }: CreateRecordRequest = await req.json();

    if (!recordType || !title || !dateOfRecord) {
      throw new Error('Missing required fields');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const walletAddress = privyClaims.wallet_address || '';

    const { data: record, error } = await supabase
      .from('medical_records')
      .insert({
        patient_wallet: walletAddress,
        record_type: recordType,
        title,
        description,
        ipfs_hash: ipfsHash,
        metadata: metadata || {},
        date_of_record: dateOfRecord,
      })
      .select()
      .single();

    if (error) throw error;

    // Log to audit_log
    await supabase.from('audit_log').insert({
      actor_wallet: walletAddress,
      action: 'record_created',
      resource_type: 'medical_record',
      resource_id: record.id,
      metadata: { record_type: recordType, title },
    });

    // Create notification
    await supabase.from('notifications').insert({
      user_wallet: walletAddress,
      type: 'record_added',
      title: 'Record added on-chain',
      message: `${title} is now secured on Base.`,
      data: { record_id: record.id },
    });

    return new Response(
      JSON.stringify({ success: true, data: record }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
