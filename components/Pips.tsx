/** Fit squares. Filled = fit; when the row is shortlisted, CSS (.sl) switches the filled squares to the hatch. */
export function Pips({ n }: { n: number }) {
  return (
    <span className="pips" role="img" aria-label={`Fit ${n} of 5, sample`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={i < n ? "pip on" : "pip"} />
      ))}
    </span>
  );
}
