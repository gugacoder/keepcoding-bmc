import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const db = getDb();
  const permissions = db.prepare(`
    SELECT agp.*, g.name as group_name
    FROM article_group_permissions agp
    JOIN groups g ON g.id = agp.group_id
    WHERE agp.article_id = ?
  `).all(id);

  return NextResponse.json({ permissions });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const { groupId, permission, visibility } = await req.json();
  const db = getDb();

  if (visibility) {
    db.prepare("UPDATE articles SET visibility = ? WHERE id = ?").run(visibility, id);
  }

  if (groupId && permission) {
    db.prepare(`
      INSERT OR REPLACE INTO article_group_permissions (article_id, group_id, permission) VALUES (?, ?, ?)
    `).run(id, groupId, permission);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const { groupId } = await req.json();
  const db = getDb();
  db.prepare("DELETE FROM article_group_permissions WHERE article_id = ? AND group_id = ?").run(id, groupId);
  return NextResponse.json({ success: true });
}
