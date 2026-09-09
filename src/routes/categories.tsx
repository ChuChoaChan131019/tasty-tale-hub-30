import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/data/recipes";
import { CategoryIcon } from "@/components/CategoryIcon";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Recipe Categories — Culinary Blog" },
      {
        name: "description",
        content:
          "Breakfast, pasta, grilling, soups, salads, baking, desserts and drinks — browse Culinary Blog by category.",
      },
      { property: "og:title", content: "Recipe Categories — Culinary Blog" },
      {
        property: "og:description",
        content: "Browse Culinary Blog by category: breakfast, pasta, grill, soups, salads, baking and more.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Browse</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Cook by category</h1>
        <p className="mt-4 text-muted-foreground">
          Eight collections, each one built from recipes we cook on repeat rather than the ones that
          photograph best.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/recipes"
            className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <CategoryIcon name={c.icon} className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-display text-xl">{c.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
            <p className="mt-4 text-sm font-semibold text-accent">{c.count} recipes</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
