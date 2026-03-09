"use server";

import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  activePieces: number;
  inProduction: number;
  publishedThisMonth: number;
  activeBrands: number;
};

export type BrandMetrics = {
  brand_id: string;
  brand_name: string;
  total_views: number;
  total_likes: number;
  total_saves: number;
  total_shares: number;
  total_comments: number;
  total_follows: number;
  piece_count: number;
  avg_engagement: number;
};

export type FunnelBalance = {
  tofu: number;
  mofu: number;
  bofu: number;
  total: number;
};

export type CalendarEntry = {
  date: string;
  pieces: {
    id: string;
    title: string;
    funnel_position: string | null;
  }[];
};

export type HookRanking = {
  id: string;
  hook_text: string;
  performance_score: number;
  times_used: number;
  type: string;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { activePieces: 0, inProduction: 0, publishedThisMonth: 0, activeBrands: 0 };

  const [piecesRes, brandsRes] = await Promise.all([
    supabase.from("content_pieces").select("id, current_step, published_at").eq("user_id", user.id),
    supabase.from("brands").select("id").eq("user_id", user.id),
  ]);

  const pieces = piecesRes.data || [];
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  return {
    activePieces: pieces.filter((p) => (p.current_step || 1) < 6).length,
    inProduction: pieces.filter((p) => (p.current_step || 1) >= 3 && (p.current_step || 1) <= 5).length,
    publishedThisMonth: pieces.filter((p) => p.current_step === 6 && p.published_at && p.published_at >= monthStart).length,
    activeBrands: brandsRes.data?.length || 0,
  };
}

export async function getBrandMetrics(): Promise<BrandMetrics[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: brands } = await supabase.from("brands").select("id, name").eq("user_id", user.id);
  if (!brands || brands.length === 0) return [];

  const { data: pieces } = await supabase
    .from("content_pieces")
    .select("brand_id, metric_views, metric_likes, metric_saves, metric_shares, metric_comments, metric_follows")
    .eq("user_id", user.id)
    .eq("current_step", 6);

  if (!pieces) return brands.map((b) => ({
    brand_id: b.id,
    brand_name: b.name,
    total_views: 0,
    total_likes: 0,
    total_saves: 0,
    total_shares: 0,
    total_comments: 0,
    total_follows: 0,
    piece_count: 0,
    avg_engagement: 0,
  }));

  return brands.map((brand) => {
    const brandPieces = pieces.filter((p) => p.brand_id === brand.id);
    const totalViews = brandPieces.reduce((sum, p) => sum + (p.metric_views || 0), 0);
    const totalLikes = brandPieces.reduce((sum, p) => sum + (p.metric_likes || 0), 0);
    const totalSaves = brandPieces.reduce((sum, p) => sum + (p.metric_saves || 0), 0);
    const totalShares = brandPieces.reduce((sum, p) => sum + (p.metric_shares || 0), 0);
    const totalComments = brandPieces.reduce((sum, p) => sum + (p.metric_comments || 0), 0);
    const totalFollows = brandPieces.reduce((sum, p) => sum + (p.metric_follows || 0), 0);
    const totalInteractions = totalLikes + totalSaves + totalShares + totalComments;
    const avgEngagement = totalViews > 0 ? (totalInteractions / totalViews) * 100 : 0;

    return {
      brand_id: brand.id,
      brand_name: brand.name,
      total_views: totalViews,
      total_likes: totalLikes,
      total_saves: totalSaves,
      total_shares: totalShares,
      total_comments: totalComments,
      total_follows: totalFollows,
      piece_count: brandPieces.length,
      avg_engagement: Math.round(avgEngagement * 100) / 100,
    };
  });
}

export async function getFunnelBalance(): Promise<FunnelBalance> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { tofu: 0, mofu: 0, bofu: 0, total: 0 };

  const { data: pieces } = await supabase
    .from("content_pieces")
    .select("funnel_position")
    .eq("user_id", user.id);

  if (!pieces) return { tofu: 0, mofu: 0, bofu: 0, total: 0 };

  return {
    tofu: pieces.filter((p) => p.funnel_position === "tofu").length,
    mofu: pieces.filter((p) => p.funnel_position === "mofu").length,
    bofu: pieces.filter((p) => p.funnel_position === "bofu").length,
    total: pieces.length,
  };
}

export async function getContentCalendar(): Promise<CalendarEntry[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const { data: pieces } = await supabase
    .from("content_pieces")
    .select("id, title, funnel_position, published_at, editor_deadline")
    .eq("user_id", user.id)
    .or(`published_at.gte.${monthStart},editor_deadline.gte.${monthStart}`)
    .or(`published_at.lte.${monthEnd},editor_deadline.lte.${monthEnd}`);

  if (!pieces) return [];

  const calendar: Record<string, CalendarEntry> = {};

  pieces.forEach((p) => {
    const date = p.published_at || p.editor_deadline;
    if (!date) return;
    const dateKey = date.split("T")[0];
    if (!calendar[dateKey]) {
      calendar[dateKey] = { date: dateKey, pieces: [] };
    }
    calendar[dateKey].pieces.push({
      id: p.id,
      title: p.title,
      funnel_position: p.funnel_position,
    });
  });

  return Object.values(calendar).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getConsistencyScore(): Promise<number> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  // Look at last 4 weeks
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const { data: pieces } = await supabase
    .from("content_pieces")
    .select("published_at")
    .eq("user_id", user.id)
    .eq("current_step", 6)
    .gte("published_at", fourWeeksAgo.toISOString());

  if (!pieces || pieces.length === 0) return 0;

  // Check how many weeks had at least one publication
  const weeks = new Set<number>();
  pieces.forEach((p) => {
    if (p.published_at) {
      const date = new Date(p.published_at);
      const weekNumber = Math.floor((date.getTime() - fourWeeksAgo.getTime()) / (7 * 24 * 60 * 60 * 1000));
      weeks.add(weekNumber);
    }
  });

  return Math.round((weeks.size / 4) * 100);
}

export async function getTopHooks(): Promise<HookRanking[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("hooks_library")
    .select("id, hook_text, performance_score, times_used, type")
    .eq("user_id", user.id)
    .order("performance_score", { ascending: false })
    .limit(5);

  return data || [];
}
