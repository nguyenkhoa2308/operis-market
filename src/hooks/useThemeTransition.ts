"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";

export function useThemeTransition() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(
    (event?: React.MouseEvent) => {
      const x = event?.clientX ?? window.innerWidth / 2;
      const y = event?.clientY ?? window.innerHeight / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      if (!document.startViewTransition) {
        setTheme(theme === "dark" ? "light" : "dark");
        return;
      }

      const transition = document.startViewTransition(() => {
        setTheme(theme === "dark" ? "light" : "dark");
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 350,
            easing: "ease-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    },
    [theme, setTheme],
  );

  return { theme, toggleTheme };
}
