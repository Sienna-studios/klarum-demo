type Props = {
  height?: number;
  className?: string;
  title?: string;
};

/** The Klarum K mark. Decorative unless a title is given. */
export function KMark({ height = 24, className, title }: Props) {
  const width = Math.round((height * 700) / 518 * 10) / 10;
  return (
    <svg
      viewBox="0 0 700 518"
      width={width}
      height={height}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path
        d="M18 14 L100 18 L182 190 L186 14 L330 14 L668 252 L670 268 L668 500 L320 500 L205 312 L198 500 L108 500 L18 262 Z"
        fill="currentColor"
      />
    </svg>
  );
}
