import { Link } from "@tanstack/react-router";
import { Clock, Star } from "lucide-react";
import { totalTime, type Recipe } from "@/data/recipes";

export function DifficultyBadge({ level }: { level: Recipe["difficulty"] }) {
  const tone =
    level === "Easy"
      ? "bg-accent-soft text-accent"
      : level === "Medium"
        ? "bg-primary-soft text-primary"
        : "bg-ink text-ink-foreground";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{level}</span>
  );
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      to="/recipes/$slug"
      params={{ slug: recipe.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          loading="lazy"
          width={1200}
          height={900}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <DifficultyBadge level={recipe.difficulty} />
        </div>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          {recipe.rating}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{recipe.category}</p>
        <h3 className="mt-2 font-display text-lg leading-snug">{recipe.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{recipe.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {recipe.tags.map((t) => (
            <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
          <span className="flex min-w-0 items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-foreground">
              {recipe.author.initials}
            </span>
            <span className="truncate text-muted-foreground">{recipe.author.name}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {totalTime(recipe)} min
          </span>
        </div>
      </div>
    </Link>
  );
}
