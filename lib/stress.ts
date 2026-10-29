"use client";

import { useSyncExternalStore } from "react";
import type { Notice } from "./data";

/** ?stress=1 review mode: row 1 gets a 120-character title, row 2 loses its buyer and deadline. */
const LONG_TITLE =
  "Supervision of repair and rehabilitation of highways, bridges and drainage structures across four districts, lot 2 (1/2)";

const subscribe = () => () => {};
const read = () => new URLSearchParams(window.location.search).get("stress") === "1";

export function useStress(n: Notice, index: number): Notice {
  const on = useSyncExternalStore(subscribe, read, () => false);
  if (!on) return n;
  if (index === 0) return { ...n, title: LONG_TITLE };
  if (index === 1) return { ...n, buyer: "", closes: null, closes_label: "" };
  return n;
}
