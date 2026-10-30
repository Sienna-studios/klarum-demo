import type { ReactNode } from "react";

export type SheetCell = { k: string; v: ReactNode; mono?: boolean; rev?: boolean; span?: number };

/**
 * One caption system for the page: a title block. Footer and riso plates both render this.
 * A missing value shows an en dash, never an empty cell.
 */
export function SheetCaption({ cells, mark = false, label, className = "" }: { cells: SheetCell[]; mark?: boolean; label: string; className?: string }) {
  return (
    <dl className={`sheet ${mark ? "sheet-mark " : ""}${className}`} aria-label={label}>
      {mark && (
        <div className="sheet-k">
          <dt className="sr">Company</dt>
          <dd className="sheet-wm">Klarum</dd>
        </div>
      )}
      {cells.map((c) => (
        <div key={c.k} className="sheet-c" style={c.span ? { gridColumn: `span ${c.span}` } : undefined}>
          <dt>{c.k}</dt>
          <dd className={`${c.mono ? "mono " : ""}${c.rev ? "rev-c" : ""}`}>{c.v || "–"}</dd>
        </div>
      ))}
    </dl>
  );
}
