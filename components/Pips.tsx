export function Pips({ n }: { n: number }) {
  return (
    <span className="pips" role="img" aria-label={`Fit ${n} of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={i < n ? "pip on" : "pip"} />
      ))}
    </span>
  );
}
