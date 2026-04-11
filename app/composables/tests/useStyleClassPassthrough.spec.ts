import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { useStyleClassPassthrough } from "../useStyleClassPassthrough";

describe("useStyleClassPassthrough", () => {
  // ─── Initialisation ───────────────────────────────────────────────────────

  describe("initialisation", () => {
    it("accepts a string and normalizes to an array", () => {
      const { elementClasses } = useStyleClassPassthrough("foo");
      expect(elementClasses.value).toBe("foo");
    });

    it("splits a multi-word string on whitespace", () => {
      const { elementClasses } = useStyleClassPassthrough("foo bar baz");
      expect(elementClasses.value).toBe("foo bar baz");
    });

    it("accepts an array directly", () => {
      const { elementClasses } = useStyleClassPassthrough(["foo", "bar"]);
      expect(elementClasses.value).toBe("foo bar");
    });

    it("returns empty string for empty string input", () => {
      const { elementClasses } = useStyleClassPassthrough("");
      expect(elementClasses.value).toBe("");
    });

    it("returns empty string for empty array input", () => {
      const { elementClasses } = useStyleClassPassthrough([]);
      expect(elementClasses.value).toBe("");
    });

    it("strips leading and trailing whitespace from string input", () => {
      const { elementClasses } = useStyleClassPassthrough("  foo  bar  ");
      expect(elementClasses.value).toBe("foo bar");
    });
  });

  // ─── elementClasses ───────────────────────────────────────────────────────

  describe("elementClasses", () => {
    it("reflects the current class list joined by spaces", () => {
      const { elementClasses } = useStyleClassPassthrough(["a", "b", "c"]);
      expect(elementClasses.value).toBe("a b c");
    });

    it("is reactive — updates when styleClassPassthroughRef changes", async () => {
      const { elementClasses, styleClassPassthroughRef } = useStyleClassPassthrough(["a"]);
      styleClassPassthroughRef.value = ["a", "b"];
      await nextTick();
      expect(elementClasses.value).toBe("a b");
    });
  });

  // ─── updateElementClasses ─────────────────────────────────────────────────

  describe("updateElementClasses", () => {
    it("adds a class that is not present (string)", () => {
      const { elementClasses, updateElementClasses } = useStyleClassPassthrough("foo");
      updateElementClasses("bar");
      expect(elementClasses.value).toContain("bar");
    });

    it("removes a class that is already present (toggle off)", () => {
      const { elementClasses, updateElementClasses } = useStyleClassPassthrough("foo bar");
      updateElementClasses("foo");
      expect(elementClasses.value).not.toContain("foo");
      expect(elementClasses.value).toContain("bar");
    });

    it("adds multiple classes from an array", () => {
      const { elementClasses, updateElementClasses } = useStyleClassPassthrough([]);
      updateElementClasses(["a", "b", "c"]);
      expect(elementClasses.value).toBe("a b c");
    });

    it("toggles each class in an array independently", () => {
      const { elementClasses, updateElementClasses } = useStyleClassPassthrough(["a", "b"]);
      // "a" is present (will be removed), "c" is absent (will be added)
      updateElementClasses(["a", "c"]);
      expect(elementClasses.value).not.toContain("a");
      expect(elementClasses.value).toContain("b");
      expect(elementClasses.value).toContain("c");
    });

    it("calling twice with the same class returns to original state", () => {
      const { elementClasses, updateElementClasses } = useStyleClassPassthrough("foo");
      updateElementClasses("bar");
      updateElementClasses("bar");
      expect(elementClasses.value).toBe("foo");
    });
  });

  // ─── resetElementClasses ──────────────────────────────────────────────────

  describe("resetElementClasses", () => {
    it("resets to a new string value", () => {
      const { elementClasses, updateElementClasses, resetElementClasses } =
        useStyleClassPassthrough("foo");
      updateElementClasses("bar");
      resetElementClasses("baz");
      expect(elementClasses.value).toBe("baz");
    });

    it("resets to a new array value", () => {
      const { elementClasses, updateElementClasses, resetElementClasses } =
        useStyleClassPassthrough("foo");
      updateElementClasses("extra");
      resetElementClasses(["x", "y"]);
      expect(elementClasses.value).toBe("x y");
    });

    it("clears all classes when reset with empty string", () => {
      const { elementClasses, resetElementClasses } = useStyleClassPassthrough("foo bar");
      resetElementClasses("");
      expect(elementClasses.value).toBe("");
    });

    it("discards any classes added via updateElementClasses", () => {
      const { elementClasses, updateElementClasses, resetElementClasses } =
        useStyleClassPassthrough("original");
      updateElementClasses("added");
      resetElementClasses("original");
      expect(elementClasses.value).toBe("original");
      expect(elementClasses.value).not.toContain("added");
    });
  });
});
