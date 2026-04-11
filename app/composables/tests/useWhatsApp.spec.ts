import { describe, it, expect, beforeEach, afterEach, vi, type MockInstance } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useWhatsApp } from "../useWhatsApp";

const PHONE_NUMBER = "447700900000";

// mockNuxtImport intercepts Nuxt's auto-import resolution — vi.stubGlobal cannot.
// Use vi.hoisted so the mock function is available before module evaluation.
const { useRuntimeConfigMock } = vi.hoisted(() => ({
  useRuntimeConfigMock: vi.fn(() => ({ public: { whatsappNumber: PHONE_NUMBER } })),
}));

mockNuxtImport("useRuntimeConfig", () => useRuntimeConfigMock);

describe("useWhatsApp", () => {
  let windowOpenSpy: MockInstance<typeof window.open>;

  beforeEach(() => {
    windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    useRuntimeConfigMock.mockReturnValue({ public: { whatsappNumber: PHONE_NUMBER } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── openWhatsApp ─────────────────────────────────────────────────────────

  describe("openWhatsApp", () => {
    it("opens a wa.me URL with the configured number", () => {
      const { openWhatsApp } = useWhatsApp();
      openWhatsApp([{ label: "Name", value: "Jane" }]);
      expect(windowOpenSpy).toHaveBeenCalledOnce();
      const url = windowOpenSpy.mock.calls[0]![0] as string;
      expect(url).toContain(`https://wa.me/${PHONE_NUMBER}`);
    });

    it("opens with _blank target and noopener,noreferrer", () => {
      const { openWhatsApp } = useWhatsApp();
      openWhatsApp([{ label: "Name", value: "Jane" }]);
      expect(windowOpenSpy).toHaveBeenCalledWith(expect.any(String), "_blank", "noopener,noreferrer");
    });

    it("formats fields as bold labels in the message", () => {
      const { openWhatsApp } = useWhatsApp();
      openWhatsApp([
        { label: "Name", value: "Jane Smith" },
        { label: "Phone", value: "07700900000" },
      ]);
      const url = windowOpenSpy.mock.calls[0]![0] as string;
      const message = decodeURIComponent(url.split("?text=")[1]!);
      expect(message).toBe("*Name:* Jane Smith\n*Phone:* 07700900000");
    });

    it("URL-encodes the message", () => {
      const { openWhatsApp } = useWhatsApp();
      openWhatsApp([{ label: "Name", value: "Jane Smith" }]);
      const url = windowOpenSpy.mock.calls[0]![0] as string;
      expect(url).toContain("?text=");
      expect(url).not.toContain(" "); // spaces must be encoded
    });

    it("filters out fields with empty values", () => {
      const { openWhatsApp } = useWhatsApp();
      openWhatsApp([
        { label: "Name", value: "Jane" },
        { label: "Comments", value: "" },
        { label: "Phone", value: "07700900000" },
      ]);
      const url = windowOpenSpy.mock.calls[0]![0] as string;
      const message = decodeURIComponent(url.split("?text=")[1]!);
      expect(message).not.toContain("Comments");
      expect(message).toBe("*Name:* Jane\n*Phone:* 07700900000");
    });

    it("filters out fields with whitespace-only values", () => {
      const { openWhatsApp } = useWhatsApp();
      openWhatsApp([
        { label: "Name", value: "Jane" },
        { label: "Comments", value: "   " },
      ]);
      const url = windowOpenSpy.mock.calls[0]![0] as string;
      const message = decodeURIComponent(url.split("?text=")[1]!);
      expect(message).toBe("*Name:* Jane");
    });

    it("does not call window.open when number is not configured", () => {
      useRuntimeConfigMock.mockReturnValue({ public: { whatsappNumber: "" } });
      const { openWhatsApp } = useWhatsApp();
      openWhatsApp([{ label: "Name", value: "Jane" }]);
      expect(windowOpenSpy).not.toHaveBeenCalled();
    });

    it("logs a warning when number is not configured", () => {
      useRuntimeConfigMock.mockReturnValue({ public: { whatsappNumber: "" } });
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { openWhatsApp } = useWhatsApp();
      openWhatsApp([{ label: "Name", value: "Jane" }]);
      expect(warnSpy).toHaveBeenCalledWith("[useWhatsApp] whatsappNumber is not configured");
    });
  });
});
