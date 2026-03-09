"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Brand = {
  id: string;
  name: string;
  niche: string;
  tone: string;
  target_audience: string;
  brand_context_file: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }

  return data || [];
}

export async function getBrand(id: string): Promise<Brand | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching brand:", error);
    return null;
  }

  return data;
}

export async function createBrand(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const name = formData.get("name") as string;
  const niche = formData.get("niche") as string;
  const tone = formData.get("tone") as string;
  const target_audience = formData.get("target_audience") as string;
  const file = formData.get("brand_context_file") as File | null;

  let brand_context_file: string | null = null;

  if (file && file.size > 0) {
    brand_context_file = await uploadBrandContextFile(file, user.id);
  }

  const { error } = await supabase.from("brands").insert({
    name,
    niche,
    tone,
    target_audience,
    brand_context_file,
    user_id: user.id,
  });

  if (error) {
    console.error("Error creating brand:", error);
    throw new Error("Error al crear la marca: " + error.message);
  }

  revalidatePath("/brands");
  revalidatePath("/");
  redirect("/brands");
}

export async function updateBrand(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const name = formData.get("name") as string;
  const niche = formData.get("niche") as string;
  const tone = formData.get("tone") as string;
  const target_audience = formData.get("target_audience") as string;
  const file = formData.get("brand_context_file") as File | null;

  const updates: Record<string, unknown> = {
    name,
    niche,
    tone,
    target_audience,
    updated_at: new Date().toISOString(),
  };

  if (file && file.size > 0) {
    updates.brand_context_file = await uploadBrandContextFile(file, user.id);
  }

  const { error } = await supabase
    .from("brands")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating brand:", error);
    throw new Error("Error al actualizar la marca: " + error.message);
  }

  revalidatePath("/brands");
  revalidatePath(`/brands/${id}`);
  revalidatePath("/");
  redirect(`/brands/${id}`);
}

export async function deleteBrand(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("brands")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting brand:", error);
    throw new Error("Error al eliminar la marca: " + error.message);
  }

  revalidatePath("/brands");
  revalidatePath("/");
  redirect("/brands");
}

export async function uploadBrandContextFile(file: File, userId: string): Promise<string> {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("brand-files")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file:", error);
    throw new Error("Error al subir el archivo: " + error.message);
  }

  return fileName;
}

export async function getBrandContextFileUrl(filePath: string): Promise<string | null> {
  const supabase = await createClient();

  const { data } = await supabase.storage
    .from("brand-files")
    .createSignedUrl(filePath, 3600);

  return data?.signedUrl || null;
}

export async function getBrandContextFileContent(filePath: string): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("brand-files")
    .download(filePath);

  if (error || !data) {
    return "";
  }

  return await data.text();
}
