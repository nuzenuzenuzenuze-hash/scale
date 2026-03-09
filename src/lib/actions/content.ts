"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ContentPiece = {
  id: string;
  title: string;
  brand_id: string;
  current_step: number;
  // Step 1 — Idea
  idea_source: string | null;
  idea_description: string | null;
  idea_reference_url: string | null;
  // Step 2 — Framework
  framework_type: "documented" | "engineered" | null;
  funnel_position: "tofu" | "mofu" | "bofu" | null;
  platform: string | null;
  // Step 3 — Script
  hook: string | null;
  body: string | null;
  cta: string | null;
  // Step 4 — Editor
  assigned_editor_id: string | null;
  editor_brief: string | null;
  editor_deadline: string | null;
  // Step 5 — Review
  review_status: "pending" | "approved" | "changes_requested" | null;
  review_comments: string | null;
  // Step 6 — Published
  published_url: string | null;
  published_at: string | null;
  metric_views: number | null;
  metric_likes: number | null;
  metric_saves: number | null;
  metric_shares: number | null;
  metric_comments: number | null;
  metric_follows: number | null;
  // Meta
  user_id: string;
  created_at: string;
  updated_at: string;
  // Joined
  brand_name?: string;
  editor_name?: string;
};

export async function getPieces(filters?: {
  brand_id?: string;
  current_step?: number;
  framework_type?: string;
  funnel_position?: string;
  assigned_editor_id?: string;
}): Promise<ContentPiece[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("content_pieces")
    .select("*, brands(name), team_members(name)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (filters?.brand_id) query = query.eq("brand_id", filters.brand_id);
  if (filters?.current_step) query = query.eq("current_step", filters.current_step);
  if (filters?.framework_type) query = query.eq("framework_type", filters.framework_type);
  if (filters?.funnel_position) query = query.eq("funnel_position", filters.funnel_position);
  if (filters?.assigned_editor_id) query = query.eq("assigned_editor_id", filters.assigned_editor_id);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching pieces:", error);
    return [];
  }

  return (data || []).map((d) => ({
    ...d,
    brand_name: (d.brands as { name: string } | null)?.name || "",
    editor_name: (d.team_members as { name: string } | null)?.name || "",
  })) as ContentPiece[];
}

export async function getPiece(id: string): Promise<ContentPiece | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("content_pieces")
    .select("*, brands(name), team_members(name)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching piece:", error);
    return null;
  }

  return {
    ...data,
    brand_name: (data.brands as { name: string } | null)?.name || "",
    editor_name: (data.team_members as { name: string } | null)?.name || "",
  } as ContentPiece;
}

export async function createPiece(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const title = formData.get("title") as string;
  const brand_id = formData.get("brand_id") as string;
  const idea_source = formData.get("idea_source") as string || null;
  const idea_description = formData.get("idea_description") as string || null;
  const idea_reference_url = formData.get("idea_reference_url") as string || null;

  const { data, error } = await supabase
    .from("content_pieces")
    .insert({
      title,
      brand_id,
      idea_source,
      idea_description,
      idea_reference_url,
      current_step: 1,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating piece:", error);
    throw new Error("Error al crear la pieza: " + error.message);
  }

  revalidatePath("/content");
  revalidatePath("/");
  revalidatePath(`/brands/${brand_id}`);
  redirect(`/content/${data.id}`);
}

export async function updatePiece(id: string, updates: Partial<ContentPiece>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  // Remove joined fields
  const { brand_name, editor_name, ...cleanUpdates } = updates;
  void brand_name;
  void editor_name;

  const { error } = await supabase
    .from("content_pieces")
    .update({ ...cleanUpdates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating piece:", error);
    throw new Error("Error al actualizar la pieza: " + error.message);
  }

  revalidatePath(`/content/${id}`);
  revalidatePath("/content");
  revalidatePath("/");
}

export async function advanceStep(id: string, newStep: number) {
  await updatePiece(id, { current_step: newStep } as Partial<ContentPiece>);
}

export async function deletePiece(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("content_pieces")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting piece:", error);
    throw new Error("Error al eliminar la pieza: " + error.message);
  }

  revalidatePath("/content");
  revalidatePath("/");
  redirect("/content");
}

export async function updatePieceStep(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const updates: Record<string, unknown> = {};
  const step = parseInt(formData.get("step") as string);

  switch (step) {
    case 1:
      updates.idea_source = formData.get("idea_source") || null;
      updates.idea_description = formData.get("idea_description") || null;
      updates.idea_reference_url = formData.get("idea_reference_url") || null;
      break;
    case 2:
      updates.framework_type = formData.get("framework_type") || null;
      updates.funnel_position = formData.get("funnel_position") || null;
      updates.platform = formData.get("platform") || null;
      break;
    case 3:
      updates.hook = formData.get("hook") || null;
      updates.body = formData.get("body") || null;
      updates.cta = formData.get("cta") || null;
      break;
    case 4:
      updates.assigned_editor_id = formData.get("assigned_editor_id") || null;
      updates.editor_brief = formData.get("editor_brief") || null;
      updates.editor_deadline = formData.get("editor_deadline") || null;
      break;
    case 5:
      updates.review_status = formData.get("review_status") || null;
      updates.review_comments = formData.get("review_comments") || null;
      break;
    case 6:
      updates.published_url = formData.get("published_url") || null;
      updates.published_at = formData.get("published_at") || new Date().toISOString();
      updates.metric_views = parseInt(formData.get("metric_views") as string) || null;
      updates.metric_likes = parseInt(formData.get("metric_likes") as string) || null;
      updates.metric_saves = parseInt(formData.get("metric_saves") as string) || null;
      updates.metric_shares = parseInt(formData.get("metric_shares") as string) || null;
      updates.metric_comments = parseInt(formData.get("metric_comments") as string) || null;
      updates.metric_follows = parseInt(formData.get("metric_follows") as string) || null;
      break;
  }

  const advanceToStep = formData.get("advance_to_step");
  if (advanceToStep) {
    updates.current_step = parseInt(advanceToStep as string);
  }

  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("content_pieces")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating piece step:", error);
    throw new Error("Error al actualizar: " + error.message);
  }

  revalidatePath(`/content/${id}`);
  revalidatePath("/content");
  revalidatePath("/");
}
