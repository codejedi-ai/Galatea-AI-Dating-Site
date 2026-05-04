import { supabase } from "./client"

export async function uploadFile(bucket: string, path: string, file: any, options?: any) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, options)
    if (error) throw error
    return data
}

export async function downloadFile(bucket: string, path: string) {
    const { data, error } = await supabase.storage.from(bucket).download(path)
    if (error) throw error
    return data
}

export async function getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
}

export default { uploadFile, downloadFile, getPublicUrl }
