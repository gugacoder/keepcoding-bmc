import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword, createToken, setAuthCookie, ensureRootAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  ensureRootAdmin();
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Senha deve ter pelo menos 8 caracteres" }, { status: 400 });
  }

  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
  }

  const result = db.prepare(
    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)"
  ).run(email, hashPassword(password), name || email.split("@")[0]);

  const token = createToken(result.lastInsertRowid as number);
  const response = NextResponse.json({ success: true });
  response.cookies.set(setAuthCookie(token));
  return response;
}
