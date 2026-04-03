
            import { createClient } from "@supabase/supabase-js";

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseAnonKey) {
              console.error('[supabase] VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY 未设置，请检查 .env 并重启 dev 服务');
            } else {
              console.log('[supabase] API URL:', supabaseUrl);
            }

            export const supabase = createClient(supabaseUrl, supabaseAnonKey);
            