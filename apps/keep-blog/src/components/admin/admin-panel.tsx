"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, FolderOpen, FileText, Plus, Trash2, UserCheck, UserX, Shield, ShieldOff, Link2, RefreshCw, Copy } from "lucide-react";

interface AdminPanelProps {
  initialUsers: any[];
  initialGroups: any[];
  initialArticles: any[];
}

export function AdminPanel({ initialUsers, initialGroups, initialArticles }: AdminPanelProps) {
  const [tab, setTab] = useState<"users" | "groups" | "articles">("users");
  const router = useRouter();

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <Button variant={tab === "users" ? "default" : "outline"} size="sm" onClick={() => setTab("users")}>
          <Users className="w-4 h-4 mr-1" /> Usuários
        </Button>
        <Button variant={tab === "groups" ? "default" : "outline"} size="sm" onClick={() => setTab("groups")}>
          <FolderOpen className="w-4 h-4 mr-1" /> Grupos
        </Button>
        <Button variant={tab === "articles" ? "default" : "outline"} size="sm" onClick={() => setTab("articles")}>
          <FileText className="w-4 h-4 mr-1" /> Artigos
        </Button>
      </div>

      {tab === "users" && <UsersTab users={initialUsers} />}
      {tab === "groups" && <GroupsTab groups={initialGroups} users={initialUsers} />}
      {tab === "articles" && <ArticlesTab articles={initialArticles} groups={initialGroups} />}
    </div>
  );
}

function UsersTab({ users }: { users: any[] }) {
  const router = useRouter();

  async function updateUser(userId: number, data: Record<string, any>) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...data }),
    });
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Gerenciar Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border" data-testid={`user-row-${u.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{u.name || u.email}</span>
                  {u.is_root_admin ? (
                    <Badge className="text-[10px]">Admin Raiz</Badge>
                  ) : u.role === "admin" ? (
                    <Badge variant="secondary" className="text-[10px]">Admin</Badge>
                  ) : null}
                  {!u.is_active && <Badge variant="destructive" className="text-[10px]">Inativo</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              </div>
              <div className="flex items-center gap-1.5 ml-2">
                {!u.is_root_admin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateUser(u.id, { role: u.role === "admin" ? "user" : "admin" })}
                    title={u.role === "admin" ? "Remover admin" : "Tornar admin"}
                  >
                    {u.role === "admin" ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateUser(u.id, { is_active: !u.is_active })}
                  title={u.is_active ? "Desativar" : "Ativar"}
                >
                  {u.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function GroupsTab({ groups, users }: { groups: any[]; users: any[] }) {
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const router = useRouter();

  async function createGroup() {
    if (!newGroupName.trim()) return;
    await fetch("/api/admin/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newGroupName, description: newGroupDesc }),
    });
    setNewGroupName("");
    setNewGroupDesc("");
    router.refresh();
  }

  async function deleteGroup(groupId: number) {
    await fetch("/api/admin/groups", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId }),
    });
    router.refresh();
  }

  async function loadMembers(groupId: number) {
    if (expandedGroup === groupId) {
      setExpandedGroup(null);
      return;
    }
    const res = await fetch(`/api/admin/groups/${groupId}/members`);
    const data = await res.json();
    setMembers(data.members);
    setExpandedGroup(groupId);
  }

  async function addMember(groupId: number) {
    if (!selectedUserId) return;
    await fetch(`/api/admin/groups/${groupId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: Number(selectedUserId) }),
    });
    setSelectedUserId("");
    await loadMembers(groupId);
    router.refresh();
  }

  async function removeMember(groupId: number, userId: number) {
    await fetch(`/api/admin/groups/${groupId}/members`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    await loadMembers(groupId);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Gerenciar Grupos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Nome do grupo" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="flex-1" />
          <Input placeholder="Descrição (opcional)" value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} className="flex-1" />
          <Button size="sm" onClick={createGroup}><Plus className="w-4 h-4 mr-1" /> Criar</Button>
        </div>

        <Separator />

        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.id} className="border rounded-lg">
              <div className="flex items-center justify-between p-3">
                <button onClick={() => loadMembers(g.id)} className="flex-1 text-left">
                  <span className="font-medium text-sm">{g.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({g.member_count} membros)</span>
                  {g.description && <p className="text-xs text-muted-foreground">{g.description}</p>}
                </button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteGroup(g.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {expandedGroup === g.id && (
                <div className="border-t p-3 bg-muted/30 space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Selecionar usuário...</option>
                      {users
                        .filter((u) => !members.some((m: any) => m.id === u.id))
                        .map((u) => (
                          <option key={u.id} value={u.id}>{u.name || u.email}</option>
                        ))}
                    </select>
                    <Button size="sm" onClick={() => addMember(g.id)}>Adicionar</Button>
                  </div>
                  {members.length > 0 && (
                    <ul className="space-y-1">
                      {members.map((m: any) => (
                        <li key={m.id} className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-muted">
                          <span>{m.name || m.email}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeMember(g.id, m.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ArticlesTab({ articles, groups }: { articles: any[]; groups: any[] }) {
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("read");
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const router = useRouter();

  async function updateVisibility(articleId: number, visibility: string) {
    await fetch(`/api/admin/articles/${articleId}/permissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility }),
    });
    router.refresh();
  }

  async function loadShareLink(articleId: number) {
    const res = await fetch(`/api/admin/articles/${articleId}/share-token`);
    const data = await res.json();
    if (data.share_token) {
      setShareLink(`${window.location.origin}/articles/${data.slug}?token=${data.share_token}`);
    } else {
      setShareLink(null);
    }
  }

  async function regenerateShareToken(articleId: number) {
    const res = await fetch(`/api/admin/articles/${articleId}/share-token`, { method: "POST" });
    const data = await res.json();
    setShareLink(`${window.location.origin}/articles/${data.slug}?token=${data.share_token}`);
  }

  async function copyShareLink() {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  async function loadPermissions(articleId: number) {
    if (expandedArticle === articleId) {
      setExpandedArticle(null);
      setShareLink(null);
      return;
    }
    const res = await fetch(`/api/admin/articles/${articleId}/permissions`);
    const data = await res.json();
    setPermissions(data.permissions);
    setExpandedArticle(articleId);
    await loadShareLink(articleId);
  }

  async function addPermission(articleId: number) {
    if (!selectedGroupId) return;
    await fetch(`/api/admin/articles/${articleId}/permissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: Number(selectedGroupId), permission: selectedPermission }),
    });
    setSelectedGroupId("");
    await loadPermissions(articleId);
  }

  async function removePermission(articleId: number, groupId: number) {
    await fetch(`/api/admin/articles/${articleId}/permissions`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId }),
    });
    await loadPermissions(articleId);
  }

  const visibilityLabels: Record<string, string> = {
    "owner-only": "Privado",
    "group-permission": "Grupos",
    "public": "Público",
    "authenticated": "Autenticado",
  };

  const visibilityColors: Record<string, "default" | "secondary" | "outline"> = {
    "owner-only": "outline",
    "group-permission": "secondary",
    "public": "default",
    "authenticated": "secondary",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Gerenciar Permissões dos Artigos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {articles.map((a) => (
          <div key={a.id} className="border rounded-lg" data-testid={`article-row-${a.id}`}>
            <div className="flex items-center justify-between p-3">
              <button onClick={() => loadPermissions(a.id)} className="flex-1 text-left min-w-0">
                <span className="font-medium text-sm truncate block">{a.title}</span>
                <span className="text-xs text-muted-foreground">por {a.author_name}</span>
              </button>
              <div className="flex items-center gap-2 ml-2">
                <select
                  value={a.visibility}
                  onChange={(e) => updateVisibility(a.id, e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                >
                  <option value="owner-only">Privado</option>
                  <option value="group-permission">Grupos</option>
                  <option value="authenticated">Autenticado</option>
                  <option value="public">Público</option>
                </select>
                <Badge variant={visibilityColors[a.visibility]} className="text-[10px] shrink-0">
                  {visibilityLabels[a.visibility]}
                </Badge>
              </div>
            </div>
            {expandedArticle === a.id && (
              <div className="border-t p-3 bg-muted/30 space-y-3">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Link2 className="w-3 h-3" /> Link de compartilhamento
                  </p>
                  {shareLink ? (
                    <div className="flex gap-2 items-center">
                      <Input value={shareLink} readOnly className="flex-1 text-xs h-8" />
                      <Button size="sm" variant="outline" className="h-8" onClick={copyShareLink}>
                        <Copy className="w-3 h-3 mr-1" /> {copiedLink ? "Copiado!" : "Copiar"}
                      </Button>
                      <Button size="sm" variant="outline" className="h-8" onClick={() => regenerateShareToken(a.id)} title="Gerar novo link (invalida o anterior)">
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => regenerateShareToken(a.id)}>
                      <Link2 className="w-3 h-3 mr-1" /> Gerar link
                    </Button>
                  )}
                  <Separator />
                </div>
                <p className="text-xs text-muted-foreground">Permissões de grupo (relevante quando visibilidade = Grupos)</p>
                <div className="flex gap-2">
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Selecionar grupo...</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                  <select
                    value={selectedPermission}
                    onChange={(e) => setSelectedPermission(e.target.value)}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="read">Leitura</option>
                    <option value="write">Escrita</option>
                  </select>
                  <Button size="sm" onClick={() => addPermission(a.id)}>Adicionar</Button>
                </div>
                {permissions.length > 0 && (
                  <ul className="space-y-1">
                    {permissions.map((p: any) => (
                      <li key={p.group_id} className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-muted">
                        <span>{p.group_name} <Badge variant="outline" className="text-[10px] ml-1">{p.permission === "write" ? "Escrita" : "Leitura"}</Badge></span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removePermission(a.id, p.group_id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
