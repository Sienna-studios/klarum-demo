"use client";

import { useEffect, useState } from "react";
import { URLS } from "@/lib/data";
import { KMark } from "./KMark";

function toggleTheme() {
  const root = document.documentElement;
  const cur = root.dataset.theme ?? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const next = cur === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
}

export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);
  return (
    <header id="top" className="head">
      <div className="wrap head-in">
        <a href="#top" className="logo" aria-label="Klarum home">
          <KMark className="logo-k" />
          <span className="wordmark">Klarum</span>
        </a>
        <nav className="head-nav" aria-label="Main">
          <a href="#notices" className="navlink">Notices</a>
        </nav>
        <div className="head-r">
          <button type="button" className="icon-btn" aria-label="Switch theme" onClick={toggleTheme}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 3.5v17a8.5 8.5 0 0 0 0-17Z" fill="currentColor" />
            </svg>
          </button>
          <a href={URLS.pricing} className="btn btn-sec head-price">See pricing</a>
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls={open ? "mobile-menu" : undefined}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="mobile-menu wrap">
          <a href="#notices" className="navlink" onClick={() => setOpen(false)}>Notices</a>
          <a href={URLS.pricing} className="navlink">See pricing</a>
        </div>
      )}
    </header>
  );
}
