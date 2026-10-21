const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;

// User-perceived characters, so a typewriter never shows half an emoji or a stray combining mark.
export function splitGraphemes(text: string): string[] {
  if (!segmenter) return Array.from(text);
  return Array.from(segmenter.segment(text), (segment) => segment.segment);
}
