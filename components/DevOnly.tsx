"use client";

import { type ReactNode, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const read = () => new URLSearchParams(window.location.search).get("dev") === "1";

/** Renders its children only when the URL has ?dev=1 (review controls that are not part of the page design). */
export function DevOnly({ children }: { children: ReactNode }) {
  const on = useSyncExternalStore(subscribe, read, () => false);
  return on ? children : null;
}
