import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search as SearchIcon, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { totalTime, type Difficulty } from "@/data/recipes";
import { RecipeCard } from "@/components/RecipeCard";
import { useStore } from "@/lib/store";

type SearchParams = {
  q?: string;
  category?: string;
  difficulty?: string;
  maxTime?: number;
  sort?: string;
  page?: number;
};

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: str(search["q"]),
    category: str(search["category"]),
    difficulty: str(search["difficulty"]),
    maxTime: num(search["maxTime"]),
    sort: str(search["sort"]),
    page: num(search["page"]),
  }),
  head: () => ({
    meta: [
      { title: "Search recipes — Culinary Blog" },
      {
        name: "description",
        content:
          "Search every Culinary Blog recipe by keyword, then filter by category, difficulty and maximum cook time.",
      },
      { property: "og:title", content: "Search recipes — Culinary Blog" },
      { property: "og:description", content: "Keyword search with category, difficulty and time filters." },
    ],
  }),
  component: SearchPage,
});

const PER_PAGE = 6;
const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];
const sorts = [
  { value: "relevance", label: "Most relevant" },
  { value: "newest", label: "Recently updated" },
  { value: "time-asc", label: "Quickest first" },
  { value: "rating-desc", label: "Highest rated" },
];

function SearchPage() {
  const params = Route.useSearch();
  const navigate = useNavigate();
  const { published, categories } = useStore();
  const [term, setTerm] = useState(params.q ?? "");

  useEffect(() => setTerm(params.q ?? ""), [params.q]);

  const page = params.page ?? 1;
  const sort = params.sort ?? "relevance";

  const update = (patch: Partial<SearchParams>) =>
    navigate({ to: "/search", search: (prev) => ({ ...prev, page: undefined, ...patch }) });

  const results = useMemo(() => {
    const q = (params.q ?? "").toLowerCase().trim();
    let list = published.filter((r) => {
      const haystack = `${r.title} ${r.description} ${r.category} ${r.tags.join(" ")} ${r.author.name}`.toLowerCase();
      if (q && !q.split(/\s+/).every((w) => haystack.includes(w))) return false;
      if (params.category && r.category !== params.category) return false;
      if (params.difficulty && r.difficulty !== params.difficulty) return false;
      if (params.maxTime && totalTime(r) > params.maxTime) return false;
      return true;
    });

    list = [...list];
    if (sort === "time-asc") list.sort((a, b) => totalTime(a) - totalTime(b));
    if (sort === "rating-desc") list.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return list;
  }, [published, params.q, params.category, params.difficulty, params.maxTime, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(Math.max(1, page), pages);
  const slice = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const activeFilters = [params.category, params.difficulty, params.maxTime].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Search</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Find your next dinner</h1>
        <p className="mt-4 text-muted-foreground">
          Search across titles, tags, categories and authors, then narrow it down by difficulty and time.
        </p>
      </header>

      <form
        className="relative mt-8"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: term || undefined });
        }}
      >
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Try “sourdough”, “soup” or “Hannah”"
          aria-label="Search recipes"
          className="field py-3.5 pl-11 pr-28"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
        >
          Search
        </button>
      </form>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Filters
            </h2>
            {activeFilters > 0 && (
              <button
                type="button"
                onClick={() =>
                  update({ category: undefined, difficulty: undefined, maxTime: undefined })
                }
                className="text-xs font-semibold text-primary"
              >
                Clear
              </button>
            )}
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Category</span>
            <select
              className="field"
              value={params.category ?? ""}
              onChange={(e) => update({ category: e.target.value || undefined })}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-1.5 block text-sm font-medium">Difficulty</span>
            <div className="flex flex-wrap gap-2">
              {["All", ...difficulties].map((d) => {
                const active = d === "All" ? !params.difficulty : params.difficulty === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => update({ difficulty: d === "All" ? undefined : d })}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-sm font-medium">
              Max total time
              <span className="text-muted-foreground">{params.maxTime ?? 180} min</span>
            </span>
            <input
              type="range"
              min={10}
              max={180}
              step={10}
              value={params.maxTime ?? 180}
              onChange={(e) => {
                const v = Number(e.target.value);
                update({ maxTime: v >= 180 ? undefined : v });
              }}
              className="w-full accent-[var(--primary)]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Sort by</span>
            <select className="field" value={sort} onChange={(e) => update({ sort: e.target.value })}>
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </aside>

        <section>
          <p className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "recipe" : "recipes"}
            {params.q ? ` for “${params.q}”` : ""}
          </p>

          <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {slice.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>

          {results.length === 0 && (
            <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
              <p className="font-display text-xl">Nothing matched that</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try fewer words, or loosen the filters on the left.
              </p>
            </div>
          )}

          {pages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
              <button
                type="button"
                disabled={current === 1}
                onClick={() => navigate({ to: "/search", search: (p) => ({ ...p, page: current - 1 }) })}
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => navigate({ to: "/search", search: (prev) => ({ ...prev, page: p }) })}
                  aria-current={p === current ? "page" : undefined}
                  className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition-colors ${
                    p === current
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={current === pages}
                onClick={() => navigate({ to: "/search", search: (p) => ({ ...p, page: current + 1 }) })}
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
