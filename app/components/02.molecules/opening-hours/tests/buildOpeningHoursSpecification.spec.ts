import { describe, it, expect } from "vitest";
import { buildOpeningHoursSpecification, resolveOpeningStatus } from "~/utils/opening-hours";

describe("resolveOpeningStatus", () => {
  it("defaults to open with sessions and closed without", () => {
    expect(resolveOpeningStatus({ sessions: [{ opens: "09:00", closes: "17:00" }] })).toBe("open");
    expect(resolveOpeningStatus({})).toBe("closed");
    expect(resolveOpeningStatus({ status: "by-appointment" })).toBe("by-appointment");
  });
});

describe("buildOpeningHoursSpecification", () => {
  it("emits one spec per session and skips closed and by-appointment days", () => {
    const specs = buildOpeningHoursSpecification([
      {
        day: 0,
        sessions: [
          { opens: "12:00", closes: "14:30" },
          { opens: "18:00", closes: "22:00" },
        ],
      },
      { day: 1, status: "24-hours" },
      { day: 2 },
      { day: 3, status: "by-appointment" },
    ]);
    expect(specs).toEqual([
      { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Monday", opens: "12:00", closes: "14:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Monday", opens: "18:00", closes: "22:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Tuesday", opens: "00:00", closes: "23:59" },
    ]);
  });

  it("marks closed exceptions with equal opens and closes", () => {
    expect(buildOpeningHoursSpecification([], [{ from: "2026-12-25", to: "2026-12-26" }])).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        validFrom: "2026-12-25",
        validThrough: "2026-12-26",
        opens: "00:00",
        closes: "00:00",
      },
    ]);
  });

  it("uses from as validThrough for single-day exceptions", () => {
    const [spec] = buildOpeningHoursSpecification(
      [],
      [{ from: "2026-12-31", sessions: [{ opens: "10:00", closes: "14:00" }] }]
    );
    expect(spec).toMatchObject({ validFrom: "2026-12-31", validThrough: "2026-12-31", opens: "10:00" });
  });
});
