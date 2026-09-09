import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Flame, Users, ArrowLeft, Printer, Bookmark, Star } from "lucide-react";
import { getRecipe, recipes, totalTime } from "@/data/recipes";
import { DifficultyBadge, RecipeCard } from "@/components/RecipeCard";

export const Route = createFileRoute("/recipes/$slug")({
  loader: ({ params }) => {
    const recipe = getRecipe(params.slug);
    if (!recipe) throw notFound();
    return { recipe };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Recipe unavailable — Culinary Blog" }, { name: "robots", content: "noindex" }],
      };
    }
    const { recipe } = loaderData;
    return {
      meta: [
        { title: `${recipe.title} — Culinary Blog` },
        { name: "description", content: recipe.description },
        { property: "og:title", content: `${recipe.title} — Culinary Blog` },
        { property: "og:description", content: recipe.description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: RecipeNotFound,
  component: RecipeDetail,
});

function RecipeNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl">We couldn't find that recipe</h1>
      <p className="mt-3 text-muted-foreground">It may have been renamed or retired from the archive.</p>
      <Link
        to="/recipes"
        className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
      >
        Browse all recipes
      </Link>
    </div>
  );
}

function RecipeDetail() {
  const { recipe } = Route.useLoaderData();
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const done = Object.values(checked).filter(Boolean).length;

  const related = recipes.filter((r) => r.slug !== recipe.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/recipes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All recipes
      </Link>

      <header className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {recipe.category}
          </span>
          <DifficultyBadge level={recipe.difficulty} />
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" />
            {recipe.rating}
          </span>
        </div>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">{recipe.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{recipe.description}</p>
      </header>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {recipe.author.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{recipe.author.name}</p>
            <p className="truncate text-xs text-muted-foreground">{recipe.author.role}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground">
            <Bookmark className="h-4 w-4" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground">
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-border shadow-card">
        <img
          src={recipe.image}
          alt={recipe.title}
          width={1200}
          height={900}
          className="aspect-[16/9] w-full object-cover"
        />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<Clock className="h-4 w-4" />} label="Prep" value={`${recipe.prepTime} min`} />
        <Stat icon={<Flame className="h-4 w-4" />} label="Cook" value={`${recipe.cookTime} min`} />
        <Stat icon={<Clock className="h-4 w-4" />} label="Total" value={`${totalTime(recipe)} min`} />
        <Stat icon={<Users className="h-4 w-4" />} label="Serves" value={`${recipe.servings}`} />
      </dl>

      <div className="mt-12 grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl">Ingredients</h2>
              <span className="text-xs text-muted-foreground">
                {done}/{recipe.ingredients.length}
              </span>
            </div>
            <ul className="mt-4 space-y-1">
              {recipe.ingredients.map((ing, i) => (
                <li key={ing.name}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary">
                    <input
                      type="checkbox"
                      checked={!!checked[i]}
                      onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[oklch(0.6_0.12_158)]"
                    />
                    <span className={`text-sm ${checked[i] ? "text-muted-foreground line-through" : ""}`}>
                      <span className="font-semibold">
                        {ing.quantity} {ing.unit}
                      </span>{" "}
                      {ing.name}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-ink p-6 text-ink-foreground shadow-card">
            <h2 className="font-display text-xl">Nutrition</h2>
            <p className="mt-1 text-xs opacity-70">Per serving, approximate</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Nutrient label="Calories" value={`${recipe.nutrition.calories}`} unit="kcal" />
              <Nutrient label="Protein" value={`${recipe.nutrition.protein}`} unit="g" />
              <Nutrient label="Carbs" value={`${recipe.nutrition.carbs}`} unit="g" />
              <Nutrient label="Fat" value={`${recipe.nutrition.fat}`} unit="g" />
            </div>
          </section>
        </aside>

        <section>
          <h2 className="font-display text-2xl">Method</h2>
          <ol className="mt-6 space-y-5">
            {recipe.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-display text-lg">{step.title}</h3>
                    <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
                      <Clock className="h-3 w-3" />
                      {step.duration}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap gap-2">
            {recipe.tags.map((t) => (
              <span key={t} className="rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
                #{t}
              </span>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-20">
        <h2 className="font-display text-2xl">Cook this next</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </div>
      </section>
    </article>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 font-display text-lg">{value}</dd>
    </div>
  );
}

function Nutrient({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-xl bg-[oklch(1_0_0/0.08)] px-4 py-3">
      <p className="text-xs opacity-70">{label}</p>
      <p className="mt-0.5 font-display text-2xl">
        {value}
        <span className="ml-1 text-sm opacity-70">{unit}</span>
      </p>
    </div>
  );
}
