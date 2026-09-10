import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Archive, Trash2, PenLine, Plus, CheckCircle2 } from "lucide-react";
import { useStore, type RecipeStatus } from "@/lib/store";
import { RequireRole } from "@/components/RequireRole";
import { totalTime } from "@/data/recipes";

export const Route = createFileRoute("/dashboard/recipes/")({
  head: () => ({
    meta: [
      { title: "Your recipes — Culinary Blog Studio" },
      { name: "description", content: "Manage your recipes: publish, unpublish, archive or delete them." },
      { property: "og:title", content: "Your recipes — Culinary Blog Studio" },
      { property: "og:description", content: "Manage the recipes you've written on Culinary Blog." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireRole allow={["author", "admin"]}>
      <DashboardRecipes />
    </RequireRole>
  ),
});

const statusTone: Record<RecipeStatus, string> = {
  published: "bg-accent-soft text-accent",
  draft: "bg-primary-soft text-primary",
  archived: "bg-secondary text-secondary-foreground",
};

const tabs: ("all" | RecipeStatus)[] = ["all", "published", "draft", "archived"];

function DashboardRecipes() {
  const { recipes, profile, role, setStatus, deleteRecipe } = useStore();
  const [tab, setTab] = useState<"all" | RecipeStatus>("all");
  const [flash, setFlash] = useState("");

  const say = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2400);
  };

  const mine = role === "admin" ? recipes : recipes.filter((r) => r.authorEmail === profile?.email);
  const list = tab === "all" ? mine : mine.filter((r) => r.status === tab);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Studio</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">Your recipes</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {role === "admin" ? "Every recipe on the blog." : "Everything you've written, in every state."}
          </p>
        </div>
        <Link
          to="/dashboard/recipes/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New recipe
        </Link>
      </header>

      {flash && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
          <CheckCircle2 className="h-4 w-4" />
          {flash}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t} ({t === "all" ? mine.length : mine.filter((r) => r.status === t).length})
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {list.map((r) => (
          <article
            key={r.slug}
            className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-card sm:grid-cols-[112px_minmax(0,1fr)] sm:p-5"
          >
            <img
              src={r.image}
              alt={r.title}
              loading="lazy"
              className="h-28 w-full rounded-xl object-cover sm:h-full"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusTone[r.status]}`}>
                  {r.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  {r.category} · {totalTime(r)} min · updated {r.updatedAt}
                </span>
              </div>
              <h2 className="mt-2 font-display text-xl leading-snug">{r.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {r.status === "published" ? (
                  <Action
                    icon={<EyeOff className="h-4 w-4" />}
                    label="Unpublish"
                    onClick={() => {
                      setStatus(r.slug, "draft");
                      say(`“${r.title}” moved back to drafts.`);
                    }}
                  />
                ) : (
                  <Action
                    icon={<Eye className="h-4 w-4" />}
                    label="Publish"
                    primary
                    onClick={() => {
                      setStatus(r.slug, "published");
                      say(`“${r.title}” is live.`);
                    }}
                  />
                )}
                {r.status !== "archived" && (
                  <Action
                    icon={<Archive className="h-4 w-4" />}
                    label="Archive"
                    onClick={() => {
                      setStatus(r.slug, "archived");
                      say(`“${r.title}” archived.`);
                    }}
                  />
                )}
                <Link
                  to="/recipes/$slug"
                  params={{ slug: r.slug }}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  <PenLine className="h-4 w-4" />
                  View
                </Link>
                <Action
                  icon={<Trash2 className="h-4 w-4" />}
                  label="Delete"
                  danger
                  onClick={() => {
                    if (confirm(`Delete “${r.title}”? This can't be undone.`)) {
                      deleteRecipe(r.slug);
                      say(`“${r.title}” deleted.`);
                    }
                  }}
                />
              </div>
            </div>
          </article>
        ))}

        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
            <p className="font-display text-xl">Nothing here yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Start a new recipe and it will show up in this list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Action({
  icon,
  label,
  onClick,
  primary,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
}) {
  const tone = primary
    ? "bg-primary text-primary-foreground"
    : danger
      ? "border border-border bg-card text-destructive hover:bg-destructive/10"
      : "border border-border bg-card hover:bg-secondary";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${tone}`}
    >
      {icon}
      {label}
    </button>
  );
}
