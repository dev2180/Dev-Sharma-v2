"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "LangGraph + RAG = production AI",
  "Prompt engineering = −70% inference cost",
  "Hybrid retrieval = +40% coverage",
  "Modular pipelines = −60% debug time",
];

export function Typewriter() {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = PHRASES[phraseIdx];
    let delay = deleting ? 28 : 55;

    if (!deleting && text === phrase) delay = 2200; // hold complete phrase
    if (deleting && text === "") delay = 350;

    const timer = setTimeout(() => {
      if (!deleting) {
        if (text === phrase) {
          setDeleting(true);
        } else {
          setText(phrase.slice(0, text.length + 1));
        }
      } else {
        if (text === "") {
          setDeleting(false);
          setPhraseIdx((phraseIdx + 1) % PHRASES.length);
        } else {
          setText(phrase.slice(0, text.length - 1));
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, phraseIdx]);

  return (
    <span className="font-display text-sm md:text-base" style={{ color: "var(--color-text-dim)" }}>
      {text}
      <span className="typewriter-caret" />
    </span>
  );
}
