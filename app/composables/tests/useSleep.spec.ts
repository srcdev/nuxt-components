import { describe, it, expect } from "vitest";
import useSleep from "../useSleep";

describe("useSleep", () => {
  it("returns a Promise", () => {
    const result = useSleep(100);
    expect(result).toBeInstanceOf(Promise);
  });

  it("resolves with true after the given duration", async () => {
    const promise = useSleep(500);
    await vi.advanceTimersByTimeAsync(500);
    await expect(promise).resolves.toBe(true);
  });

  it("does not resolve before the duration elapses", async () => {
    let resolved = false;
    useSleep(1000).then(() => {
      resolved = true;
    });
    await vi.advanceTimersByTimeAsync(999);
    expect(resolved).toBe(false);
  });

  it("resolves immediately after the exact duration", async () => {
    let resolved = false;
    useSleep(1000).then(() => {
      resolved = true;
    });
    await vi.advanceTimersByTimeAsync(1000);
    expect(resolved).toBe(true);
  });
});
