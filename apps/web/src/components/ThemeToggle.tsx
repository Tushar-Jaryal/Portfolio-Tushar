import { useEffect, useState } from "preact/hooks";

/** Theme toggle island. The no-flash inline script in Base.astro sets the
 *  initial theme before paint; this just flips and persists it. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as
        | "light"
        | "dark") || "light";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("tj-theme", next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };

  return (
    <button onClick={toggle} aria-label="toggle theme" class="theme-toggle">
      <span aria-hidden="true">◐</span> theme
      <style>{`
        .theme-toggle {
          cursor: pointer;
          background: transparent;
          border: 1px solid var(--line);
          color: var(--ink);
          font-family: inherit;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>
    </button>
  );
}
