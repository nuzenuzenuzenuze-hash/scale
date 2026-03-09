"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type TrendSignal = {
  id: string;
  reel_url: string;
  hook_used: string;
  format: string;
  duration: string | null;
  type: "documented" | "engineered";
  notes: string | null;
  adaptable_to: string | null;
  creator_name: string | null;
  user_id: string;
  created_at: string;
};

export async function getTrends(filters?: {
  type?: string;
  creator_name?: string;
}): Promise<TrendSignal[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("trend_signals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.creator_name) query = query.ilike("creator_name", `%${filters.creator_name}%`);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching trends:", error);
    return [];
  }

  return data || [];
}

export async function createTrend(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase.from("trend_signals").insert({
    reel_url: formData.get("reel_url") as string,
    hook_used: formData.get("hook_used") as string,
    format: formData.get("format") as string,
    duration: formData.get("duration") as string || null,
    type: formData.get("type") as string,
    notes: formData.get("notes") as string || null,
    adaptable_to: formData.get("adaptable_to") as string || null,
    creator_name: formData.get("creator_name") as string || null,
    user_id: user.id,
  });

  if (error) {
    console.error("Error creating trend:", error);
    throw new Error("Error al crear la señal: " + error.message);
  }

  revalidatePath("/trends");
  redirect("/trends");
}

export async function deleteTrend(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("trend_signals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting trend:", error);
    throw new Error("Error al eliminar la señal: " + error.message);
  }

  revalidatePath("/trends");
}
