import { supabase } from "./client"

export function from(table: string) {
    return supabase.from(table)
}

export async function rpc(fnName: string, params?: any) {
    const { data, error } = await supabase.rpc(fnName, params)
    if (error) throw error
    return data
}

export default { from, rpc }
