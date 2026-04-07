"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-1"
    >
      <LogOut className="w-3 h-3" /> Sair
    </button>
  );
}
