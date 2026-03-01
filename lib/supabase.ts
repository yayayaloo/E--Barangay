import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
    if (!supabaseInstance) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            // Return a dummy client that will fail gracefully at runtime
            // This allows the build to succeed without real env vars
            return createClient('https://placeholder.supabase.co', 'placeholder-key')
        }

        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    }
    return supabaseInstance
}

// For backward compatibility - lazy getter
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return (getSupabase() as any)[prop]
    },
})
