import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { GripVertical, ImagePlus, Plus, Trash2, X, Save, Send, CheckCircle2 } from "lucide-react";
import { categories, units } from "@/data/recipes";

export const Route = createFileRoute("/dashboard/recipes/new")({
  head: () => ({
    meta: [
      { title: "New Recipe — Culinary Blog Studio" },
      {
        name: "description",
        content:
          "Write and publish a recipe: basic details, ingredient list, numbered steps and a cover photo.",
      },
      { property: "og:title", content: "New Recipe — Culinary Blog Studio" },
      { property: "og:description", content: "Write and publish a recipe on Culinary Blog." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewRecipePage,
});

type IngredientRow = { id: number; name: string; quantity: string; unit: string };
type StepRow = { id: number; description: string; duration: string };

let uid = 100;
const nextId = () => ++uid;

function NewRecipePage() {
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { id: 1, name: "", quantity: "", unit: "g" },
    { id: 2, name: "", quantity: "", unit: "ml" },
  ]);
  const [steps, setSteps] = useState<StepRow[]>([{ id: 1, description: "", duration: "" }]);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
  };

  const flash = (msg: string) => {
    setSaved(msg);
    setTimeout(() => setSaved(null), 2600);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Studio</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">Create a recipe</h1>
          <p className="mt-2 text-sm text-muted-foreground">Draft saved automatically every 30 seconds.</p>
        </div>
        <span className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
          Draft
        </span>
      </header>

      {saved && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
          <CheckCircle2 className="h-4 w-4" />
          {saved}
        </div>
      )}

      <form className="mt-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
        <Card title="Basic information" subtitle="What is it, and who is it for?">
          <div className="grid gap-5">
            <Field label="Recipe title">
              <input className="field" placeholder="Charred harissa chicken" />
            </Field>
            <Field label="Description">
              <textarea
                rows={3}
                className="field resize-y"
                placeholder="A short, appetising summary of the dish and why it works."
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category">
                <select className="field" defaultValue="">
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Difficulty">
                <select className="field" defaultValue="Easy">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Prep time (min)">
                <input type="number" min={0} className="field" placeholder="15" />
              </Field>
              <Field label="Cook time (min)">
                <input type="number" min={0} className="field" placeholder="30" />
              </Field>
              <Field label="Servings">
                <input type="number" min={1} className="field" placeholder="4" />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="Cover photo" subtitle="Drag an image in, or browse your files.">
          {preview ? (
            <div className="relative overflow-hidden rounded-2xl border border-border">
              <img src={preview} alt="Recipe cover preview" className="aspect-[16/9] w-full object-cover" />
              <button
                type="button"
                onClick={() => setPreview(null)}
                aria-label="Remove image"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground shadow-card"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => fileRef.current?.click()}
              className={`grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
                dragging ? "border-primary bg-primary-soft" : "border-border bg-surface"
              }`}
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
                <ImagePlus className="h-6 w-6" />
              </span>
              <p className="mt-4 text-sm font-medium">Drop your photo here</p>
              <p className="mt-1 text-xs text-muted-foreground">JPG or PNG, landscape, at least 1200px wide</p>
              <span className="mt-4 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
                Browse files
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          )}
        </Card>

        <Card title="Ingredients" subtitle="Quantities as you'd actually shop for them.">
          <ul className="space-y-3">
            {ingredients.map((ing, i) => (
              <li key={ing.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:grid-cols-[auto_minmax(0,1fr)_90px_120px_auto]">
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  className="field col-span-1 min-w-0"
                  placeholder={i === 0 ? "Chicken thighs, bone-in" : "Ingredient name"}
                  value={ing.name}
                  onChange={(e) =>
                    setIngredients((rows) =>
                      rows.map((r) => (r.id === ing.id ? { ...r, name: e.target.value } : r)),
                    )
                  }
                />
                <input
                  className="field col-start-2 sm:col-start-auto"
                  placeholder="Qty"
                  value={ing.quantity}
                  onChange={(e) =>
                    setIngredients((rows) =>
                      rows.map((r) => (r.id === ing.id ? { ...r, quantity: e.target.value } : r)),
                    )
                  }
                />
                <select
                  className="field col-start-2 sm:col-start-auto"
                  value={ing.unit}
                  onChange={(e) =>
                    setIngredients((rows) =>
                      rows.map((r) => (r.id === ing.id ? { ...r, unit: e.target.value } : r)),
                    )
                  }
                >
                  {units.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
                <button
                  type="button"
                  aria-label="Remove ingredient"
                  onClick={() => setIngredients((rows) => rows.filter((r) => r.id !== ing.id))}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <AddButton
            label="Add ingredient"
            onClick={() =>
              setIngredients((rows) => [...rows, { id: nextId(), name: "", quantity: "", unit: "g" }])
            }
          />
        </Card>

        <Card title="Method" subtitle="One action per step, with a realistic duration.">
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={step.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <input
                    className="field w-32 shrink-0"
                    placeholder="10 min"
                    value={step.duration}
                    onChange={(e) =>
                      setSteps((rows) =>
                        rows.map((r) => (r.id === step.id ? { ...r, duration: e.target.value } : r)),
                      )
                    }
                  />
                  <button
                    type="button"
                    aria-label="Remove step"
                    onClick={() => setSteps((rows) => rows.filter((r) => r.id !== step.id))}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  className="field mt-3 resize-y"
                  placeholder="Describe what the cook should do, and what it should look like when it's right."
                  value={step.description}
                  onChange={(e) =>
                    setSteps((rows) =>
                      rows.map((r) => (r.id === step.id ? { ...r, description: e.target.value } : r)),
                    )
                  }
                />
              </li>
            ))}
          </ol>
          <AddButton
            label="Add step"
            onClick={() => setSteps((rows) => [...rows, { id: nextId(), description: "", duration: "" }])}
          />
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => flash("Draft saved. Only you can see it.")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Save className="h-4 w-4" />
            Save draft
          </button>
          <button
            type="button"
            onClick={() => flash("Published! Your recipe is live on the blog.")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Send className="h-4 w-4" />
            Publish recipe
          </button>
        </div>
      </form>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
      <h2 className="font-display text-xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 inline-flex items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}
