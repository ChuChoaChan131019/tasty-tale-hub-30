import { Link } from "@tanstack/react-router";
import { ChefHat, Search, Menu, X, PenLine, User, BookMarked, LogOut } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/recipes", label: "Recipes" },
  { to: "/categories", label: "Categories" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

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
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative hidden md:block"
            role="search"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
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
              className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
            >
              HF
            </button>
            {menu && (
              <div
                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lift"
                onMouseLeave={() => setMenu(false)}
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">Hannah Fields</p>
                  <p className="text-xs text-muted-foreground">hannah@culinary.blog</p>
                </div>
                <div className="my-1 h-px bg-border" />
                <MenuItem icon={<User className="h-4 w-4" />} label="Your profile" />
                <MenuItem icon={<BookMarked className="h-4 w-4" />} label="Saved recipes" />
                <MenuItem icon={<LogOut className="h-4 w-4" />} label="Sign out" />
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
          <div className="relative mb-3 md:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="search" placeholder="Search recipes…" aria-label="Search recipes" className="field pl-9" />
          </div>
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

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {icon}
      {label}
    </button>
  );
}
