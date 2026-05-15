import { getSupabaseAdmin } from "./supabase-server";

const MAX_PER_HOUR = 3;

export async function checkRateLimit(ip: string) {
  const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  await getSupabaseAdmin().from("rate_limits").delete().lt("created_at", cutoff);

  const { count, error } = await getSupabaseAdmin()
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", cutoff);

  if (error) {
    return { ok: false, error };
  }

  if ((count ?? 0) >= MAX_PER_HOUR) {
    return { ok: false, limited: true };
  }

  const insertResult = await getSupabaseAdmin()
    .from("rate_limits")
    .insert({ ip });

  if (insertResult.error) {
    return { ok: false, error: insertResult.error };
  }

  return { ok: true };
}
