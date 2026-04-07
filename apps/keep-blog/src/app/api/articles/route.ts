import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canReadArticle } from "@/lib/permissions";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  const db = getDb();
  const tag = req.nextUrl.searchParams.get("tag");

  let articles = db.prepare(`
    SELECT a.*, u.name as author_name, u.email as author_email
    FROM articles a
    JOIN users u ON u.id = a.owner_id
    ORDER BY a.published_at DESC, a.created_at DESC
  `).all() as any[];

  if (tag) {
    articles = articles.filter((a: any) => {
      const tags = JSON.parse(a.tags || "[]");
      return tags.includes(tag);
    });
  }

  const visible = articles.filter((a: any) => canReadArticle(a, user, null));

  const result = visible.map((a: any) => ({
    ...a,
    tags: JSON.parse(a.tags || "[]"),
    content: undefined,
  }));

  return NextResponse.json({ articles: result });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { title, content, content_type, tags, visibility, published_at } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: "Título e conteúdo são obrigatórios" }, { status: 400 });
  }

  const slug = slugify(title, { lower: true, strict: true });
  const db = getDb();

  // Ensure unique slug
  let finalSlug = slug;
  let counter = 1;
  while (db.prepare("SELECT id FROM articles WHERE slug = ?").get(finalSlug)) {
    finalSlug = `${slug}-${counter++}`;
  }

  const result = db.prepare(`
    INSERT INTO articles (slug, title, content, content_type, tags, owner_id, visibility, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    finalSlug,
    title,
    content,
    content_type || "markdown",
    JSON.stringify(tags || []),
    user.id,
    visibility || "owner-only",
    published_at || new Date().toISOString()
  );

  return NextResponse.json({ id: result.lastInsertRowid, slug: finalSlug, success: true });
}
