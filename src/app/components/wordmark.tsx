/** Giant expanded wordmark that always spans the full container width. */
export function Wordmark({ text }: { text: string }) {
  return (
    <svg
      viewBox="0 0 1000 186"
      className="block w-full"
      role="img"
      aria-label={text}
    >
      <text
        x="0"
        y="176"
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        className="font-wide fill-current"
        style={{ fontSize: 244 }}
      >
        {text}
      </text>
    </svg>
  );
}
