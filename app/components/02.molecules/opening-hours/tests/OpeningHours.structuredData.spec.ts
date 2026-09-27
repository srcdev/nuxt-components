import { describe, it, expect, beforeEach, vi } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import { unref } from "vue";
import OpeningHours from "../OpeningHours.vue";

const { useHeadMock } = vi.hoisted(() => ({ useHeadMock: vi.fn() }));
mockNuxtImport("useHead", () => useHeadMock);

const days = [{ day: 0 as const, sessions: [{ opens: "09:00", closes: "17:30" }] }];

describe("OpeningHours structured data", () => {
  beforeEach(() => {
    useHeadMock.mockClear();
  });

  it("does not call useHead without structuredData", async () => {
    await mountSuspended(OpeningHours, { props: { days } });
    expect(useHeadMock).not.toHaveBeenCalled();
  });

  it("emits escaped LocalBusiness JSON-LD with opening hours", async () => {
    await mountSuspended(OpeningHours, {
      props: {
        days,
        exceptions: [{ from: "2026-12-25" }],
        structuredData: { type: "HairSalon", name: "Salon </script>", id: "https://example.com/#business" },
      },
    });

    const script = useHeadMock.mock.calls[0]![0].script[0];
    expect(script.type).toBe("application/ld+json");

    const raw = unref(script.innerHTML) as string;
    expect(raw).not.toContain("</script>");

    const json = JSON.parse(raw);
    expect(json).toMatchObject({
      "@context": "https://schema.org",
      "@type": "HairSalon",
      "@id": "https://example.com/#business",
      name: "Salon </script>",
    });
    expect(json.openingHoursSpecification).toHaveLength(2);
  });
});
