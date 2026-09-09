import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { recipes, type Difficulty } from "@/data/recipes";
import { RecipeCard } from "@/components/RecipeCard";

export const Route = createFileRoute("/recipes/")({
  head: () => ({
    meta: [
      { title: "All Recipes — Culinary Blog" },
      {
        name: "description",
        content:
          "Browse every tested recipe on Culinary Blog: risotto, roast chicken, sourdough, brownies and more, with real timings.",
      },
      { property: "og:title", content: "All Recipes — Culinary Blog" },
      {
        property: "og:description",
        content: "Browse every tested recipe with honest timings, ingredient lists and step-by-step method.",
      },
    ],
  }),
  component: RecipesPage,
});

const filters: (Difficulty | "All")[] = ["All", "Easy", "Medium", "Hard"];

function RecipesPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<Difficulty | "All">("All");

  const results = useMemo(
    () =>
      recipes.filter((r) => {
        const matchesQuery =
          !query ||
          `${r.title} ${r.category} ${r.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
        return matchesQuery && (level === "All" || r.difficulty === level);
      }),
    [query, level],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">The archive</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Every recipe, tested twice</h1>
        <p className="mt-4 text-muted-foreground">
          Filter by difficulty or search for the thing you're craving. Timings are what they actually
          took in our kitchen.
        </p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by dish, tag or cuisine…"
            aria-label="Search recipes"
            className="field py-3 pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setLevel(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                level === f
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{results.length} recipes</p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </div>

      {results.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">
          Nothing matched that. Try a broader search.
        </p>
      )}
    </div>
  );
}
