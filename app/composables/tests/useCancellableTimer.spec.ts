import { describe, it, expect } from "vitest";
import { useCancellableTimer } from "../useCancellableTimer";

describe("useCancellableTimer", () => {
  describe("wait", () => {
    it("resolves after the specified duration", async () => {
      const { wait, start } = useCancellableTimer();
      start();

      let resolved = false;
      wait(200).then(() => {
        resolved = true;
      });

      expect(resolved).toBe(false);
      await vi.advanceTimersByTimeAsync(200);
      expect(resolved).toBe(true);
    });

    it("does not resolve before the duration elapses", async () => {
      const { wait, start } = useCancellableTimer();
      start();

      let resolved = false;
      wait(200).then(() => {
        resolved = true;
      });

      await vi.advanceTimersByTimeAsync(199);
      expect(resolved).toBe(false);
    });

    it("rejects immediately when not started", async () => {
      const { wait } = useCancellableTimer();

      let rejected = false;
      wait(200).catch(() => {
        rejected = true;
      });

      await Promise.resolve();
      expect(rejected).toBe(true);
    });

    it("rejects when stop is called before the timer fires", async () => {
      const { wait, start, stop } = useCancellableTimer();
      start();

      let rejected = false;
      wait(200).catch(() => {
        rejected = true;
      });

      stop();
      await Promise.resolve();
      expect(rejected).toBe(true);
    });
  });

  describe("schedule", () => {
    it("calls fn after the specified delay", async () => {
      const { schedule, start } = useCancellableTimer();
      start();

      const fn = vi.fn();
      schedule(fn, 100);

      expect(fn).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(100);
      expect(fn).toHaveBeenCalledOnce();
    });

    it("does not call fn when not started", async () => {
      const { schedule } = useCancellableTimer();

      const fn = vi.fn();
      schedule(fn, 100);

      await vi.advanceTimersByTimeAsync(100);
      expect(fn).not.toHaveBeenCalled();
    });

    it("does not call fn when stop is called before the delay fires", async () => {
      const { schedule, start, stop } = useCancellableTimer();
      start();

      const fn = vi.fn();
      schedule(fn, 100);

      stop();
      await vi.advanceTimersByTimeAsync(100);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("stop", () => {
    it("cancels a pending wait", async () => {
      const { wait, start, stop } = useCancellableTimer();
      start();

      let settled = false;
      wait(100).then(
        () => { settled = true; },
        () => { settled = true; },
      );

      stop();
      await Promise.resolve();
      expect(settled).toBe(true);
    });
  });

  describe("start / stop cycle", () => {
    it("can restart after stop", async () => {
      const { wait, start, stop } = useCancellableTimer();
      start();

      let firstRejected = false;
      wait(100).catch(() => {
        firstRejected = true;
      });
      stop();
      await Promise.resolve();
      expect(firstRejected).toBe(true);

      start();
      let secondResolved = false;
      wait(100).then(() => {
        secondResolved = true;
      });
      await vi.advanceTimersByTimeAsync(100);
      expect(secondResolved).toBe(true);
    });
  });
});
