import { createClient } from "@supabase/supabase-js"
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../supabase-config"

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // allow app to run but warn developer
    console.error("Missing Supabase configuration. Client may not work as expected.")
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
