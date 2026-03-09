"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  specialties: string | null;
  capacity: number;
  active_pieces: number;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export async function getMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching members:", error);
    return [];
  }

  // Calculate active pieces for each member
  const members = data || [];
  if (members.length > 0) {
    const { data: pieces } = await supabase
      .from("content_pieces")
      .select("assigned_editor_id")
      .eq("user_id", user.id)
      .lt("current_step", 6)
      .not("assigned_editor_id", "is", null);

    const pieceCounts: Record<string, number> = {};
    pieces?.forEach((p) => {
      if (p.assigned_editor_id) {
        pieceCounts[p.assigned_editor_id] = (pieceCounts[p.assigned_editor_id] || 0) + 1;
      }
    });

    return members.map((m) => ({
      ...m,
      active_pieces: pieceCounts[m.id] || 0,
    }));
  }

  return members;
}

export async function getMember(id: string): Promise<TeamMember | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching member:", error);
    return null;
  }

  return data;
}

export async function createMember(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase.from("team_members").insert({
    name: formData.get("name") as string,
    role: formData.get("role") as string,
    specialties: formData.get("specialties") as string || null,
    capacity: parseInt(formData.get("capacity") as string) || 5,
    user_id: user.id,
  });

  if (error) {
    console.error("Error creating member:", error);
    throw new Error("Error al crear el miembro: " + error.message);
  }

  revalidatePath("/team");
  redirect("/team");
}

export async function updateMember(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("team_members")
    .update({
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      specialties: formData.get("specialties") as string || null,
      capacity: parseInt(formData.get("capacity") as string) || 5,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating member:", error);
    throw new Error("Error al actualizar el miembro: " + error.message);
  }

  revalidatePath("/team");
  redirect("/team");
}

export async function deleteMember(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting member:", error);
    throw new Error("Error al eliminar el miembro: " + error.message);
  }

  revalidatePath("/team");
}
