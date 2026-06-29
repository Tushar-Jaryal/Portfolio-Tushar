import { useState } from "preact/hooks";

export default function ContactForm() {
  const [label, setLabel] = useState("send message");
  const [note, setNote] = useState("// this message is sent to my inbox");
  const [done, setDone] = useState(false);

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    if (done) return;
    const form = e.currentTarget as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries());
    setLabel("sending…");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _ts: Date.now() }),
      });
      if (res.ok) {
        setDone(true);
        setLabel("sent ✓ thanks!");
        setNote("// got it — I'll be in touch soon");
      } else {
        setLabel("try again");
        setNote("// something went wrong, please retry");
      }
    } catch {
      setLabel("try again");
      setNote("// network error, please retry");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div class="row2">
        <div><label>name</label><input type="text" name="name" required placeholder="Ada Lovelace" /></div>
        <div><label>email</label><input type="email" name="email" required placeholder="ada@domain.com" /></div>
      </div>
      <div><label>subject</label><input type="text" name="subject" placeholder="A short summary" /></div>
      <div><label>message</label><textarea name="message" rows={6} required placeholder="Tell me what you're working on..."></textarea></div>
      {/* honeypot + timing */}
      <input type="text" name="company" tabIndex={-1} autocomplete="off" class="hp" />
      <div class="foot">
        <span class="note">{note}</span>
        <button type="submit">{label}</button>
      </div>
      <style>{`
        form { display: flex; flex-direction: column; gap: 16px; }
        label { font-size: 11px; color: var(--muted); display: block; margin-bottom: 7px; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 540px) { .row2 { grid-template-columns: 1fr; } }
        .hp { position: absolute; left: -9999px; width: 1px; height: 1px; }
        .foot { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
        .note { font-size: 11px; color: var(--muted); }
        .foot button { cursor: pointer; background: var(--ink); color: var(--bg); border: none; font-family: inherit; font-size: 13px; font-weight: 600; padding: 13px 26px; border-radius: 3px; }
      `}</style>
    </form>
  );
}
