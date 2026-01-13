
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase configuration using provided project credentials.
 */
const supabaseUrl = 'https://cltrqihvndklbudwhzmo.supabase.co';
const supabaseAnonKey = 'sb_publishable_cxY0AL_9ANb-0QBBdLlfxA_xwnCuVT9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
