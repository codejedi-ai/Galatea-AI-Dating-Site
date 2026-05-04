export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error(
        "Supabase environment variables are missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    )
}

export default {
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY,
}
