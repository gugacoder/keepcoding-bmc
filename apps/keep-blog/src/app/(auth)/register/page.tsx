"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registrar</CardTitle>
          <CardDescription>Crie sua conta no Keep Coding Blog</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-1.5">Nome</label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium block mb-1.5">Email</label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium block mb-1.5">Senha (min. 8 caracteres)</label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link href="/login" className="text-primary hover:underline">Entre</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
