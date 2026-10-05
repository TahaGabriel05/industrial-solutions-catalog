import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Espace administrateur | Atlas Industrial Supply" },
    { name: "description", content: "Connexion à l'espace d'administration du catalogue Atlas." },
    { property: "og:title", content: "Espace administrateur | Atlas" },
    { property: "og:description", content: "Connexion administrateur du catalogue." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const { language } = useLocale(); const fr = language === "fr";
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMsg("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")); const password = String(form.get("password"));
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(fr ? "Email ou mot de passe incorrect." : "Wrong email or password."); else navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth` } });
      setMsg(error ? error.message : fr ? "Compte créé. Confirmez votre email puis connectez-vous." : "Account created. Confirm your email, then sign in.");
    }
    setBusy(false);
  };
  return <div className="mx-auto max-w-md px-4 py-16"><div className="border border-border bg-card p-8"><Lock className="size-6 text-accent" /><h1 className="mt-3 font-display text-2xl font-bold">{fr ? "Espace administrateur" : "Admin area"}</h1>
    <form onSubmit={submit} className="mt-6 space-y-4"><div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required autoComplete="email" /></div><div><Label htmlFor="password">{fr ? "Mot de passe" : "Password"}</Label><Input id="password" name="password" type="password" minLength={8} required autoComplete={mode === "in" ? "current-password" : "new-password"} /></div>
      <Button type="submit" className="w-full" disabled={busy}>{mode === "in" ? (fr ? "Se connecter" : "Sign in") : (fr ? "Créer le compte" : "Create account")}</Button></form>
    {msg && <p role="status" className="mt-4 text-sm text-muted-foreground">{msg}</p>}
    <Button variant="link" className="mt-2 px-0" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? (fr ? "Créer un compte" : "Create an account") : (fr ? "J'ai déjà un compte" : "I already have an account")}</Button></div></div>;
}
