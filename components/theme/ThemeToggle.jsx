"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ dict }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={isDark ? dict.theme.light : dict.theme.dark}
      title={isDark ? dict.theme.light : dict.theme.dark}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-toggle-icon theme-toggle-icon-sun">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.4M12 19.1v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-toggle-icon theme-toggle-icon-moon">
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
