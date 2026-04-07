import Link from "next/link";
import { Breadcrumb } from "@/components/blog/breadcrumb";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Página não encontrada" }]} />

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <FileQuestion className="w-16 h-16 text-muted-foreground/40 mb-6" />
        <h1
          className="text-6xl font-bold text-primary mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          404
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Esta página não foi encontrada.
        </p>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
        </Button>
      </div>
    </div>
  );
}
