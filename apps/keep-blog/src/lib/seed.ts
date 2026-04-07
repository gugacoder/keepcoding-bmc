import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, "db-keep-blog.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    is_root_admin INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS group_members (
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'markdown' CHECK(content_type IN ('markdown', 'svg')),
    tags TEXT NOT NULL DEFAULT '[]',
    owner_id INTEGER NOT NULL REFERENCES users(id),
    visibility TEXT NOT NULL DEFAULT 'owner-only' CHECK(visibility IN ('owner-only', 'group-permission', 'public')),
    published_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS article_group_permissions (
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    permission TEXT NOT NULL DEFAULT 'read' CHECK(permission IN ('read', 'write')),
    PRIMARY KEY (article_id, group_id)
  );
`);

// Seed root admin from ADMIN_USER_SEED
const seed = process.env.ADMIN_USER_SEED || "admin@gmail.com:12345678";
const [adminEmail, adminPass] = seed.split(":");
const adminHash = bcrypt.hashSync(adminPass, 10);

const existingAdmin = db.prepare("SELECT id FROM users WHERE email = ?").get(adminEmail);
if (!existingAdmin) {
  db.prepare(
    "INSERT INTO users (email, password_hash, name, role, is_root_admin) VALUES (?, ?, 'Admin', 'admin', 1)"
  ).run(adminEmail, adminHash);
  console.log(`Root admin created: ${adminEmail}`);
}

// Seed article owner
const ownerEmail = "guga.coder@gmail.com";
let owner = db.prepare("SELECT id FROM users WHERE email = ?").get(ownerEmail) as any;
if (!owner) {
  const ownerHash = bcrypt.hashSync("12345678", 10);
  const result = db.prepare(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, 'Guga', 'user')"
  ).run(ownerEmail, ownerHash);
  owner = { id: result.lastInsertRowid };
  console.log(`Article owner created: ${ownerEmail}`);
}

// Load article content from parent directory
const CONTENT_DIR = path.resolve(process.cwd(), "../..");

function loadContent(filename: string): string {
  const filepath = path.join(CONTENT_DIR, filename);
  if (fs.existsSync(filepath)) {
    return fs.readFileSync(filepath, "utf-8");
  }
  console.warn(`File not found: ${filepath}`);
  return `# ${filename}\n\nConteúdo não encontrado.`;
}

const articles = [
  {
    slug: "one-pager-keep-coding",
    title: "One-Pager - Keep Coding",
    content: loadContent("One-Pager - Keep Coding.md"),
    content_type: "markdown",
    tags: ["estratégia", "resumo-executivo", "keep-coding"],
    published_at: "2026-04-06T10:00:00Z",
  },
  {
    slug: "hipoteses-keep-coding",
    title: "Hipóteses - Keep Coding",
    content: loadContent("Hipoteses - Keep Coding.md"),
    content_type: "markdown",
    tags: ["hipóteses", "validação", "keep-coding"],
    published_at: "2026-04-06T11:00:00Z",
  },
  {
    slug: "business-model-canvas-keep-coding",
    title: "Business Model Canvas - Keep Coding",
    content: loadContent("Business Model Canvas - Keep Coding.svg"),
    content_type: "svg",
    tags: ["BMC", "canvas", "keep-coding"],
    published_at: "2026-04-06T12:00:00Z",
  },
];

const insertArticle = db.prepare(`
  INSERT OR IGNORE INTO articles (slug, title, content, content_type, tags, owner_id, visibility, published_at)
  VALUES (?, ?, ?, ?, ?, ?, 'public', ?)
`);

for (const a of articles) {
  const existing = db.prepare("SELECT id FROM articles WHERE slug = ?").get(a.slug);
  if (!existing) {
    insertArticle.run(a.slug, a.title, a.content, a.content_type, JSON.stringify(a.tags), owner.id, a.published_at);
    console.log(`Article seeded: ${a.title}`);
  } else {
    console.log(`Article already exists: ${a.title}`);
  }
}

console.log("\nSeed complete!");
db.close();
