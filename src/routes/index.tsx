import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight, Timer, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-kitchen.jpg";
import { categories, recipes } from "@/data/recipes";
import { RecipeCard } from "@/components/RecipeCard";
import { CategoryIcon } from "@/components/CategoryIcon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Culinary Blog — Tested Recipes & Real Kitchen Technique" },
      {
        name: "description",
        content:
          "Warm, tested recipes with honest timings, ingredient checklists and step-by-step method — from risotto to sourdough.",
      },
      { property: "og:title", content: "Culinary Blog — Tested Recipes & Real Kitchen Technique" },
      {
        property: "og:description",
        content: "Tested recipes with honest timings, ingredient checklists and step-by-step method.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = recipes.slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              New this week: spring produce
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Good food starts with
              <span className="text-primary"> one honest recipe.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Every dish here is cooked, re-cooked and timed in a home kitchen. No mystery steps, no
              inflated timings — just the method that actually works.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              role="search"
              className="mt-8 grid gap-2 rounded-2xl border border-border bg-card p-2 shadow-card sm:grid-cols-[minmax(0,1fr)_auto]"
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  aria-label="Search recipes"
                  placeholder="What are you cooking tonight?"
                  className="field border-transparent bg-transparent py-3 pl-10"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Find recipes
              </button>
            </form>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              <Metric value="331" label="Tested recipes" />
              <Metric value="18" label="Contributing cooks" />
              <Metric value="4.8" label="Average rating" />
            </dl>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Rustic kitchen table with herbs, spices, olive oil and roasted vegetables"
              width={1600}
              height={1100}
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
            />
            <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-card backdrop-blur">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
                <Timer className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Under 30 minutes</p>
                <p className="text-xs text-muted-foreground">72 weeknight recipes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-3xl sm:text-4xl">Popular categories</h2>
            <p className="mt-2 text-muted-foreground">Pick a mood, then pick a dish.</p>
          </div>
          <Link
            to="/categories"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-primary sm:inline-flex"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/recipes"
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <CategoryIcon name={c.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-base">{c.name}</span>
                <span className="block text-xs text-muted-foreground">{c.count} recipes</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-3xl sm:text-4xl">Featured recipes</h2>
            <p className="mt-2 text-muted-foreground">What our editors are cooking this month.</p>
          </div>
          <Link
            to="/recipes"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-primary sm:inline-flex"
          >
            All recipes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-ink px-6 py-12 text-center text-ink-foreground sm:px-12">
          <h2 className="font-display text-3xl">Cook something worth writing down</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed opacity-80">
            Got a recipe your friends keep asking for? Publish it here with proper timings, ingredients
            and photos.
          </p>
          <Link
            to="/dashboard/recipes/new"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Write a recipe
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block font-display text-2xl">{value}</span>
        <span className="block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      </dd>
    </div>
  );
}
