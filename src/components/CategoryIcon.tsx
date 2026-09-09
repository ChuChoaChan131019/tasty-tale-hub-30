import { CakeSlice, Croissant, CupSoda, EggFried, Flame, Salad, Soup, Utensils, Wheat } from "lucide-react";

const map = { CakeSlice, Croissant, CupSoda, EggFried, Flame, Salad, Soup, Wheat } as const;

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name as keyof typeof map] ?? Utensils;
  return <Icon className={className} />;
}
