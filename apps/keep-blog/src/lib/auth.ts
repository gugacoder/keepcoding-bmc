import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getDb } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "keep-blog-default-secret";
const COOKIE_NAME = "keep-blog-token";

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  is_root_admin: boolean;
  is_active: boolean;
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const db = getDb();
    const user = db.prepare("SELECT id, email, name, role, is_root_admin, is_active FROM users WHERE id = ?").get(decoded.userId) as any;
    if (!user || !user.is_active) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      is_root_admin: !!user.is_root_admin,
      is_active: !!user.is_active,
    };
  } catch {
    return null;
  }
}

export function createToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function setAuthCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearAuthCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

export function ensureRootAdmin() {
  const seed = process.env.ADMIN_USER_SEED;
  if (!seed) return;

  const [email, password] = seed.split(":");
  if (!email || !password) return;

  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as any;
  if (!existing) {
    db.prepare(
      "INSERT INTO users (email, password_hash, name, role, is_root_admin, is_active) VALUES (?, ?, ?, 'admin', 1, 1)"
    ).run(email, hashPassword(password), "Admin");
  }
}
