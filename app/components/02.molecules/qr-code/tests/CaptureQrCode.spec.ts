import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import CaptureQrCode from "../CaptureQrCode.vue";

interface CaptureVM {
  state: { error: boolean; errorMsg: string; cameraOn: boolean };
  result: string[] | undefined;
  onDetect: (codes: { rawValue: string }[]) => void;
  onError: (err: Error) => void;
  resetCamera: () => void;
}

describe("CaptureQrCode", () => {
  // QrcodeStream (from nuxt-qrcode) runs canvas-based detection internally.
  // jsdom defines HTMLCanvasElement but returns null for getContext, which
  // causes the library to throw. We provide a minimal non-null mock.
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders as a div", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("always has the capture-qr-stream class", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    expect(wrapper.classes()).toContain("capture-qr-stream");
  });

  // ─── Initial state ────────────────────────────────────────────────────────

  it("has camera on by default", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    const vm = wrapper.vm as unknown as CaptureVM;
    expect(vm.state.cameraOn).toBe(true);
  });

  it("does not show camera-stopped on mount", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    expect(wrapper.find(".camera-stopped").exists()).toBe(false);
  });

  it("does not show scanned results initially", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    expect(wrapper.find(".scanned-results").exists()).toBe(false);
  });

  it("does not show the error state initially", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    expect(wrapper.find(".camera-error").exists()).toBe(false);
  });

  // ─── Camera off ───────────────────────────────────────────────────────────

  it("hides the stream and shows camera-stopped when cameraOn is false", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.state.cameraOn = false;
    await nextTick();
    expect(vm.state.cameraOn).toBe(false);
    expect(wrapper.find(".camera-stopped").exists()).toBe(true);
  });

  // ─── Error state ──────────────────────────────────────────────────────────

  it("shows camera-error when onError is called", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onError(new Error("Permission denied"));
    await nextTick();
    expect(wrapper.find(".camera-error").exists()).toBe(true);
  });

  it("shows the error message in the error state", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onError(new Error("Permission denied"));
    await nextTick();
    expect(wrapper.find(".camera-error p").text()).toContain("Permission denied");
  });

  it("sets state.error when onError is called, hiding the stream", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onError(new Error("test"));
    await nextTick();
    expect(vm.state.error).toBe(true);
    expect(wrapper.find(".camera-error").exists()).toBe(true);
  });

  it("shows a reset button in the error state", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onError(new Error("test"));
    await nextTick();
    expect(wrapper.find(".camera-error button").exists()).toBe(true);
  });

  // ─── Reset camera ─────────────────────────────────────────────────────────

  it("clears the error state when resetCamera is called", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onError(new Error("test"));
    await nextTick();
    vm.resetCamera();
    await nextTick();
    expect(wrapper.find(".camera-error").exists()).toBe(false);
    expect(vm.state.cameraOn).toBe(true);
  });

  it("clears the error state when the reset button is clicked", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onError(new Error("test"));
    await nextTick();
    await wrapper.find(".camera-error button").trigger("click");
    expect(wrapper.find(".camera-error").exists()).toBe(false);
  });

  // ─── Detect ───────────────────────────────────────────────────────────────

  it("shows scanned results after onDetect is called", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onDetect([{ rawValue: "https://example.com" }]);
    await nextTick();
    expect(wrapper.find(".scanned-results").exists()).toBe(true);
  });

  it("shows the detected value in the results list", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onDetect([{ rawValue: "https://example.com" }]);
    await nextTick();
    expect(wrapper.find(".scanned-results").text()).toContain("https://example.com");
  });

  it("shows all detected values when multiple codes are scanned", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onDetect([{ rawValue: "https://one.com" }, { rawValue: "https://two.com" }]);
    await nextTick();
    const items = wrapper.findAll(".scanned-results li");
    expect(items).toHaveLength(2);
    expect(items[0]!.text()).toBe("https://one.com");
    expect(items[1]!.text()).toBe("https://two.com");
  });

  it("replaces results on subsequent scans", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onDetect([{ rawValue: "first" }]);
    await nextTick();
    vm.onDetect([{ rawValue: "second" }]);
    await nextTick();
    const items = wrapper.findAll(".scanned-results li");
    expect(items).toHaveLength(1);
    expect(items[0]!.text()).toBe("second");
  });

  // ─── Visibility change ────────────────────────────────────────────────────

  it("stops the camera when the page becomes hidden", async () => {
    const wrapper = await mountSuspended(CaptureQrCode);
    Object.defineProperty(document, "hidden", { get: () => true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    await nextTick();
    expect(wrapper.find("qrcodestream").exists()).toBe(false);
    Object.defineProperty(document, "hidden", { get: () => false, configurable: true });
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(CaptureQrCode, {
      props: { styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(CaptureQrCode, {
      props: { styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("retains capture-qr-stream class alongside styleClassPassthrough", async () => {
    const wrapper = await mountSuspended(CaptureQrCode, {
      props: { styleClassPassthrough: "extra" },
    });
    expect(wrapper.classes()).toContain("capture-qr-stream");
    expect(wrapper.classes()).toContain("extra");
  });
});
