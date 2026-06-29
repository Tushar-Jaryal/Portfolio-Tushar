import { useEffect, useRef, useState } from "preact/hooks";

/** Cycles through phrases with a typing/deleting effect.
 *  Starts with the first phrase already shown, then deletes → types the next,
 *  so there's no jarring "show full word, then retype it" restart. */
export default function TypingHero({ words }: { words: string[] }) {
  const first = words?.[0] ?? "";
  const [text, setText] = useState(first);
  const state = useRef({ wi: 0, ci: first.length, del: true });

  useEffect(() => {
    if (!words?.length) return;
    // (Re)initialize: first word fully shown, primed to delete.
    state.current = { wi: 0, ci: words[0].length, del: true };
    setText(words[0]);

    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const s = state.current;
      const w = words[s.wi];
      if (!s.del) {
        s.ci++;
        if (s.ci > w.length) {
          s.del = true;
          setText(w);
          timer = setTimeout(tick, 1500); // pause on a complete word
          return;
        }
      } else {
        s.ci--;
        if (s.ci < 0) {
          s.del = false;
          s.wi = (s.wi + 1) % words.length;
          s.ci = 0;
          timer = setTimeout(tick, 220);
          return;
        }
      }
      setText(w.slice(0, Math.max(0, s.ci)));
      timer = setTimeout(tick, s.del ? 45 : 80);
    };

    timer = setTimeout(tick, 1600); // hold the first phrase, then start deleting
    return () => clearTimeout(timer);
  }, [words]);

  return (
    <span>
      <span style={{ color: "var(--ink)" }}>{text}</span>
      <span class="caret" />
      <style>{`
        .caret {
          display: inline-block;
          width: 9px;
          height: 18px;
          background: var(--accent);
          margin-left: 3px;
          transform: translateY(3px);
          animation: blink 1s steps(1) infinite;
        }
      `}</style>
    </span>
  );
}
