// Inlined into <head> before hydration to avoid a light/dark flash.
// Kept as a plain function source (not JSX) so it can be stringified into a <script> tag.
export function themeInitScript() {
  try {
    var stored = localStorage.getItem("linton-theme");
    var theme =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "light");
  }
}
