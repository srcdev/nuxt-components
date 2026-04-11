import { describe, it, expect } from "vitest";
import useApiRequest from "../useApiRequest";

class NetworkError extends Error {
  override name = "NetworkError";
}

class ValidationError extends Error {
  override name = "ValidationError";
}

describe("useApiRequest", () => {
  // ─── Success ──────────────────────────────────────────────────────────────

  describe("on success", () => {
    it("returns [undefined, data]", async () => {
      const [error, data] = await useApiRequest(Promise.resolve("ok"));
      expect(error).toBeUndefined();
      expect(data).toBe("ok");
    });

    it("passes through any resolved value type", async () => {
      const payload = { id: 1, name: "test" };
      const [, data] = await useApiRequest(Promise.resolve(payload));
      expect(data).toEqual(payload);
    });
  });

  // ─── Error — no errorsToCatch ─────────────────────────────────────────────

  describe("on rejection with no errorsToCatch", () => {
    it("returns [error] for any thrown error", async () => {
      const err = new Error("boom");
      const result = await useApiRequest(Promise.reject(err));
      expect(result).toEqual([err]);
    });

    it("returns [error] for unknown error types", async () => {
      const err = new NetworkError("network fail");
      const result = await useApiRequest(Promise.reject(err));
      expect(result).toEqual([err]);
    });
  });

  // ─── Error — matching errorsToCatch ───────────────────────────────────────

  describe("on rejection with matching errorsToCatch", () => {
    it("returns [error] when the error matches the caught class", async () => {
      const err = new NetworkError("network fail");
      const result = await useApiRequest(Promise.reject(err), [NetworkError]);
      expect(result).toEqual([err]);
    });

    it("returns [error] when the error matches one of multiple caught classes", async () => {
      const err = new ValidationError("invalid");
      const result = await useApiRequest(Promise.reject(err), [NetworkError, ValidationError]);
      expect(result).toEqual([err]);
    });
  });

  // ─── Error — non-matching errorsToCatch ───────────────────────────────────

  describe("on rejection with non-matching errorsToCatch", () => {
    it("re-throws when the error does not match any caught class", async () => {
      const err = new NetworkError("network fail");
      await expect(useApiRequest(Promise.reject(err), [ValidationError])).rejects.toThrow(err);
    });

    it("re-throws a base Error when only a subclass is caught", async () => {
      const err = new Error("plain error");
      await expect(useApiRequest(Promise.reject(err), [NetworkError])).rejects.toThrow(err);
    });
  });
});
