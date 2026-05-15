"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError("Mot de passe invalide");
      return;
    }

    router.push(nextPath || "/admin");
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4 rounded-lg border border-neutral-200 p-6">
      <h1 className="text-xl font-semibold">Connexion admin</h1>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">Mot de passe</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full">Se connecter</Button>
    </form>
  );
}
