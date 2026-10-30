import { LazyPhoto } from "./LazyPhoto";
import { SheetCaption } from "./SheetCaption";

/** Full-bleed plate between the workflow and the open notices. No text sits on the image; the caption is the shared title block below it. */
export function Plate({ grade = "auto" }: { grade?: "auto" | "light" }) {
  return (
    <figure className="plate has-photo">
      <div className="plate-img">
        <LazyPhoto slot="plate" grade={grade} sizes="100vw" className="ph-plate" />
      </div>
      <figcaption className="plate-cap">
        <div className="wrap">
          <SheetCaption label="Plate information" className="sheet-plate" cells={[{ k: "Plate", v: "1", mono: true }, { k: "Subject", v: "River crossings" }, { k: "Status", v: "Sample image" }]} />
        </div>
      </figcaption>
    </figure>
  );
}
