import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayQrCode from "../DisplayQrCode.vue";
import type { QrCodeVariant } from "~/types/components";

const defaultProps = {
  qrValue: "https://example.com",
};

describe("DisplayQrCode", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, { props: defaultProps });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders a single root element", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, { props: defaultProps });
    expect(wrapper.element).toBeTruthy();
  });

  it("always has the display-qr-code class", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, { props: defaultProps });
    expect(wrapper.classes()).toContain("display-qr-code");
  });

  // ─── Default props ────────────────────────────────────────────────────────

  it("defaults radius to 0", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, { props: defaultProps });
    interface VM { radius: number }
    expect((wrapper.vm as unknown as VM).radius).toBe(0);
  });

  it("defaults blackColor to currentColor", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, { props: defaultProps });
    interface VM { blackColor: string }
    expect((wrapper.vm as unknown as VM).blackColor).toBe("currentColor");
  });

  it("defaults whiteColor to transparent", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, { props: defaultProps });
    interface VM { whiteColor: string }
    expect((wrapper.vm as unknown as VM).whiteColor).toBe("transparent");
  });

  it("defaults size to 256px", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, { props: defaultProps });
    interface VM { size: string }
    expect((wrapper.vm as unknown as VM).size).toBe("256px");
  });

  it("defaults variant to all-default", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, { props: defaultProps });
    interface VM { variant: QrCodeVariant }
    expect((wrapper.vm as unknown as VM).variant).toEqual({ inner: "default", marker: "default", pixel: "default" });
  });

  // ─── Custom props ─────────────────────────────────────────────────────────

  it("reflects a custom radius prop", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, {
      props: { ...defaultProps, radius: 12 },
    });
    interface VM { radius: number }
    expect((wrapper.vm as unknown as VM).radius).toBe(12);
  });

  it("reflects a custom blackColor prop", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, {
      props: { ...defaultProps, blackColor: "#ff0000" },
    });
    interface VM { blackColor: string }
    expect((wrapper.vm as unknown as VM).blackColor).toBe("#ff0000");
  });

  it("reflects a custom whiteColor prop", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, {
      props: { ...defaultProps, whiteColor: "#ffffff" },
    });
    interface VM { whiteColor: string }
    expect((wrapper.vm as unknown as VM).whiteColor).toBe("#ffffff");
  });

  it("reflects a custom size prop", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, {
      props: { ...defaultProps, size: "128px" },
    });
    interface VM { size: string }
    expect((wrapper.vm as unknown as VM).size).toBe("128px");
  });

  it("reflects a custom variant prop", async () => {
    const variant: QrCodeVariant = { inner: "circle", marker: "rounded", pixel: "dots" };
    const wrapper = await mountSuspended(DisplayQrCode, {
      props: { ...defaultProps, variant },
    });
    interface VM { variant: QrCodeVariant }
    expect((wrapper.vm as unknown as VM).variant).toEqual(variant);
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, {
      props: { ...defaultProps, styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, {
      props: { ...defaultProps, styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("retains display-qr-code class alongside styleClassPassthrough", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, {
      props: { ...defaultProps, styleClassPassthrough: "extra" },
    });
    expect(wrapper.classes()).toContain("display-qr-code");
    expect(wrapper.classes()).toContain("extra");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(DisplayQrCode, {
      props: { ...defaultProps, styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
