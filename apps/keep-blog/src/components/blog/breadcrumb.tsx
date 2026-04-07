import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground" itemScope itemType="https://schema.org/BreadcrumbList">
          <li className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" className="hover:text-foreground flex items-center gap-1" itemProp="item">
              <Home className="w-3.5 h-3.5" />
              <span itemProp="name">Início</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <ChevronRight className="w-3.5 h-3.5" />
              {item.href ? (
                <Link href={item.href} className="hover:text-foreground" itemProp="item">
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span className="text-foreground font-medium" itemProp="name">{item.label}</span>
              )}
              <meta itemProp="position" content={String(i + 2)} />
            </li>
          ))}
        </ol>
      </nav>
      <ThemeToggle />
    </div>
  );
}
