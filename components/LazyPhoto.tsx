"use client";

import { useEffect, useRef, useState } from "react";
import { type Grade, type PhotoSlot, photoFallback, photoSources } from "@/lib/photos";

const readGrade = (): Grade => {
  const t = document.documentElement.dataset.theme;
  if (t === "light" || t === "dark") return t;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

/**
 * Decorative graded photo. Loads only when its slot nears the viewport (IntersectionObserver).
 * grade "auto" follows the page theme (data-theme, else the OS) and swaps when it changes; "light" is fixed (the /v2 page).
 */
export function LazyPhoto({ slot, grade = "auto", sizes, className }: { slot: PhotoSlot; grade?: Grade | "auto"; sizes: string; className: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState<Grade>("dark");

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const io = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          if (entries.some((e) => e.isIntersecting)) { setNear(true); io?.disconnect(); }
        }, { rootMargin: "200px 0px" })
      : null;
    if (io) io.observe(node); else setNear(true);
    return () => io?.disconnect();
  }, []);

  useEffect(() => {
    if (grade !== "auto") return;
    setTheme(readGrade());
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const sync = () => setTheme(readGrade());
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    mq.addEventListener("change", sync);
    return () => { mo.disconnect(); mq.removeEventListener("change", sync); };
  }, [grade]);

  const g: Grade = grade === "auto" ? theme : grade;
  const fb = photoFallback(slot, g);
  return (
    <span ref={el} className={`ph ph-lazy ph-riso ${className}`} data-photo={slot} data-grade={g} data-loaded={loaded} aria-hidden="true">
      {near && (
        <picture key={g}>
          {photoSources(slot, g).map((s) => <source key={s.type + (s.media ?? "")} media={s.media} type={s.type} srcSet={s.srcSet} sizes={sizes} />)}
          <img
            ref={(img) => { if (img?.complete) setLoaded(true); }}
            src={fb.src} width={fb.width} height={fb.height} alt="" decoding="async"
            onLoad={() => setLoaded(true)}
          />
        </picture>
      )}
    </span>
  );
}
