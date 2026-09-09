import { Link } from "@tanstack/react-router";
import { ChefHat, Instagram, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ChefHat className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold">Culinary Blog</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Tested recipes, honest timings and the technique behind them — written by cooks who make
            them on repeat.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Youtube, Mail].map((Icon, i) => (
              <span
                key={i}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <FooterCol
          title="Explore"
          items={[
            { label: "All recipes", to: "/recipes" },
            { label: "Categories", to: "/categories" },
            { label: "Write a recipe", to: "/dashboard/recipes/new" },
          ]}
        />
        <FooterCol
          title="Kitchen"
          items={[
            { label: "Weeknight dinners", to: "/recipes" },
            { label: "Baking basics", to: "/recipes" },
            { label: "Meatless Monday", to: "/recipes" },
          ]}
        />
        <FooterCol
          title="About"
          items={[
            { label: "Our testing method", to: "/" },
            { label: "Contributors", to: "/" },
            { label: "Contact", to: "/" },
          ]}
        />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Culinary Blog. All rights reserved.</p>
          <p>Made in a very small kitchen.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; to: string }[];
}) {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
