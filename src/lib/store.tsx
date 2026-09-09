import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { categories as seedCategories, recipes as seedRecipes, type Recipe } from "@/data/recipes";
import fallbackImage from "@/assets/recipe-risotto.jpg";
import draftImage from "@/assets/recipe-sourdough.jpg";
import archivedImage from "@/assets/recipe-brownies.jpg";

export type Role = "guest" | "author" | "admin";
export type RecipeStatus = "published" | "draft" | "archived";

export type ManagedRecipe = Recipe & {
  status: RecipeStatus;
  authorEmail: string;
  updatedAt: string;
};

export type Category = {
  name: string;
  slug: string;
  icon: string;
  count: number;
  blurb: string;
};

export type Profile = {
  name: string;
  email: string;
  avatar: string;
  role: Role;
  bio: string;
};

export const AUTHOR_EMAIL = "hannah@culinary.blog";
export const ADMIN_EMAIL = "ada@culinary.blog";

const MOCK_PROFILES: Record<Exclude<Role, "guest">, Profile> = {
  author: {
    name: "Hannah Fields",
    email: AUTHOR_EMAIL,
    avatar: "",
    role: "author",
    bio: "Food writer. Cooks a lot of soup.",
  },
  admin: {
    name: "Ada Moreno",
    email: ADMIN_EMAIL,
    avatar: "",
    role: "admin",
    bio: "Editor-in-chief. Keeps the categories tidy.",
  },
};

export const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("") || "GU";

const seed = (): ManagedRecipe[] => [
  ...seedRecipes.map((r) => ({
    ...r,
    status: "published" as RecipeStatus,
    authorEmail: r.author.name === "Hannah Fields" ? AUTHOR_EMAIL : "team@culinary.blog",
    updatedAt: "2026-08-14",
  })),
  {
    ...seedRecipes[3]!,
    slug: "rye-and-honey-loaf",
    title: "Rye & Honey Loaf",
    description: "A softer, sweeter everyday loaf — still testing the hydration.",
    image: draftImage,
    author: { name: "Hannah Fields", role: "Food Writer", initials: "HF" },
    status: "draft",
    authorEmail: AUTHOR_EMAIL,
    updatedAt: "2026-09-02",
  },
  {
    ...seedRecipes[4]!,
    slug: "old-school-flapjacks",
    title: "Old-School Flapjacks",
    description: "Retired from the site — the oat ratio never quite worked.",
    image: archivedImage,
    author: { name: "Hannah Fields", role: "Food Writer", initials: "HF" },
    status: "archived",
    authorEmail: AUTHOR_EMAIL,
    updatedAt: "2026-05-30",
  },
];

type Store = {
  role: Role;
  profile: Profile | null;
  recipes: ManagedRecipe[];
  categories: Category[];
  published: ManagedRecipe[];
  isAuthed: boolean;
  signInAs: (role: Exclude<Role, "guest">) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<Pick<Profile, "name" | "avatar" | "bio">>) => void;
  addRecipe: (r: ManagedRecipe) => void;
  setStatus: (slug: string, status: RecipeStatus) => void;
  deleteRecipe: (slug: string) => void;
  addCategory: (c: Omit<Category, "count">) => void;
  updateCategory: (slug: string, patch: Partial<Category>) => void;
  deleteCategory: (slug: string) => void;
  recipeCountFor: (categoryName: string) => number;
};

const StoreContext = createContext<Store | null>(null);

const STORAGE_KEY = "culinary-blog-mock-state";

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("guest");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recipes, setRecipes] = useState<ManagedRecipe[]>(seed);
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { role?: Role; profile?: Profile | null };
        if (saved.role) setRole(saved.role);
        if (saved.profile) setProfile(saved.profile);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ role, profile }));
    } catch {
      /* ignore */
    }
  }, [role, profile, hydrated]);

  const value = useMemo<Store>(() => {
    const recipeCountFor = (categoryName: string) =>
      recipes.filter((r) => r.category === categoryName && r.status === "published").length;

    return {
      role,
      profile,
      recipes,
      categories,
      published: recipes.filter((r) => r.status === "published"),
      isAuthed: role !== "guest",
      signInAs: (next) => {
        setRole(next);
        setProfile((prev) => (prev && prev.role === next ? prev : MOCK_PROFILES[next]));
      },
      signOut: () => {
        setRole("guest");
        setProfile(null);
      },
      updateProfile: (patch) => setProfile((prev) => (prev ? { ...prev, ...patch } : prev)),
      addRecipe: (r) => setRecipes((prev) => [r, ...prev]),
      setStatus: (slug, status) =>
        setRecipes((prev) => prev.map((r) => (r.slug === slug ? { ...r, status } : r))),
      deleteRecipe: (slug) => setRecipes((prev) => prev.filter((r) => r.slug !== slug)),
      addCategory: (c) => setCategories((prev) => [...prev, { ...c, count: 0 }]),
      updateCategory: (slug, patch) =>
        setCategories((prev) => prev.map((c) => (c.slug === slug ? { ...c, ...patch } : c))),
      deleteCategory: (slug) => setCategories((prev) => prev.filter((c) => c.slug !== slug)),
      recipeCountFor,
    };
  }, [role, profile, recipes, categories]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside AppStoreProvider");
  return ctx;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const defaultRecipeImage = fallbackImage;
