import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { initialsOf, useStore } from "@/lib/store";
import { RequireRole } from "@/components/RequireRole";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Culinary Blog" },
      { name: "description", content: "View and update your Culinary Blog display name and avatar." },
      { property: "og:title", content: "Your profile — Culinary Blog" },
      { property: "og:description", content: "Manage your Culinary Blog account details." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireRole allow={["author", "admin"]}>
      <ProfilePage />
    </RequireRole>
  ),
});

function ProfilePage() {
  const { profile, updateProfile, recipes } = useStore();
  const [name, setName] = useState(profile?.name ?? "");
  const [avatar, setAvatar] = useState(profile?.avatar ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(profile?.name ?? "");
    setAvatar(profile?.avatar ?? "");
    setBio(profile?.bio ?? "");
  }, [profile?.email]);

  const mine = recipes.filter((r) => r.authorEmail === profile?.email);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Account</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl">Your profile</h1>

      <div className="mt-8 flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-card">
        {avatar ? (
          <img
            src={avatar}
            alt={`${name} avatar`}
            className="h-20 w-20 rounded-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <span className="grid h-20 w-20 place-items-center rounded-full bg-primary-soft font-display text-xl font-semibold">
            {initialsOf(name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-display text-xl">{name || "Unnamed cook"}</p>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
          <p className="mt-2 inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            {profile?.role}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-display text-2xl">{mine.length}</p>
          <p className="text-xs text-muted-foreground">recipes</p>
        </div>
      </div>

      {saved && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
          <CheckCircle2 className="h-4 w-4" />
          Profile updated.
        </div>
      )}

      <form
        className="mt-6 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          updateProfile({ name: name.trim() || "Unnamed cook", avatar: avatar.trim(), bio });
          setSaved(true);
          setTimeout(() => setSaved(false), 2600);
        }}
      >
        <h2 className="font-display text-xl">Edit details</h2>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Full name</span>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Avatar URL</span>
          <input
            className="field"
            value={avatar}
            placeholder="https://example.com/photo.jpg"
            onChange={(e) => setAvatar(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Short bio</span>
          <textarea rows={3} className="field resize-y" value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
