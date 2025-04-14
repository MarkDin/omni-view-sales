
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get pagination parameters from query string
    const url = new URL(req.url)
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const page = parseInt(url.searchParams.get('page') || '1')
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Calculate offset
    const offset = (page - 1) * pageSize

    // Fetch total count
    const { count: totalCount } = await supabaseClient
      .from('visit_records')
      .select('*', { count: 'exact', head: true })

    // Fetch paginated records
    const { data: records, error } = await supabaseClient
      .from('visit_records')
      .select('*')
      .order('visit_start_time', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw error

    const response = {
      records,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
      pageSize
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
