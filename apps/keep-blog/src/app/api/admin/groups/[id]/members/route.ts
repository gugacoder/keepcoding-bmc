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
  const members = db.prepare(`
    SELECT u.id, u.email, u.name, u.role
    FROM users u
    JOIN group_members gm ON gm.user_id = u.id
    WHERE gm.group_id = ?
    ORDER BY u.name
  `).all(id);

  return NextResponse.json({ members });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const { userId } = await req.json();
  const db = getDb();

  try {
    db.prepare("INSERT INTO group_members (group_id, user_id) VALUES (?, ?)").run(id, userId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Membro já existe no grupo" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const { userId } = await req.json();
  const db = getDb();
  db.prepare("DELETE FROM group_members WHERE group_id = ? AND user_id = ?").run(id, userId);
  return NextResponse.json({ success: true });
}
