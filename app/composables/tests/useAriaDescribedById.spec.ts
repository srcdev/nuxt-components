import { describe, it, expect } from "vitest";
import { ref } from "vue";
import type { Slots } from "vue";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useAriaDescribedById } from "../useAriaDescribedById";

let idCounter = 0;
const { useIdMock } = vi.hoisted(() => ({
  useIdMock: vi.fn(() => `test-id-${++idCounter}`),
}));
mockNuxtImport("useId", () => useIdMock);

const noSlots: Slots = {};
const withSlot = (name: string): Slots => ({ [name]: () => [] });

describe("useAriaDescribedById", () => {
  // ─── ID structure ─────────────────────────────────────────────────────────

  describe("id structure", () => {
    it("id is prefixed with the name", () => {
      const { id } = useAriaDescribedById("email", ref(false), noSlots);
      expect(id).toMatch(/^email-/);
    });

    it("errorId is suffixed with -error-message", () => {
      const { id, errorId } = useAriaDescribedById("email", ref(false), noSlots);
      expect(errorId).toBe(`${id}-error-message`);
    });

    it("descriptionId is suffixed with -description", () => {
      const { id, descriptionId } = useAriaDescribedById("email", ref(false), noSlots);
      expect(descriptionId).toBe(`${id}-description`);
    });
  });

  // ─── ariaDescribedby — no slots, no error ─────────────────────────────────

  describe("ariaDescribedby", () => {
    it("is null when no slots and no error", () => {
      const { ariaDescribedby } = useAriaDescribedById("email", ref(false), noSlots);
      expect(ariaDescribedby.value).toBeNull();
    });

    it("includes descriptionId when descriptionText slot is present", () => {
      const { descriptionId, ariaDescribedby } = useAriaDescribedById(
        "email",
        ref(false),
        withSlot("descriptionText")
      );
      expect(ariaDescribedby.value).toContain(descriptionId);
    });

    it("includes descriptionId when descriptionHtml slot is present", () => {
      const { descriptionId, ariaDescribedby } = useAriaDescribedById(
        "email",
        ref(false),
        withSlot("descriptionHtml")
      );
      expect(ariaDescribedby.value).toContain(descriptionId);
    });

    it("includes descriptionId when description slot is present", () => {
      const { descriptionId, ariaDescribedby } = useAriaDescribedById(
        "email",
        ref(false),
        withSlot("description")
      );
      expect(ariaDescribedby.value).toContain(descriptionId);
    });

    it("includes errorId when fieldHasError is true", () => {
      const { errorId, ariaDescribedby } = useAriaDescribedById("email", ref(true), noSlots);
      expect(ariaDescribedby.value).toContain(errorId);
    });

    it("does not include errorId when fieldHasError is false (value is null)", () => {
      const { ariaDescribedby } = useAriaDescribedById("email", ref(false), noSlots);
      expect(ariaDescribedby.value).toBeNull();
    });

    it("does not include errorId when slot is present but fieldHasError is false", () => {
      const { errorId, ariaDescribedby } = useAriaDescribedById(
        "email",
        ref(false),
        withSlot("descriptionText")
      );
      expect(ariaDescribedby.value).not.toContain(errorId);
    });

    it("includes both descriptionId and errorId when slot present and error active", () => {
      const fieldHasError = ref(true);
      const { descriptionId, errorId, ariaDescribedby } = useAriaDescribedById(
        "email",
        fieldHasError,
        withSlot("descriptionText")
      );
      expect(ariaDescribedby.value).toContain(descriptionId);
      expect(ariaDescribedby.value).toContain(errorId);
    });

    it("descriptionId appears before errorId in the combined string", () => {
      const fieldHasError = ref(true);
      const { descriptionId, errorId, ariaDescribedby } = useAriaDescribedById(
        "email",
        fieldHasError,
        withSlot("descriptionText")
      );
      const value = ariaDescribedby.value!;
      expect(value.indexOf(descriptionId)).toBeLessThan(value.indexOf(errorId));
    });
  });

  // ─── Reactivity ───────────────────────────────────────────────────────────

  describe("reactivity", () => {
    it("ariaDescribedby updates when fieldHasError changes to true", async () => {
      const fieldHasError = ref(false);
      const { errorId, ariaDescribedby } = useAriaDescribedById("email", fieldHasError, noSlots);
      expect(ariaDescribedby.value).toBeNull();
      fieldHasError.value = true;
      await nextTick();
      expect(ariaDescribedby.value).toContain(errorId);
    });

    it("ariaDescribedby updates when fieldHasError changes back to false", async () => {
      const fieldHasError = ref(true);
      const { ariaDescribedby } = useAriaDescribedById("email", fieldHasError, noSlots);
      expect(ariaDescribedby.value).toBeTruthy();
      fieldHasError.value = false;
      await nextTick();
      expect(ariaDescribedby.value).toBeNull();
    });
  });
});
