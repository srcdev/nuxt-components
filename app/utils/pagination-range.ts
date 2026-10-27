import type { PaginationNavItem } from "~/types/components/pagination-nav";

// Non-finite or negative input becomes the fallback; fractions round down.
export const toPaginationWholeNumber = (value: unknown, fallback: number): number => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : fallback;
};

const range = (from: number, to: number): PaginationNavItem[] =>
  Array.from({ length: Math.max(0, to - from + 1) }, (_, index) => ({ type: "page", page: from + index }));

const ELLIPSIS: PaginationNavItem = { type: "ellipsis" };

/**
 * The page window for a pagination control: `boundaries` pages at each end, `siblings` either side of
 * the current page, and an ellipsis for each hidden run of two or more pages (a run of one shows the
 * page instead). Once `total` exceeds the window the length is always `2 * boundaries + 2 * siblings + 3`,
 * so (with `boundaries` of at least 1, which keeps the widest number in view) the control keeps its width.
 */
export const getPaginationRange = (
  page: number,
  total: number,
  siblings = 1,
  boundaries = 1
): PaginationNavItem[] => {
  const count = toPaginationWholeNumber(total, 0);
  if (count < 1) return [];

  const s = toPaginationWholeNumber(siblings, 1);
  const b = toPaginationWholeNumber(boundaries, 1);
  const length = 2 * b + 2 * s + 3;
  if (count <= length) return range(1, count);

  const current = Math.min(Math.max(1, toPaginationWholeNumber(page, 1)), count);
  const start = range(1, b);
  const end = range(count - b + 1, count);

  if (current <= b + s + 2) return [...range(1, length - b - 1), ELLIPSIS, ...end];
  if (current >= count - b - s - 1) return [...start, ELLIPSIS, ...range(count - (length - b - 1) + 1, count)];
  return [...start, ELLIPSIS, ...range(current - s, current + s), ELLIPSIS, ...end];
};
