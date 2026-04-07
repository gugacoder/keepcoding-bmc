"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-foreground antialiased flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center text-center px-6">
          <AlertTriangle className="w-16 h-16 text-destructive/60 mb-6" />
          <h1 className="text-4xl font-bold mb-2">Erro crítico</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Algo deu muito errado. Tente recarregar a página.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Recarregar
          </button>
        </div>
      </body>
    </html>
  );
}
