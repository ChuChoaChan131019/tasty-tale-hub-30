import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChefHat,
  Search,
  Menu,
  X,
  PenLine,
  User,
  BookMarked,
  LogOut,
  LayoutDashboard,
  Tags,
  LogIn,
} from "lucide-react";
import { useState } from "react";
import { initialsOf, useStore, type Role } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/recipes", label: "Recipes" },
  { to: "/categories", label: "Categories" },
] as const;

const roles: Role[] = ["guest", "author", "admin"];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { role, profile, signInAs, signOut } = useStore();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/search", search: { q: query || undefined } });
  };

  const switchRole = (next: Role) => {
    setMenu(false);
    if (next === "guest") signOut();
    else signInAs(next);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:grid-cols-[auto_1fr_auto]">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ChefHat className="h-5 w-5" />
          </span>
          <span className="truncate font-display text-lg font-semibold tracking-tight">Culinary Blog</span>
        </Link>

        <nav className="hidden items-center gap-1 justify-self-center lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-primary-soft text-foreground" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          {role !== "guest" && (
            <Link
              to="/dashboard/recipes"
              activeProps={{ className: "bg-primary-soft text-foreground" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
          {role === "admin" && (
            <Link
              to="/dashboard/categories"
              activeProps={{ className: "bg-primary-soft text-foreground" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Categories admin
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <form onSubmit={submitSearch} className="relative hidden md:block" role="search">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes…"
              aria-label="Search recipes"
              className="field w-52 pl-9 lg:w-64"
            />
          </form>

          <Link
            to="/dashboard/recipes/new"
            className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <PenLine className="h-4 w-4" />
            Write
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              aria-label="User profile menu"
              aria-expanded={menu}
              className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
            >
              {profile?.avatar ? (
                <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
              ) : profile ? (
                initialsOf(profile.name)
              ) : (
                <User className="h-4 w-4" />
              )}
            </button>
            {menu && (
              <div
                className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lift"
                onMouseLeave={() => setMenu(false)}
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{profile?.name ?? "Browsing as guest"}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email ?? "Not signed in"}</p>
                </div>

                <div className="my-1 h-px bg-border" />
                <p className="px-3 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Viewing as
                </p>
                <div className="flex gap-1 p-2">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => switchRole(r)}
                      className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold capitalize transition-colors ${
                        role === r
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="my-1 h-px bg-border" />

                {role === "guest" ? (
                  <Link
                    to="/auth/login"
                    onClick={() => setMenu(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </Link>
                ) : (
                  <>
                    <MenuLink to="/profile" icon={<User className="h-4 w-4" />} label="Your profile" onClick={() => setMenu(false)} />
                    <MenuLink
                      to="/dashboard/recipes"
                      icon={<LayoutDashboard className="h-4 w-4" />}
                      label="Recipe dashboard"
                      onClick={() => setMenu(false)}
                    />
                    {role === "admin" && (
                      <MenuLink
                        to="/dashboard/categories"
                        icon={<Tags className="h-4 w-4" />}
                        label="Manage categories"
                        onClick={() => setMenu(false)}
                      />
                    )}
                    <MenuLink
                      to="/recipes"
                      icon={<BookMarked className="h-4 w-4" />}
                      label="Saved recipes"
                      onClick={() => setMenu(false)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setMenu(false);
                        navigate({ to: "/" });
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="grid h-9 w-9 place-items-center rounded-full border border-border lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-3 lg:hidden">
          <form onSubmit={submitSearch} className="relative mb-3 md:hidden" role="search">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes…"
              aria-label="Search recipes"
              className="field pl-9"
            />
          </form>
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            {role !== "guest" && (
              <Link
                to="/dashboard/recipes"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Dashboard
              </Link>
            )}
            {role === "admin" && (
              <Link
                to="/dashboard/categories"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Categories admin
              </Link>
            )}
            <Link
              to="/dashboard/recipes/new"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-accent"
            >
              Write a recipe
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuLink({
  to,
  icon,
  label,
  onClick,
}: {
  to: "/profile" | "/dashboard/recipes" | "/dashboard/categories" | "/recipes";
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {icon}
      {label}
    </Link>
  );
}
