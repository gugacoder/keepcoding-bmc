import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canWriteArticle } from "@/lib/permissions";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();
  const article = db.prepare("SELECT * FROM articles WHERE id = ?").get(id) as any;

  if (!article) {
    return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });
  }

  if (!canWriteArticle(article, user)) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { title, content, tags, visibility, published_at } = await req.json();
  const updates: string[] = [];
  const values: any[] = [];

  if (title !== undefined) { updates.push("title = ?"); values.push(title); }
  if (content !== undefined) { updates.push("content = ?"); values.push(content); }
  if (tags !== undefined) { updates.push("tags = ?"); values.push(JSON.stringify(tags)); }
  if (visibility !== undefined) { updates.push("visibility = ?"); values.push(visibility); }
  if (published_at !== undefined) { updates.push("published_at = ?"); values.push(published_at); }

  updates.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE articles SET ${updates.join(", ")} WHERE id = ?`).run(...values);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();
  const article = db.prepare("SELECT * FROM articles WHERE id = ?").get(id) as any;

  if (!article) {
    return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });
  }

  if (!canWriteArticle(article, user)) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  db.prepare("DELETE FROM articles WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
