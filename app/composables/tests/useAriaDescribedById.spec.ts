import { describe, it, expect } from "vitest";
import { ref } from "vue";
import type { Slot, Slots } from "vue";
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
      expect(ariaDescribedby()).toBeNull();
    });

    it("includes descriptionId when descriptionText slot is present", () => {
      const { descriptionId, ariaDescribedby } = useAriaDescribedById(
        "email",
        ref(false),
        withSlot("descriptionText")
      );
      expect(ariaDescribedby()).toContain(descriptionId);
    });

    it("includes descriptionId when descriptionHtml slot is present", () => {
      const { descriptionId, ariaDescribedby } = useAriaDescribedById(
        "email",
        ref(false),
        withSlot("descriptionHtml")
      );
      expect(ariaDescribedby()).toContain(descriptionId);
    });

    it("includes descriptionId when description slot is present", () => {
      const { descriptionId, ariaDescribedby } = useAriaDescribedById(
        "email",
        ref(false),
        withSlot("description")
      );
      expect(ariaDescribedby()).toContain(descriptionId);
    });

    it("includes errorId when fieldHasError is true", () => {
      const { errorId, ariaDescribedby } = useAriaDescribedById("email", ref(true), noSlots);
      expect(ariaDescribedby()).toContain(errorId);
    });

    it("does not include errorId when fieldHasError is false (value is null)", () => {
      const { ariaDescribedby } = useAriaDescribedById("email", ref(false), noSlots);
      expect(ariaDescribedby()).toBeNull();
    });

    it("does not include errorId when slot is present but fieldHasError is false", () => {
      const { errorId, ariaDescribedby } = useAriaDescribedById(
        "email",
        ref(false),
        withSlot("descriptionText")
      );
      expect(ariaDescribedby()).not.toContain(errorId);
    });

    it("includes both descriptionId and errorId when slot present and error active", () => {
      const fieldHasError = ref(true);
      const { descriptionId, errorId, ariaDescribedby } = useAriaDescribedById(
        "email",
        fieldHasError,
        withSlot("descriptionText")
      );
      expect(ariaDescribedby()).toContain(descriptionId);
      expect(ariaDescribedby()).toContain(errorId);
    });

    it("descriptionId appears before errorId in the combined string", () => {
      const fieldHasError = ref(true);
      const { descriptionId, errorId, ariaDescribedby } = useAriaDescribedById(
        "email",
        fieldHasError,
        withSlot("descriptionText")
      );
      const value = ariaDescribedby()!;
      expect(value.indexOf(descriptionId)).toBeLessThan(value.indexOf(errorId));
    });
  });

  // ─── Reactivity ───────────────────────────────────────────────────────────

  describe("reactivity", () => {
    it("ariaDescribedby updates when fieldHasError changes to true", async () => {
      const fieldHasError = ref(false);
      const { errorId, ariaDescribedby } = useAriaDescribedById("email", fieldHasError, noSlots);
      expect(ariaDescribedby()).toBeNull();
      fieldHasError.value = true;
      await nextTick();
      expect(ariaDescribedby()).toContain(errorId);
    });

    it("ariaDescribedby updates when fieldHasError changes back to false", async () => {
      const fieldHasError = ref(true);
      const { ariaDescribedby } = useAriaDescribedById("email", fieldHasError, noSlots);
      expect(ariaDescribedby()).toBeTruthy();
      fieldHasError.value = false;
      await nextTick();
      expect(ariaDescribedby()).toBeNull();
    });

    it("picks up a description slot added after setup", () => {
      const slots: Record<string, Slot> = {};
      const { descriptionId, ariaDescribedby } = useAriaDescribedById("email", ref(false), slots as Slots);
      expect(ariaDescribedby()).toBeNull();
      slots.descriptionText = () => [];
      expect(ariaDescribedby()).toBe(descriptionId);
    });

    it("drops a description slot removed after setup", () => {
      const slots: Record<string, Slot> = { descriptionText: () => [] };
      const { ariaDescribedby } = useAriaDescribedById("email", ref(false), slots as Slots);
      expect(ariaDescribedby()).toBeTruthy();
      delete slots.descriptionText;
      expect(ariaDescribedby()).toBeNull();
    });
  });
});
