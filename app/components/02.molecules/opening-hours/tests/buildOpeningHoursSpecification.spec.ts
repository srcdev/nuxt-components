import { describe, it, expect } from "vitest";
import {
  buildOpeningHoursSpecification,
  parseOpeningDate,
  parseOpeningTime,
  resolveOpeningStatus,
} from "~/utils/opening-hours";

describe("parseOpeningTime", () => {
  it("parses HH:MM and H:MM", () => {
    expect(parseOpeningTime("09:30")).toEqual({ hours: 9, minutes: 30 });
    expect(parseOpeningTime("9:05")).toEqual({ hours: 9, minutes: 5 });
    expect(parseOpeningTime("23:59")).toEqual({ hours: 23, minutes: 59 });
  });

  it("rejects malformed and out-of-range times", () => {
    for (const bad of ["", "abc", "9", "24:00", "25:99", "12:60", "12:3", "-1:00"]) {
      expect(parseOpeningTime(bad)).toBeNull();
    }
  });
});

describe("parseOpeningDate", () => {
  it("parses a real YYYY-MM-DD date as UTC midnight", () => {
    expect(parseOpeningDate("2026-02-28")?.toISOString()).toBe("2026-02-28T00:00:00.000Z");
  });

  it("rejects malformed and impossible dates", () => {
    for (const bad of ["", "not-a-date", "2026-13-01", "2026-02-30", "26-01-01", "2026-1-1"]) {
      expect(parseOpeningDate(bad)).toBeNull();
    }
  });
});

describe("resolveOpeningStatus", () => {
  it("defaults to open with sessions and closed without", () => {
    expect(resolveOpeningStatus({ sessions: [{ opens: "09:00", closes: "17:00" }] })).toBe("open");
    expect(resolveOpeningStatus({})).toBe("closed");
    expect(resolveOpeningStatus({ status: "by-appointment" })).toBe("by-appointment");
  });

  it("treats open with no sessions as closed", () => {
    expect(resolveOpeningStatus({ status: "open" })).toBe("closed");
    expect(resolveOpeningStatus({ status: "open", sessions: [] })).toBe("closed");
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
