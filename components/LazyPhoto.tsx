"use client";

import { useEffect, useRef, useState } from "react";
import { type PhotoName, photoSet, photoSize, photoSrc } from "@/lib/photos";

/** Decorative photo that starts loading only when its slot nears the viewport (IntersectionObserver). */
export function LazyPhoto({ name, sizes, className }: { name: PhotoName; sizes: string; className: string }) {
  const slot = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = slot.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setNear(true);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setNear(true);
        io.disconnect();
      }
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { width, height } = photoSize(name);
  return (
    <span ref={slot} className={`ph ph-lazy ${className}`} data-photo="lazy" data-loaded={loaded} aria-hidden="true">
      {near && (
        <picture>
          <source type="image/avif" srcSet={photoSet(name, "avif")} sizes={sizes} />
          <source type="image/webp" srcSet={photoSet(name, "webp")} sizes={sizes} />
          <img
            ref={(img) => { if (img?.complete) setLoaded(true); }}
            src={photoSrc(name)} alt="" width={width} height={height} decoding="async"
            onLoad={() => setLoaded(true)}
          />
        </picture>
      )}
    </span>
  );
}
