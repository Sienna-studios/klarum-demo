import { LazyPhoto } from "./LazyPhoto";

/** Full-bleed plate between the workflow and the open notices. No text sits on the image; the caption is a title-block strip below it. */
export function Plate({ grade = "auto" }: { grade?: "auto" | "light" }) {
  return (
    <figure className="plate has-photo">
      <div className="plate-img">
        <LazyPhoto slot="plate" grade={grade} sizes="100vw" className="ph-plate" />
      </div>
      <figcaption className="plate-cap">
        <p className="wrap"><span className="plate-tb">Plate 1 · River crossings · Sample image</span></p>
      </figcaption>
    </figure>
  );
}
