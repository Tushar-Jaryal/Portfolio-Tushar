import { useEffect, useState } from "preact/hooks";

/** Thin progress bar that fills as the article is scrolled. */
export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      setPct(Math.min(100, Math.max(0, p * 100)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div class="rp-track">
      <div class="rp-fill" style={{ width: `${pct}%` }} />
      <style>{`
        .rp-track { height: 3px; background: var(--line); position: sticky; top: 65px; z-index: 40; }
        .rp-fill { height: 100%; background: var(--accent); }
      `}</style>
    </div>
  );
}
