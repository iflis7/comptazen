"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const t = useTranslations("Nav");
  const { resolvedTheme, setTheme } = useTheme();
  // Client-mount check without an effect+setState (avoids the extra render
  // pass): true only once we're actually running on the client, so the
  // server-rendered markup and the first client render match, and we only
  // read next-themes' resolvedTheme once it's had a chance to settle.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    // Reserve the same footprint to avoid layout shift while next-themes
    // resolves the persisted theme on the client.
    return <div className="h-8 w-8 shrink-0" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--color-border)] text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
