import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const db = getDb();
  const article = db.prepare("SELECT share_token, slug FROM articles WHERE id = ?").get(id) as any;

  if (!article) {
    return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ share_token: article.share_token, slug: article.slug });
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const db = getDb();
  const token = randomUUID();
  db.prepare("UPDATE articles SET share_token = ? WHERE id = ?").run(token, id);

  const article = db.prepare("SELECT slug FROM articles WHERE id = ?").get(id) as any;
  return NextResponse.json({ share_token: token, slug: article?.slug });
}
