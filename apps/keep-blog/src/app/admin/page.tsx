import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { Breadcrumb } from "@/components/blog/breadcrumb";
import { AdminPanel } from "@/components/admin/admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/login");

  const db = getDb();
  const users = db.prepare(
    "SELECT id, email, name, role, is_root_admin, is_active, created_at FROM users ORDER BY created_at DESC"
  ).all() as any[];

  const groups = db.prepare(`
    SELECT g.*, COUNT(gm.user_id) as member_count
    FROM groups g
    LEFT JOIN group_members gm ON gm.group_id = g.id
    GROUP BY g.id
    ORDER BY g.name
  `).all() as any[];

  const articles = db.prepare(`
    SELECT a.id, a.slug, a.title, a.visibility, a.owner_id, u.name as author_name
    FROM articles a
    JOIN users u ON u.id = a.owner_id
    ORDER BY a.created_at DESC
  `).all() as any[];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Administração" }]} />
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)" }}>Painel de Administração</h1>
      <AdminPanel
        initialUsers={users}
        initialGroups={groups}
        initialArticles={articles}
      />
    </div>
  );
}
