"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "linton-theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    // Reads the value the pre-hydration inline script (see theme-script.js) already
    // applied to <html> to avoid a flash of the wrong theme. This can only run after
    // mount (no `document` during SSR), and must stay an effect rather than a lazy
    // useState initializer or the server/client render would mismatch on first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.getAttribute("data-theme") || "light");
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage may be unavailable (private mode, blocked cookies); theme still applies for this load.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme: theme ?? "light", toggleTheme }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
