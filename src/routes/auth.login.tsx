import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChefHat, Mail, Lock } from "lucide-react";
import { useStore } from "@/lib/store";
import { GoogleButton } from "@/components/GoogleButton";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    const r = search["redirect"];
    return typeof r === "string" && r.startsWith("/") ? { redirect: r } : {};
  },
  head: () => ({
    meta: [
      { title: "Sign in — Culinary Blog" },
      { name: "description", content: "Sign in to save recipes, write your own and manage your kitchen notebook." },
      { property: "og:title", content: "Sign in — Culinary Blog" },
      { property: "og:description", content: "Sign in to save and publish recipes on Culinary Blog." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signInAs } = useStore();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("hannah@culinary.blog");
  const [password, setPassword] = useState("cook1234");
  const [error, setError] = useState("");

  const finish = (as: "author" | "admin") => {
    signInAs(as);
    navigate({ to: redirect && redirect.startsWith("/") ? redirect : "/dashboard/recipes" });
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Culinary Blog kitchen.">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.includes("@") || password.length < 6) {
            setError("Enter a valid email and a password of at least 6 characters.");
            return;
          }
          setError("");
          finish(email.trim().toLowerCase() === "ada@culinary.blog" ? "admin" : "author");
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field py-3 pl-10"
              placeholder="you@example.com"
            />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field py-3 pl-10"
              placeholder="••••••••"
            />
          </div>
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Sign in
        </button>
      </form>

      <Divider />
      <GoogleButton label="Sign in with Google" onClick={() => finish("author")} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/auth/register" className="font-semibold text-primary">
          Create an account
        </Link>
      </p>
      <p className="mt-4 rounded-xl bg-surface px-4 py-3 text-xs text-muted-foreground">
        Demo accounts: <strong>hannah@culinary.blog</strong> signs in as an author,{" "}
        <strong>ada@culinary.blog</strong> as an admin. Any password of 6+ characters works.
      </p>
    </AuthShell>
  );
}

export function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      or
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:py-20">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
        <ChefHat className="h-6 w-6" />
      </span>
      <h1 className="mt-6 text-center font-display text-3xl">{title}</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">{children}</div>
    </div>
  );
}
