import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword, createToken, setAuthCookie, ensureRootAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  ensureRootAdmin();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  const db = getDb();
  const user = db.prepare("SELECT id, password_hash, is_active FROM users WHERE email = ?").get(email) as any;

  if (!user) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  if (!user.is_active) {
    return NextResponse.json({ error: "Conta desativada" }, { status: 403 });
  }

  if (!verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const token = createToken(user.id);
  const response = NextResponse.json({ success: true });
  response.cookies.set(setAuthCookie(token));
  return response;
}
