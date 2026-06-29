import { useState } from "preact/hooks";

export default function NewsletterForm() {
  const [label, setLabel] = useState("subscribe");
  const [done, setDone] = useState(false);

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    if (done) return;
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    setLabel("…");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setDone(true);
      setLabel(res.ok ? "subscribed ✓" : "try again");
    } catch {
      setLabel("try again");
      setDone(false);
    }
  };

  return (
    <form onSubmit={onSubmit} class="nl">
      <input type="email" name="email" required placeholder="you@domain.com" />
      <button type="submit">{label}</button>
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autocomplete="off" class="hp" />
      <style>{`
        .nl { display: flex; gap: 10px; flex-wrap: wrap; }
        .nl input[type=email] { min-width: 220px; }
        .nl button { cursor: pointer; background: var(--ink); color: var(--bg); border: none; font-family: inherit; font-size: 13px; font-weight: 600; padding: 11px 20px; border-radius: 3px; }
        .hp { position: absolute; left: -9999px; width: 1px; height: 1px; }
      `}</style>
    </form>
  );
}
