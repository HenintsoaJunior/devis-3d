"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-card">
      <h1 className="login-title">Connexion</h1>
      <p className="login-subtitle">Accedez a votre espace Admin</p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: "var(--spacing-md)" }}>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
        </div>
        {error && <span className="error-message">{error}</span>}
        <Button type="submit" className="w-full" loading={loading}>
          Se connecter
        </Button>
      </form>
    </div>
  );
}
