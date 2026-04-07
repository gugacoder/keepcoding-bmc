"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, LogOut, Settings } from "lucide-react";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

function getInitials(name: string, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false);
    router.refresh();
  }

  const initials = getInitials(user.name, user.email);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-sidebar"
        aria-label="Menu do usuário"
        title={user.name || user.email}
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold select-none">
          {initials}
        </div>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-56 rounded-md border border-border bg-popover text-popover-foreground shadow-lg z-50">
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-sm font-medium truncate">{user.name || user.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            {user.role === "admin" && (
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary mt-1">
                Admin
              </span>
            )}
          </div>
          <div className="py-1">
            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <Shield className="w-4 h-4" />
                Painel Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors w-full text-left text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
