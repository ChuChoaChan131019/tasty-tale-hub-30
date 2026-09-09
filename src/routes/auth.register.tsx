import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { GoogleButton } from "@/components/GoogleButton";
import { AuthShell, Divider } from "./auth.login";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Create your account — Culinary Blog" },
      { name: "description", content: "Create a Culinary Blog account to write, publish and manage your own recipes." },
      { property: "og:title", content: "Create your account — Culinary Blog" },
      { property: "og:description", content: "Join Culinary Blog and publish your own tested recipes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signInAs, updateProfile } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <AuthShell title="Join the kitchen" subtitle="Write recipes, keep drafts, publish when they're ready.">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim().length < 2 || !email.includes("@") || password.length < 6) {
            setError("Add your name, a valid email and a password of at least 6 characters.");
            return;
          }
          setError("");
          signInAs("author");
          updateProfile({ name: name.trim() });
          navigate({ to: "/profile" });
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Full name</span>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={name} onChange={(e) => setName(e.target.value)} className="field py-3 pl-10" placeholder="Hannah Fields" />
          </div>
        </label>
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
              placeholder="At least 6 characters"
            />
          </div>
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Create account
        </button>
      </form>

      <Divider />
      <GoogleButton
        label="Sign up with Google"
        onClick={() => {
          signInAs("author");
          navigate({ to: "/profile" });
        }}
      />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already cooking with us?{" "}
        <Link to="/auth/login" className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
