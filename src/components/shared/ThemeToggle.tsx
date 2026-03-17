"use client";

import { SunIcon, MoonIcon } from "lucide-react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useThemeTransition } from "@/hooks/useThemeTransition";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeTransition();
  const mounted = useIsMounted();

  if (!mounted) return <div className="size-9" />;

  return (
    <button
      type="button"
      title="Toggle theme"
      onClick={toggleTheme}
      className="cursor-pointer rounded-full p-2 text-foreground-muted transition-colors hover:bg-accent hover:text-foreground"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
