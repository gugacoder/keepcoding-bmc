"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "auto";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "auto" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("auto");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial = stored && ["light", "dark", "auto"].includes(stored) ? stored : "auto";
    setTheme(initial);
    applyTheme(initial);

    // Listen to system theme changes when in auto mode
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = localStorage.getItem("theme") as Theme | null;
      if (!current || current === "auto") applyTheme("auto");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function cycle() {
    const order: Theme[] = ["auto", "light", "dark"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  if (!mounted) return <div className="w-8 h-8" />;

  const icons: Record<Theme, typeof Sun> = {
    light: Sun,
    dark: Moon,
    auto: Monitor,
  };
  const labels: Record<Theme, string> = {
    light: "Tema claro",
    dark: "Tema escuro",
    auto: "Tema automático",
  };

  const Icon = icons[theme];

  return (
    <button
      onClick={cycle}
      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      title={labels[theme]}
      aria-label={labels[theme]}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
