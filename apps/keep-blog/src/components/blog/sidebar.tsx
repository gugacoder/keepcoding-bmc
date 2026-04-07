import Link from "next/link";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canReadArticle } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Tag, FileText, LogIn, UserPlus } from "lucide-react";
import { UserMenu } from "./user-menu";

export async function Sidebar() {
  const user = await getCurrentUser();
  const db = getDb();

  const articles = db.prepare(`
    SELECT a.id, a.slug, a.title, a.tags, a.published_at, a.visibility, a.owner_id, a.content_type
    FROM articles a
    ORDER BY a.published_at DESC, a.created_at DESC
  `).all() as any[];

  const visibleArticles = articles.filter((a: any) => canReadArticle(a, user));

  // Extract all tags
  const allTags: Record<string, number> = {};
  visibleArticles.forEach((a: any) => {
    const tags = JSON.parse(a.tags || "[]");
    tags.forEach((t: string) => {
      allTags[t] = (allTags[t] || 0) + 1;
    });
  });

  // Group articles by month for calendar
  const byMonth: Record<string, typeof visibleArticles> = {};
  visibleArticles.forEach((a: any) => {
    const date = a.published_at ? new Date(a.published_at) : new Date(a.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(a);
  });

  const monthNames: Record<string, string> = {
    "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril",
    "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto",
    "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro",
  };

  return (
    <aside className="w-72 shrink-0 border-r border-sidebar-border bg-sidebar min-h-screen p-6 flex flex-col gap-6">
      {/* Logo / Brand */}
      <div>
        <Link href="/" className="block">
          <h1 className="text-xl font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>Keep Coding</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Blog & Business Canvas</p>
        </Link>
      </div>

      <Separator />

      {/* User section */}
      <div className="flex flex-col gap-2">
        {user ? (
          <UserMenu user={{ name: user.name, email: user.email, role: user.role }} />
        ) : (
          <div className="flex flex-col gap-2">
            <Link href="/login" className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <LogIn className="w-4 h-4" /> Entrar
            </Link>
            <Link href="/register" className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <UserPlus className="w-4 h-4" /> Registrar
            </Link>
          </div>
        )}
      </div>

      <Separator />

      {/* Articles list */}
      <nav>
        <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" /> Artigos
        </h2>
        <ul className="space-y-1.5">
          {visibleArticles.map((a: any) => (
            <li key={a.slug}>
              <Link
                href={`/articles/${a.slug}`}
                className="text-sm text-foreground/80 hover:text-primary block py-1 px-2 rounded hover:bg-accent transition-colors truncate"
                title={a.title}
              >
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Separator />

      {/* Tags */}
      {Object.keys(allTags).length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Tags
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(allTags).map(([tag, count]) => (
              <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`}>
                <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-accent">
                  {tag} ({count})
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {Object.keys(allTags).length > 0 && <Separator />}

      {/* Publication Calendar */}
      <div>
        <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> Publicações
        </h2>
        <div className="space-y-3">
          {Object.entries(byMonth)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([month, monthArticles]) => {
              const [year, m] = month.split("-");
              return (
                <div key={month}>
                  <h3 className="text-xs font-medium text-foreground/70 mb-1">
                    {monthNames[m]} {year}
                  </h3>
                  <ul className="space-y-0.5">
                    {monthArticles.map((a: any) => {
                      const date = new Date(a.published_at || a.created_at);
                      return (
                        <li key={a.slug}>
                          <Link
                            href={`/articles/${a.slug}`}
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5"
                          >
                            <span className="text-[10px] font-mono w-5 text-right">{date.getDate()}</span>
                            <span className="truncate">{a.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Separator />
        <p className="text-[10px] text-muted-foreground mt-3 text-center">
          Keep Coding &copy; {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}
