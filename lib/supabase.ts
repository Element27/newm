import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Singleton instance for browser client to prevent multiple instances
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseServer() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

// Browser client for user authentication and client-side queries
export function getSupabaseBrowser() {
  if (!url || !anonKey) return null;
  
  // Create singleton instance to prevent multiple clients
  if (!browserClient) {
    browserClient = createClient(url, anonKey, { 
      auth: { 
        persistSession: true, 
        autoRefreshToken: true,
        detectSessionInUrl: true
      } 
    });
  }
  
  return browserClient;
}

export function getPublicUrl(path: string) {
  const client = getSupabaseServer();
  if (!client) return null;
  const { data } = client.storage.from("wardrobe").getPublicUrl(path);
  return data.publicUrl || null;
}

export const STORAGE_BUCKET = "wardrobe";
