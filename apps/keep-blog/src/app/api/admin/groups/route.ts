import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const db = getDb();
  const groups = db.prepare(`
    SELECT g.*, COUNT(gm.user_id) as member_count
    FROM groups g
    LEFT JOIN group_members gm ON gm.group_id = g.id
    GROUP BY g.id
    ORDER BY g.name
  `).all();

  return NextResponse.json({ groups });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { name, description } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  const db = getDb();
  try {
    const result = db.prepare("INSERT INTO groups (name, description) VALUES (?, ?)").run(name, description || "");
    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch {
    return NextResponse.json({ error: "Grupo já existe" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { groupId } = await req.json();
  const db = getDb();
  db.prepare("DELETE FROM groups WHERE id = ?").run(groupId);
  return NextResponse.json({ success: true });
}
