import { test, expect, type Page } from "@playwright/test";

// Helper: login
async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("/", { timeout: 10000 });
}

// Helper: register
async function register(page: Page, name: string, email: string, password: string) {
  await page.goto("/register");
  await page.getByLabel("Nome").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel(/Senha/).fill(password);
  await page.getByRole("button", { name: "Registrar" }).click();
  await page.waitForURL("/", { timeout: 10000 });
}

const main = (page: Page) => page.getByRole("main");
const sidebar = (page: Page) => page.getByRole("complementary");

// ─── PUBLIC PAGES ───

test.describe("Public pages", () => {
  test("home page loads and shows articles", async ({ page }) => {
    await page.goto("/");
    await expect(main(page).getByRole("heading", { name: "Artigos" })).toBeVisible();
    await expect(main(page).getByText("One-Pager - Keep Coding")).toBeVisible();
    await expect(main(page).getByText("Hipóteses - Keep Coding")).toBeVisible();
    await expect(main(page).getByText("Business Model Canvas - Keep Coding")).toBeVisible();
  });

  test("sidebar shows articles, tags, and publication calendar", async ({ page }) => {
    await page.goto("/");
    await expect(sidebar(page).getByRole("heading", { name: "Keep Coding" })).toBeVisible();
    await expect(sidebar(page).getByText("Artigos")).toBeVisible();
    await expect(sidebar(page).getByText("Tags")).toBeVisible();
    await expect(sidebar(page).getByText("Publicações")).toBeVisible();
    await expect(sidebar(page).getByText("keep-coding").first()).toBeVisible();
  });

  test("breadcrumb renders on home page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    await expect(main(page).getByText("Início")).toBeVisible();
  });

  test("markdown article page renders content", async ({ page }) => {
    await page.goto("/articles/one-pager-keep-coding");
    await expect(main(page).locator("article h1").first()).toBeVisible();
    await expect(main(page).locator("article table").first()).toBeVisible();
    await expect(main(page).getByText("Início")).toBeVisible();
  });

  test("SVG article page renders the canvas", async ({ page }) => {
    await page.goto("/articles/business-model-canvas-keep-coding");
    await expect(main(page).getByRole("heading", { name: "Business Model Canvas - Keep Coding" })).toBeVisible();
    await expect(main(page).locator('svg[viewBox="0 0 1400 960"]')).toBeVisible();
  });

  test("hypothesis article page renders", async ({ page }) => {
    await page.goto("/articles/hipoteses-keep-coding");
    await expect(main(page).getByRole("heading", { name: /Hipóteses/ }).first()).toBeVisible();
    await expect(main(page).getByText("H1.")).toBeVisible();
  });

  test("tag filter works", async ({ page }) => {
    await page.goto("/?tag=BMC");
    await expect(main(page).getByText("Business Model Canvas - Keep Coding")).toBeVisible();
    await expect(main(page).locator("a").filter({ hasText: "One-Pager - Keep Coding" })).not.toBeVisible();
  });

  test("non-existent article returns 404", async ({ page }) => {
    const response = await page.goto("/articles/nao-existe-xyz");
    expect(response?.status()).toBe(404);
  });
});

// ─── AUTH ───

test.describe("Authentication", () => {
  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Registrar" })).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  });

  test("login with guga.coder@gmail.com (seeded user)", async ({ page }) => {
    await login(page, "guga.coder@gmail.com", "12345678");
    // Avatar should be visible in sidebar
    await expect(sidebar(page).getByLabel("Menu do usuário")).toBeVisible();
  });

  test("register new user test-user@example.com", async ({ page }) => {
    await register(page, "Test User", "test-user@example.com", "12345678");
    await expect(sidebar(page).getByLabel("Menu do usuário")).toBeVisible();
  });

  test("login with admin account and see admin in dropdown", async ({ page }) => {
    await login(page, "admin@gmail.com", "12345678");
    // Click avatar to open dropdown
    await sidebar(page).getByLabel("Menu do usuário").click();
    await expect(page.getByText("admin@gmail.com")).toBeVisible();
    await expect(page.getByRole("link", { name: "Painel Admin" })).toBeVisible();
  });

  test("login with wrong password shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("admin@gmail.com");
    await page.getByLabel("Senha").fill("wrongpassword");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText("Credenciais inválidas")).toBeVisible();
  });

  test("logout works via avatar menu", async ({ page }) => {
    await login(page, "admin@gmail.com", "12345678");
    // Open avatar dropdown and click Sair
    await sidebar(page).getByLabel("Menu do usuário").click();
    await page.getByText("Sair").click();
    await page.waitForTimeout(1000);
    await expect(sidebar(page).getByText("Entrar")).toBeVisible();
  });
});

// ─── ADMIN PANEL ───

test.describe("Admin panel", () => {
  test("non-admin cannot access admin page", async ({ page }) => {
    await login(page, "guga.coder@gmail.com", "12345678");
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin can access admin panel", async ({ page }) => {
    await login(page, "admin@gmail.com", "12345678");
    await page.goto("/admin");
    await expect(main(page).getByRole("heading", { name: "Painel de Administração" })).toBeVisible();
  });

  test("admin panel shows users tab with all users", async ({ page }) => {
    await login(page, "admin@gmail.com", "12345678");
    await page.goto("/admin");
    await main(page).getByRole("button", { name: /Usuários/ }).click();
    await expect(main(page).getByText("Gerenciar Usuários")).toBeVisible();
    await expect(main(page).getByText("admin@gmail.com")).toBeVisible();
    await expect(main(page).getByText("guga.coder@gmail.com")).toBeVisible();
  });

  test("admin can promote user to admin and demote back", async ({ page }) => {
    await login(page, "admin@gmail.com", "12345678");
    await page.goto("/admin");
    await main(page).getByRole("button", { name: /Usuários/ }).click();

    const gugaRow = main(page).locator("[data-testid^='user-row-']").filter({ hasText: "guga.coder@gmail.com" });
    await gugaRow.getByTitle("Tornar admin").click();
    await page.waitForTimeout(1500);
    await page.reload();
    await main(page).getByRole("button", { name: /Usuários/ }).click();

    const gugaRowAfter = main(page).locator("[data-testid^='user-row-']").filter({ hasText: "guga.coder@gmail.com" });
    await expect(gugaRowAfter.getByTitle("Remover admin")).toBeVisible();

    // Demote back
    await gugaRowAfter.getByTitle("Remover admin").click();
    await page.waitForTimeout(1000);
  });

  test("admin can create a group", async ({ page }) => {
    await login(page, "admin@gmail.com", "12345678");
    await page.goto("/admin");
    await main(page).getByRole("button", { name: /Grupos/ }).click();

    await main(page).getByPlaceholder("Nome do grupo").fill("Equipe Core");
    await main(page).getByPlaceholder("Descrição (opcional)").fill("Time principal");
    await main(page).getByRole("button", { name: "Criar" }).click();
    await page.waitForTimeout(1000);
    await page.reload();
    await main(page).getByRole("button", { name: /Grupos/ }).click();
    await expect(main(page).getByText("Equipe Core")).toBeVisible();
  });

  test("admin can add member to group via API", async ({ page }) => {
    await login(page, "admin@gmail.com", "12345678");

    // Get group ID for "Equipe Core"
    const groupsRes = await page.evaluate(async () => {
      const res = await fetch("/api/admin/groups");
      return res.json();
    });
    const group = groupsRes.groups.find((g: any) => g.name === "Equipe Core");

    // Get Guga's user ID
    const usersRes = await page.evaluate(async () => {
      const res = await fetch("/api/admin/users");
      return res.json();
    });
    const guga = usersRes.users.find((u: any) => u.email === "guga.coder@gmail.com");

    // Add Guga to group via API
    const addRes = await page.evaluate(async ({ groupId, userId }) => {
      const res = await fetch(`/api/admin/groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      return { ok: res.ok, status: res.status };
    }, { groupId: group.id, userId: guga.id });
    expect(addRes.ok).toBeTruthy();

    // Verify member was added
    const membersRes = await page.evaluate(async (groupId) => {
      const res = await fetch(`/api/admin/groups/${groupId}/members`);
      return res.json();
    }, group.id);
    const gugaMember = membersRes.members.find((m: any) => m.email === "guga.coder@gmail.com");
    expect(gugaMember).toBeTruthy();
    expect(gugaMember.name).toBe("Guga");
  });

  test("admin can manage article visibility", async ({ page }) => {
    await login(page, "admin@gmail.com", "12345678");
    await page.goto("/admin");
    await main(page).getByRole("button", { name: /Artigos/ }).click();
    await expect(main(page).getByText("Gerenciar Permissões dos Artigos")).toBeVisible();

    const onePagerRow = main(page).locator("[data-testid^='article-row-']").filter({ hasText: "One-Pager" });
    await expect(onePagerRow).toBeVisible();
  });

  test("admin can deactivate root admin via API and reactivate", async ({ page }) => {
    // First promote guga to admin so guga can reactivate root
    await login(page, "admin@gmail.com", "12345678");
    await page.goto("/admin");
    await main(page).getByRole("button", { name: /Usuários/ }).click();

    const gugaRow = main(page).locator("[data-testid^='user-row-']").filter({ hasText: "guga.coder@gmail.com" });
    await gugaRow.getByTitle("Tornar admin").click();
    await page.waitForTimeout(1500);

    // Now deactivate root admin via API (since UI deactivation logs us out)
    const adminRow = main(page).locator("[data-testid^='user-row-']").filter({ hasText: "Admin Raiz" });
    // Get admin user id from data-testid
    const testId = await adminRow.getAttribute("data-testid");
    const adminUserId = testId?.replace("user-row-", "");

    // Deactivate via API
    await page.evaluate(async (userId) => {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(userId), is_active: false }),
      });
    }, adminUserId);

    // Now login as guga (who is now admin) and reactivate root
    await login(page, "guga.coder@gmail.com", "12345678");
    await page.goto("/admin");
    await main(page).getByRole("button", { name: /Usuários/ }).click();

    const inactiveAdminRow = main(page).locator("[data-testid^='user-row-']").filter({ hasText: "Admin Raiz" });
    await expect(inactiveAdminRow.getByText("Inativo")).toBeVisible();
    await inactiveAdminRow.getByTitle("Ativar").click();
    await page.waitForTimeout(1000);

    // Demote guga back to user
    await page.reload();
    await main(page).getByRole("button", { name: /Usuários/ }).click();
    const gugaRow2 = main(page).locator("[data-testid^='user-row-']").filter({ hasText: "guga.coder@gmail.com" });
    await gugaRow2.getByTitle("Remover admin").click();
    await page.waitForTimeout(1000);
  });
});

// ─── ARTICLE PERMISSIONS ───

test.describe("Article permissions", () => {
  test("owner-only article is not visible to anonymous users", async ({ page }) => {
    // As admin, set One-Pager to owner-only via API
    await login(page, "admin@gmail.com", "12345678");

    // Find article ID for One-Pager
    const articlesRes = await page.evaluate(async () => {
      const res = await fetch("/api/articles");
      return res.json();
    });
    const onePager = articlesRes.articles.find((a: any) => a.slug === "one-pager-keep-coding");

    // Set to owner-only
    await page.evaluate(async (articleId) => {
      await fetch(`/api/admin/articles/${articleId}/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: "owner-only" }),
      });
    }, onePager.id);

    // Logout via avatar menu
    await sidebar(page).getByLabel("Menu do usuário").click();
    await page.getByText("Sair").click();
    await page.waitForTimeout(1000);

    // As anonymous, article should not be in the list
    await page.goto("/");
    await expect(main(page).locator("a").filter({ hasText: "One-Pager" })).not.toBeVisible();

    // Direct access should 404
    const response = await page.goto("/articles/one-pager-keep-coding");
    expect(response?.status()).toBe(404);

    // Restore to public
    await login(page, "admin@gmail.com", "12345678");
    await page.evaluate(async (articleId) => {
      await fetch(`/api/admin/articles/${articleId}/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: "public" }),
      });
    }, onePager.id);
  });
});

// ─── SEO ───

test.describe("SEO", () => {
  test("home page has correct meta tags", async ({ page }) => {
    await page.goto("/");
    const title = await page.title();
    expect(title).toContain("Keep Coding");

    const description = await page.getAttribute('meta[name="description"]', "content");
    expect(description).toBeTruthy();
  });

  test("article page has correct meta and schema.org", async ({ page }) => {
    await page.goto("/articles/one-pager-keep-coding");
    const title = await page.title();
    expect(title).toContain("One-Pager");

    const articleEl = page.locator('[itemtype="https://schema.org/Article"]');
    await expect(articleEl).toBeVisible();

    const breadcrumbEl = page.locator('[itemtype="https://schema.org/BreadcrumbList"]');
    await expect(breadcrumbEl).toBeVisible();
  });

  test("page has lang attribute", async ({ page }) => {
    await page.goto("/");
    const lang = await page.getAttribute("html", "lang");
    expect(lang).toBe("pt-BR");
  });
});

// ─── API ───

test.describe("API", () => {
  test("GET /api/auth/me returns 401 when not logged in", async ({ request }) => {
    const res = await request.get("/api/auth/me");
    expect(res.status()).toBe(401);
  });

  test("POST /api/auth/login returns cookie on success", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { email: "guga.coder@gmail.com", password: "12345678" },
    });
    expect(res.ok()).toBeTruthy();
    const headers = res.headers();
    expect(headers["set-cookie"]).toContain("keep-blog-token");
    expect(headers["set-cookie"]).toContain("HttpOnly");
  });

  test("GET /api/articles returns public articles", async ({ request }) => {
    const res = await request.get("/api/articles");
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.articles.length).toBeGreaterThan(0);
  });
});
