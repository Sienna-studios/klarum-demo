"use client";

import { useEffect, useState } from "react";

/** The header trial button: a quiet text link while the hero is in view, solid red once the hero has scrolled out (opacity fade only). */
export function HeaderCta({ href }: { href: string }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".mh");
    if (!hero || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), { rootMargin: "-72px 0px 0px 0px" }); // the sticky header is 72 px
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <a href={href} className="m-btn m-btn-sm m-btn-hdr" data-solid={solid}>
      Start the Business trial
    </a>
  );
}
