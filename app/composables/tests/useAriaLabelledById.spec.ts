import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useAriaLabelledById } from "../useAriaLabelledById";

let idCounter = 0;
const { useIdMock } = vi.hoisted(() => ({
  useIdMock: vi.fn(() => `test-id-${++idCounter}`),
}));
mockNuxtImport("useId", () => useIdMock);

describe("useAriaLabelledById", () => {
  // ─── headingId ────────────────────────────────────────────────────────────

  describe("headingId", () => {
    it("returns a non-empty string", () => {
      const { headingId } = useAriaLabelledById("div");
      expect(headingId).toBeTruthy();
      expect(typeof headingId).toBe("string");
    });

    it("is stable — same value returned by ariaLabelledby when applicable", () => {
      const { headingId, ariaLabelledby } = useAriaLabelledById("section");
      expect(ariaLabelledby.value).toBe(headingId);
    });
  });

  // ─── Labelled tags ────────────────────────────────────────────────────────

  describe("labelled tags", () => {
    it.each(["section", "main", "article", "aside"])(
      '"%s" returns ariaLabelledby = headingId',
      (tag) => {
        const { headingId, ariaLabelledby } = useAriaLabelledById(tag);
        expect(ariaLabelledby.value).toBe(headingId);
      }
    );
  });

  // ─── Non-labelled tags ────────────────────────────────────────────────────

  describe("non-labelled tags", () => {
    it.each(["div", "span", "h1", "p", "ul", "nav"])(
      '"%s" returns ariaLabelledby = undefined',
      (tag) => {
        const { ariaLabelledby } = useAriaLabelledById(tag);
        expect(ariaLabelledby.value).toBeUndefined();
      }
    );
  });

  // ─── Reactivity ───────────────────────────────────────────────────────────

  describe("reactivity", () => {
    it("updates ariaLabelledby when a ref tag changes to a labelled tag", async () => {
      const tag = ref("div");
      const { headingId, ariaLabelledby } = useAriaLabelledById(tag);
      expect(ariaLabelledby.value).toBeUndefined();
      tag.value = "section";
      await nextTick();
      expect(ariaLabelledby.value).toBe(headingId);
    });

    it("updates ariaLabelledby when a ref tag changes away from a labelled tag", async () => {
      const tag = ref("section");
      const { ariaLabelledby } = useAriaLabelledById(tag);
      expect(ariaLabelledby.value).toBeTruthy();
      tag.value = "div";
      await nextTick();
      expect(ariaLabelledby.value).toBeUndefined();
    });
  });
});
