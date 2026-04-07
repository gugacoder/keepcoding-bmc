import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const db = getDb();
  const users = db.prepare(
    "SELECT id, email, name, role, is_root_admin, is_active, created_at FROM users ORDER BY created_at DESC"
  ).all();

  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { userId, role, is_active } = await req.json();
  const db = getDb();
  const target = db.prepare("SELECT id, is_root_admin, role FROM users WHERE id = ?").get(userId) as any;

  if (!target) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  // Root admin role cannot be changed, only active status
  if (target.is_root_admin && role !== undefined && role !== "admin") {
    return NextResponse.json({ error: "Não é possível remover role admin do admin raiz" }, { status: 400 });
  }

  const updates: string[] = [];
  const params: any[] = [];

  if (role !== undefined) {
    updates.push("role = ?");
    params.push(role);
  }

  if (is_active !== undefined) {
    updates.push("is_active = ?");
    params.push(is_active ? 1 : 0);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "Nada para atualizar" }, { status: 400 });
  }

  params.push(userId);
  db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).run(...params);

  return NextResponse.json({ success: true });
}
