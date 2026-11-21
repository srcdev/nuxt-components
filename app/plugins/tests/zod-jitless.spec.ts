import { describe, it, expect } from "vitest";
import { config, z } from "zod";

describe("zod-jitless plugin", () => {
  it("leaves zod in jitless mode once the app has started", () => {
    expect(config().jitless).toBe(true);
  });

  it("still validates objects without the compiled fast path", () => {
    const schema = z.object({ name: z.string().min(2) });
    expect(schema.safeParse({ name: "Al" }).success).toBe(true);
    expect(schema.safeParse({ name: "A" }).success).toBe(false);
  });
});
