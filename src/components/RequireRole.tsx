import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { useStore, type Role } from "@/lib/store";

export function RequireRole({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { role } = useStore();
  const navigate = useNavigate();
  const permitted = allow.includes(role);

  useEffect(() => {
    if (role === "guest" && !permitted) {
      navigate({ to: "/auth/login", search: { redirect: window.location.pathname } });
    }
  }, [role, permitted, navigate]);

  if (permitted) return <>{children}</>;

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
        <Lock className="h-6 w-6" />
      </span>
      <h1 className="mt-5 font-display text-2xl">
        {role === "guest" ? "Please sign in" : "Not available on your account"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {role === "guest"
          ? "Taking you to the sign-in page…"
          : "This area is for editors only. Switch roles from the profile menu to preview it."}
      </p>
      <Link
        to="/recipes"
        className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        Browse recipes
      </Link>
    </div>
  );
}
