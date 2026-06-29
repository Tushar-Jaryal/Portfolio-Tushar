import { useEffect, useState } from "preact/hooks";

/** Filter buttons for the projects grid. Toggles visibility of .pcard[data-cat] elements. */
export default function ProjectFilter({ filters }: { filters: string[] }) {
  const [active, setActive] = useState(filters[0] ?? "all");

  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".pcard").forEach((c) => {
      const cat = c.getAttribute("data-cat");
      c.style.display = active === "all" || cat === active ? "flex" : "none";
    });
  }, [active]);

  return (
    <div class="filter-row">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setActive(f)}
          class={active === f ? "on" : ""}
        >
          {f}
        </button>
      ))}
      <style>{`
        .filter-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .filter-row button {
          cursor: pointer; font-family: inherit; font-size: 12px; padding: 7px 14px;
          border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--muted);
        }
        .filter-row button.on { background: var(--ink); color: var(--bg); border-color: var(--ink); }
      `}</style>
    </div>
  );
}
