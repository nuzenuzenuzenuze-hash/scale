export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getPiece } from "@/lib/actions/content";
import { getBrand } from "@/lib/actions/brands";
import { getMembers } from "@/lib/actions/team";
import { ContentDetailClient } from "./content-detail-client";

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const piece = await getPiece(id);
  if (!piece) notFound();

  const brand = await getBrand(piece.brand_id);
  const members = await getMembers();

  return (
    <ContentDetailClient piece={piece} brand={brand} members={members} />
  );
}
