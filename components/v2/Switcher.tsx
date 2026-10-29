import { HERO_IDS, HERO_NOTES, type HeroId } from "./Hero";

/** Review-only control for comparing heroes. Not part of the page design. */
export function Switcher({ current }: { current: HeroId }) {
  return (
    <nav className="m-switch" aria-label="Hero variants">
      {HERO_IDS.map((id) => (
        <a key={id} href={`/v2/${id}`} aria-current={id === current ? "page" : undefined} title={HERO_NOTES[id]}>
          <span className="sr">Hero </span>{id.toUpperCase()}
          <span className="sr">: {HERO_NOTES[id]}</span>
        </a>
      ))}
      <a href="/" className="m-switch-dark">Dark<span className="sr"> version</span> →</a>
    </nav>
  );
}
