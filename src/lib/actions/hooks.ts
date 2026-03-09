"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Hook = {
  id: string;
  hook_text: string;
  type: "documented" | "engineered";
  source: string;
  niche: string;
  platform: string;
  performance_score: number;
  times_used: number;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export async function getHooks(filters?: {
  type?: string;
  source?: string;
  niche?: string;
  platform?: string;
  search?: string;
}): Promise<Hook[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("hooks_library")
    .select("*")
    .eq("user_id", user.id)
    .order("performance_score", { ascending: false });

  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.source) query = query.eq("source", filters.source);
  if (filters?.niche) query = query.ilike("niche", `%${filters.niche}%`);
  if (filters?.platform) query = query.eq("platform", filters.platform);
  if (filters?.search) query = query.ilike("hook_text", `%${filters.search}%`);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching hooks:", error);
    return [];
  }

  return data || [];
}

export async function createHook(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase.from("hooks_library").insert({
    hook_text: formData.get("hook_text") as string,
    type: formData.get("type") as string,
    source: formData.get("source") as string || "manual",
    niche: formData.get("niche") as string || "",
    platform: formData.get("platform") as string || "instagram_reels",
    performance_score: parseInt(formData.get("performance_score") as string) || 0,
    times_used: 0,
    user_id: user.id,
  });

  if (error) {
    console.error("Error creating hook:", error);
    throw new Error("Error al crear el hook: " + error.message);
  }

  revalidatePath("/hooks");
  redirect("/hooks");
}

export async function updateHook(id: string, updates: Partial<Hook>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("hooks_library")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating hook:", error);
    throw new Error("Error al actualizar el hook: " + error.message);
  }

  revalidatePath("/hooks");
}

export async function deleteHook(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("hooks_library")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting hook:", error);
    throw new Error("Error al eliminar el hook: " + error.message);
  }

  revalidatePath("/hooks");
}
