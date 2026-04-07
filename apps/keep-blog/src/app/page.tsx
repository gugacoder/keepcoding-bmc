import Link from "next/link";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canReadArticle } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/blog/breadcrumb";
import { Calendar, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Início | Keep Coding Blog",
  description: "Blog da Keep Coding — artigos sobre estratégia de produto, automação e Business Model Canvas.",
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ tag?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const user = await getCurrentUser();
  const db = getDb();

  let articles = db.prepare(`
    SELECT a.*, u.name as author_name, u.email as author_email
    FROM articles a
    JOIN users u ON u.id = a.owner_id
    ORDER BY a.published_at DESC, a.created_at DESC
  `).all() as any[];

  articles = articles.filter((a: any) => canReadArticle(a, user));

  if (tag) {
    articles = articles.filter((a: any) => {
      const tags = JSON.parse(a.tags || "[]");
      return tags.includes(tag);
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={tag ? [{ label: `Tag: ${tag}` }] : []} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
          {tag ? `Artigos: ${tag}` : "Artigos"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Estratégia de produto, automação com IA e Business Model Canvas.
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">Nenhum artigo encontrado.</p>
      ) : (
        <div className="space-y-4">
          {articles.map((article: any) => {
            const tags = JSON.parse(article.tags || "[]");
            const date = article.published_at
              ? new Date(article.published_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
              : null;

            return (
              <Link key={article.slug} href={`/articles/${article.slug}`} className="block group">
                <Card className="transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {article.author_name}
                      </span>
                      {date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {date}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  {tags.length > 0 && (
                    <CardContent>
                      <div className="flex gap-1.5 flex-wrap">
                        {tags.map((t: string) => (
                          <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
