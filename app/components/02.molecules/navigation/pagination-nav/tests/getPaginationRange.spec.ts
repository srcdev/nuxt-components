import { describe, it, expect } from "vitest";
import { getPaginationRange, toPaginationWholeNumber } from "~/utils/pagination-range";
import type { PaginationNavItem } from "~/types/components/pagination-nav";

// "…" for an ellipsis, the page number otherwise, so expectations read like the rendered control.
const shape = (items: PaginationNavItem[]) => items.map((item) => (item.type === "page" ? item.page : "…"));

describe("getPaginationRange", () => {
  it("shows every page when the total fits the window", () => {
    expect(shape(getPaginationRange(1, 7))).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(shape(getPaginationRange(3, 3))).toEqual([1, 2, 3]);
  });

  it("returns nothing for a total below one", () => {
    expect(getPaginationRange(1, 0)).toEqual([]);
    expect(getPaginationRange(1, -5)).toEqual([]);
    expect(getPaginationRange(1, Number.NaN)).toEqual([]);
    expect(getPaginationRange(1, Number.POSITIVE_INFINITY)).toEqual([]);
  });

  it.each([
    [1, [1, 2, 3, 4, 5, "…", 20]],
    [4, [1, 2, 3, 4, 5, "…", 20]],
    [5, [1, "…", 4, 5, 6, "…", 20]],
    [10, [1, "…", 9, 10, 11, "…", 20]],
    [16, [1, "…", 15, 16, 17, "…", 20]],
    [17, [1, "…", 16, 17, 18, 19, 20]],
    [20, [1, "…", 16, 17, 18, 19, 20]],
  ])("windows page %i of 20 with an ellipsis for each hidden run", (page, expected) => {
    expect(shape(getPaginationRange(page, 20))).toEqual(expected);
  });

  it("shows a single hidden page instead of an ellipsis", () => {
    // Total 8 with the default window of 7: page 4 would hide only page 6 or 2 on one side.
    for (let page = 1; page <= 8; page++) {
      const items = getPaginationRange(page, 8);
      items.forEach((item, index) => {
        if (item.type !== "ellipsis") return;
        const before = items[index - 1];
        const after = items[index + 1];
        if (before?.type === "page" && after?.type === "page") {
          expect(after.page - before.page).toBeGreaterThan(2);
        }
      });
    }
  });

  it("keeps the same length on every page once the total exceeds the window", () => {
    for (const [siblings, boundaries] of [
      [1, 1],
      [2, 1],
      [0, 0],
      [1, 2],
      [3, 0],
    ] as const) {
      const length = 2 * boundaries + 2 * siblings + 3;
      const total = length + 13;
      for (let page = 1; page <= total; page++) {
        expect(getPaginationRange(page, total, siblings, boundaries)).toHaveLength(length);
      }
    }
  });

  it("always contains the current page, the first and the last", () => {
    for (let page = 1; page <= 50; page++) {
      const pages = shape(getPaginationRange(page, 50, 1, 1));
      expect(pages).toContain(page);
      expect(pages[0]).toBe(1);
      expect(pages.at(-1)).toBe(50);
    }
  });

  it("honours siblings and boundaries", () => {
    expect(shape(getPaginationRange(10, 20, 2, 2))).toEqual([1, 2, "…", 8, 9, 10, 11, 12, "…", 19, 20]);
    expect(shape(getPaginationRange(10, 20, 0, 0))).toEqual(["…", 10, "…"]);
  });

  it("clamps an out-of-range or fractional page", () => {
    expect(shape(getPaginationRange(99, 20))).toEqual(shape(getPaginationRange(20, 20)));
    expect(shape(getPaginationRange(-3, 20))).toEqual(shape(getPaginationRange(1, 20)));
    expect(shape(getPaginationRange(10.7, 20))).toEqual(shape(getPaginationRange(10, 20)));
  });

  it("falls back to the defaults for invalid siblings or boundaries", () => {
    expect(getPaginationRange(10, 20, -1, Number.NaN)).toEqual(getPaginationRange(10, 20));
  });
});

describe("toPaginationWholeNumber", () => {
  it("floors finite non-negative numbers and falls back otherwise", () => {
    expect(toPaginationWholeNumber(4.9, 0)).toBe(4);
    expect(toPaginationWholeNumber(0, 1)).toBe(0);
    expect(toPaginationWholeNumber(-1, 1)).toBe(1);
    expect(toPaginationWholeNumber(Number.NaN, 2)).toBe(2);
    expect(toPaginationWholeNumber(Number.POSITIVE_INFINITY, 3)).toBe(3);
    expect(toPaginationWholeNumber("7", 0)).toBe(7);
  });
});
