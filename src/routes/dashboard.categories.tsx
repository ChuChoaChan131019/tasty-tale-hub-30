import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import { slugify, useStore } from "@/lib/store";
import { RequireRole } from "@/components/RequireRole";
import { CategoryIcon } from "@/components/CategoryIcon";

export const Route = createFileRoute("/dashboard/categories")({
  head: () => ({
    meta: [
      { title: "Category management — Culinary Blog Admin" },
      { name: "description", content: "Admin tools to create, rename and remove Culinary Blog categories." },
      { property: "og:title", content: "Category management — Culinary Blog Admin" },
      { property: "og:description", content: "Create, rename and remove recipe categories." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireRole allow={["admin"]}>
      <CategoriesAdmin />
    </RequireRole>
  ),
});

const icons = ["EggFried", "Wheat", "Flame", "Soup", "Salad", "Croissant", "CakeSlice", "CupSoda"];

function CategoriesAdmin() {
  const { categories, addCategory, updateCategory, deleteCategory, recipeCountFor } = useStore();
  const [name, setName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [icon, setIcon] = useState(icons[0]!);
  const [flash, setFlash] = useState("");
  const [error, setError] = useState("");

  const say = (msg: string) => {
    setFlash(msg);
    setError("");
    setTimeout(() => setFlash(""), 2600);
  };

  const slug = slugify(name);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Admin</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Category management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create, rename and retire the collections recipes are filed under.
        </p>
      </header>

      {flash && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
          <CheckCircle2 className="h-4 w-4" />
          {flash}
        </div>
      )}
      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      <form
        className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim().length < 2) {
            setError("Give the category a name of at least two characters.");
            return;
          }
          if (categories.some((c) => c.slug === slug)) {
            setError("A category with that web address already exists.");
            return;
          }
          addCategory({ name: name.trim(), slug, icon, blurb: blurb.trim() || "Freshly added collection" });
          say(`“${name.trim()}” added.`);
          setName("");
          setBlurb("");
        }}
      >
        <h2 className="font-display text-xl">New category</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Name</span>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Slow cooking" />
            <span className="mt-1.5 block text-xs text-muted-foreground">
              Web address: /{slug || "auto-generated"}
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Icon</span>
            <select className="field" value={icon} onChange={(e) => setIcon(e.target.value)}>
              {icons.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium">Short blurb</span>
            <input className="field" value={blurb} onChange={(e) => setBlurb(e.target.value)} placeholder="Low and slow, all day" />
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add category
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {categories.map((c) => (
          <CategoryRow
            key={c.slug}
            slug={c.slug}
            name={c.name}
            blurb={c.blurb}
            icon={c.icon}
            inUse={recipeCountFor(c.name)}
            onSave={(patch) => {
              updateCategory(c.slug, patch);
              say(`“${patch.name ?? c.name}” updated.`);
            }}
            onDelete={() => {
              const used = recipeCountFor(c.name);
              if (used > 0) {
                setError(`“${c.name}” still has ${used} published ${used === 1 ? "recipe" : "recipes"}. Move them first.`);
                setFlash("");
                return;
              }
              deleteCategory(c.slug);
              say(`“${c.name}” removed.`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryRow({
  slug,
  name,
  blurb,
  icon,
  inUse,
  onSave,
  onDelete,
}: {
  slug: string;
  name: string;
  blurb: string;
  icon: string;
  inUse: number;
  onSave: (patch: { name: string; blurb: string; slug: string }) => void;
  onDelete: () => void;
}) {
  const [draftName, setDraftName] = useState(name);
  const [draftBlurb, setDraftBlurb] = useState(blurb);
  const dirty = draftName !== name || draftBlurb !== blurb;

  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
        <CategoryIcon name={icon} className="h-6 w-6" />
      </span>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" value={draftName} onChange={(e) => setDraftName(e.target.value)} aria-label={`${name} name`} />
        <input className="field" value={draftBlurb} onChange={(e) => setDraftBlurb(e.target.value)} aria-label={`${name} blurb`} />
        <p className="text-xs text-muted-foreground sm:col-span-2">
          /{slug} · {inUse} published {inUse === 1 ? "recipe" : "recipes"}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!dirty}
          onClick={() => onSave({ name: draftName.trim() || name, blurb: draftBlurb, slug: slugify(draftName) || slug })}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-40"
        >
          <Save className="h-4 w-4" />
          Save
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${name}`}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
