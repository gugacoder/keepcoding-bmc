import { getDb } from "./db";
import type { UserPayload } from "./auth";

interface Article {
  id: number;
  owner_id: number;
  visibility: "owner-only" | "group-permission" | "public" | "authenticated";
  share_token?: string | null;
}

export function canReadArticle(article: Article, user: UserPayload | null, shareToken?: string | null): boolean {
  // Share token bypass — works regardless of visibility
  if (shareToken && article.share_token && article.share_token === shareToken) return true;
  if (article.visibility === "public") return true;
  if (!user) return false;
  if (user.role === "admin") return true;
  if (article.owner_id === user.id) return true;
  if (article.visibility === "authenticated") return true;
  if (article.visibility === "group-permission") {
    return hasGroupAccess(article.id, user.id, "read");
  }
  return false;
}

export function canWriteArticle(article: Article, user: UserPayload | null): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (article.owner_id === user.id) return true;
  if (article.visibility === "group-permission") {
    return hasGroupAccess(article.id, user.id, "write");
  }
  return false;
}

function hasGroupAccess(articleId: number, userId: number, permission: "read" | "write"): boolean {
  const db = getDb();
  const permLevels = permission === "write" ? ["write"] : ["read", "write"];
  const placeholders = permLevels.map(() => "?").join(",");
  const result = db.prepare(`
    SELECT 1 FROM article_group_permissions agp
    JOIN group_members gm ON gm.group_id = agp.group_id
    WHERE agp.article_id = ? AND gm.user_id = ? AND agp.permission IN (${placeholders})
    LIMIT 1
  `).get(articleId, userId, ...permLevels);
  return !!result;
}
