"use client";

import { Breadcrumb } from "@/components/blog/breadcrumb";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Erro" }]} />

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="w-16 h-16 text-destructive/60 mb-6" />
        <h1
          className="text-4xl font-bold text-foreground mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Algo deu errado
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Ocorreu um erro inesperado. Tente novamente.
        </p>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
