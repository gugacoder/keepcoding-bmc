import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canReadArticle } from "@/lib/permissions";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { SvgRenderer } from "@/components/blog/svg-renderer";
import { Breadcrumb } from "@/components/blog/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Eye } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const article = db.prepare("SELECT title, tags FROM articles WHERE slug = ?").get(slug) as any;

  if (!article) return { title: "Artigo não encontrado" };

  const tags = JSON.parse(article.tags || "[]");
  return {
    title: article.title,
    description: `${article.title} — Keep Coding Blog`,
    keywords: ["Keep Coding", ...tags],
    openGraph: {
      title: article.title,
      description: `${article.title} — Keep Coding Blog`,
      type: "article",
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { token } = await searchParams;
  const user = await getCurrentUser();
  const db = getDb();

  const article = db.prepare(`
    SELECT a.*, u.name as author_name, u.email as author_email
    FROM articles a
    JOIN users u ON u.id = a.owner_id
    WHERE a.slug = ?
  `).get(slug) as any;

  if (!article) notFound();
  if (!canReadArticle(article, user, token)) notFound();

  const tags = JSON.parse(article.tags || "[]");
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  const visibilityLabels: Record<string, string> = {
    "owner-only": "Privado",
    "group-permission": "Grupos",
    "public": "Público",
    "authenticated": "Autenticado",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Artigos", href: "/" }, { label: article.title }]} />

      <article itemScope itemType="https://schema.org/Article">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4" itemProp="headline" style={{ fontFamily: "var(--font-heading)" }}>{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1" itemProp="author">
              <User className="w-4 h-4" />
              {article.author_name}
            </span>
            {date && (
              <time className="flex items-center gap-1" dateTime={article.published_at} itemProp="datePublished">
                <Calendar className="w-4 h-4" />
                {date}
              </time>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {visibilityLabels[article.visibility]}
            </span>
          </div>
          {tags.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </header>

        <div itemProp="articleBody">
          {article.content_type === "svg" ? (
            <SvgRenderer content={article.content} />
          ) : (
            <MarkdownRenderer content={article.content} />
          )}
        </div>
      </article>
    </div>
  );
}
