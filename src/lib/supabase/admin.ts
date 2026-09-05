import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export const hasServiceRole = (): boolean => {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
};

// Service role key should only be used on the server
export const supabaseAdmin = hasServiceRole()
  ? createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  : null;
