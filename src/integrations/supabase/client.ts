// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pugtpiijinkulpbnbgji.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1Z3RwaWlqaW5rdWxwYm5iZ2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDk1OTMsImV4cCI6MjA2MDAyNTU5M30.MEZ5-PybQzmwfcESgwtFSZKxGNzNTrMrfkc8N7IEmls";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);