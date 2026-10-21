import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import CaptureQrCode from "../CaptureQrCode.vue";

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

type CaptureMountOptions = Parameters<typeof mountSuspended<typeof CaptureQrCode>>[1];

// The real QrcodeStream queues camera start/stop on a module-level promise chain shared by every
// instance, so a start left over from an earlier test can fail mid-test and flip state.error.
const qrcodeStreamStub = { name: "QrcodeStream", emits: ["detect", "error"], template: `<div class="qrcode-stream-stub"></div>` };

const mountCapture = async (options: CaptureMountOptions = {}) => {
  const wrapper = await mountSuspended(CaptureQrCode, {
    ...options,
    global: { ...options?.global, stubs: { QrcodeStream: qrcodeStreamStub, ...options?.global?.stubs } },
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

interface CaptureVM {
  state: { error: boolean; errorMsg: string; cameraOn: boolean };
  result: string[] | undefined;
  onDetect: (codes: { rawValue: string }[]) => void;
  onError: (err: Error) => void;
  resetCamera: () => void;
}

describe("CaptureQrCode", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountCapture();
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders as a div", async () => {
    const wrapper = await mountCapture();
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("always has the capture-qr-code class", async () => {
    const wrapper = await mountCapture();
    expect(wrapper.classes()).toContain("capture-qr-code");
  });

  // ─── Initial state ────────────────────────────────────────────────────────

  it("has camera on by default", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    expect(vm.state.cameraOn).toBe(true);
  });

  it("does not show camera-stopped on mount", async () => {
    const wrapper = await mountCapture();
    expect(wrapper.find(".capture-qr-code-stopped").exists()).toBe(false);
  });

  it("does not show scanned results initially", async () => {
    const wrapper = await mountCapture();
    expect(wrapper.find(".capture-qr-code-results ul").exists()).toBe(false);
  });

  it("does not show the error state initially", async () => {
    const wrapper = await mountCapture();
    expect(wrapper.find(".capture-qr-code-error").exists()).toBe(false);
  });

  // ─── Camera off ───────────────────────────────────────────────────────────

  it("hides the stream and shows camera-stopped when cameraOn is false", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.state.cameraOn = false;
    await nextTick();
    expect(vm.state.cameraOn).toBe(false);
    expect(wrapper.find(".capture-qr-code-stopped").exists()).toBe(true);
  });

  // ─── Error state ──────────────────────────────────────────────────────────

  it("shows camera-error when onError is called", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onError(new Error("Permission denied"));
    await nextTick();
    expect(wrapper.find(".capture-qr-code-error").exists()).toBe(true);
  });

  it("shows a plain-language message for a known error", async () => {
    const wrapper = await mountCapture();
    const err = new Error("Permission denied");
    err.name = "NotAllowedError";
    (wrapper.vm as unknown as CaptureVM).onError(err);
    await nextTick();
    expect(wrapper.find(".capture-qr-code-error-message").text()).toBe(
      "Camera access was blocked. Allow it in your browser settings, then try again."
    );
  });

  it("falls back to the default message for an unknown error", async () => {
    const wrapper = await mountCapture();
    (wrapper.vm as unknown as CaptureVM).onError(new Error("Something odd"));
    await nextTick();
    expect(wrapper.find(".capture-qr-code-error-message").text()).toBe("The camera couldn't be started. Try again.");
  });

  it("uses errorMessages overrides, per error and as the default", async () => {
    const wrapper = await mountCapture({
      props: { errorMessages: { NotFoundError: "Aucune caméra", default: "Erreur" } },
    });
    const vm = wrapper.vm as unknown as CaptureVM;
    const notFound = new Error("x");
    notFound.name = "NotFoundError";
    vm.onError(notFound);
    await nextTick();
    expect(wrapper.find(".capture-qr-code-error-message").text()).toBe("Aucune caméra");

    vm.onError(new Error("unknown"));
    await nextTick();
    expect(wrapper.find(".capture-qr-code-error-message").text()).toBe("Erreur");
  });

  it("sets state.error when onError is called, hiding the stream", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onError(new Error("test"));
    await nextTick();
    expect(vm.state.error).toBe(true);
    expect(wrapper.find(".capture-qr-code-error").exists()).toBe(true);
  });

  it("shows a reset button in the error state", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onError(new Error("test"));
    await nextTick();
    expect(wrapper.find(".capture-qr-code-error button").exists()).toBe(true);
  });

  // ─── Reset camera ─────────────────────────────────────────────────────────

  it("clears the error state when resetCamera is called", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onError(new Error("test"));
    await nextTick();
    vm.resetCamera();
    await nextTick();
    expect(wrapper.find(".capture-qr-code-error").exists()).toBe(false);
    expect(vm.state.cameraOn).toBe(true);
  });

  it("clears the error state when the reset button is clicked", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onError(new Error("test"));
    await nextTick();
    await wrapper.find(".capture-qr-code-error button").trigger("click");
    expect(wrapper.find(".capture-qr-code-error").exists()).toBe(false);
  });

  // ─── Detect ───────────────────────────────────────────────────────────────

  it("shows scanned results after onDetect is called", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onDetect([{ rawValue: "https://example.com" }]);
    await nextTick();
    expect(wrapper.find(".capture-qr-code-results ul").exists()).toBe(true);
  });

  it("shows the detected value in the results list", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onDetect([{ rawValue: "https://example.com" }]);
    await nextTick();
    expect(wrapper.find(".capture-qr-code-results").text()).toContain("https://example.com");
  });

  it("shows all detected values when multiple codes are scanned", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onDetect([{ rawValue: "https://one.com" }, { rawValue: "https://two.com" }]);
    await nextTick();
    const items = wrapper.findAll(".capture-qr-code-results li");
    expect(items).toHaveLength(2);
    expect(items[0]!.text()).toBe("https://one.com");
    expect(items[1]!.text()).toBe("https://two.com");
  });

  it("replaces results on subsequent scans", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onDetect([{ rawValue: "first" }]);
    await nextTick();
    vm.onDetect([{ rawValue: "second" }]);
    await nextTick();
    const items = wrapper.findAll(".capture-qr-code-results li");
    expect(items).toHaveLength(1);
    expect(items[0]!.text()).toBe("second");
  });

  // ─── Visibility change ────────────────────────────────────────────────────

  it("stops the camera when the page becomes hidden", async () => {
    const wrapper = await mountCapture();
    expect(wrapper.find(".qrcode-stream-stub").exists()).toBe(true);
    Object.defineProperty(document, "hidden", { get: () => true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    await nextTick();
    expect(wrapper.find(".qrcode-stream-stub").exists()).toBe(false);
    Object.defineProperty(document, "hidden", { get: () => false, configurable: true });
  });

  it("turns the camera back on when the page becomes visible again", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    Object.defineProperty(document, "hidden", { get: () => true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    await nextTick();
    expect(vm.state.cameraOn).toBe(false);

    Object.defineProperty(document, "hidden", { get: () => false, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    await nextTick();
    expect(vm.state.cameraOn).toBe(true);
  });

  it("stays in the error state when the page becomes visible again", async () => {
    const wrapper = await mountCapture();
    const vm = wrapper.vm as unknown as CaptureVM;
    vm.onError(new Error("test"));
    Object.defineProperty(document, "hidden", { get: () => true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    Object.defineProperty(document, "hidden", { get: () => false, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    await nextTick();
    expect(wrapper.find(".capture-qr-code-error").exists()).toBe(true);
  });

  it("only stops camera streams inside its own root", async () => {
    const outside = document.createElement("video");
    const stop = vi.fn();
    Object.defineProperty(outside, "srcObject", {
      value: { getTracks: () => [{ stop }] },
      writable: true,
      configurable: true,
    });
    document.body.appendChild(outside);

    const wrapper = await mountCapture();
    wrapper.unmount();
    mounted.splice(mounted.indexOf(wrapper), 1);
    expect(stop).not.toHaveBeenCalled();
    outside.remove();
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountCapture({
      props: { styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountCapture({
      props: { styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("retains capture-qr-code class alongside styleClassPassthrough", async () => {
    const wrapper = await mountCapture({
      props: { styleClassPassthrough: "extra" },
    });
    expect(wrapper.classes()).toContain("capture-qr-code");
    expect(wrapper.classes()).toContain("extra");
  });
});

describe("CaptureQrCode labels and a11y", () => {
  it("uses cameraStoppedLabel for the stopped message", async () => {
    const wrapper = await mountCapture({ props: { cameraStoppedLabel: "Caméra arrêtée" } });
    (wrapper.vm as unknown as CaptureVM).state.cameraOn = false;
    await nextTick();
    expect(wrapper.find(".capture-qr-code-stopped").text()).toBe("Caméra arrêtée");
  });

  it("uses resetCameraLabel for the reset button and marks the error as an alert", async () => {
    const wrapper = await mountCapture({ props: { resetCameraLabel: "Réinitialiser" } });
    (wrapper.vm as unknown as CaptureVM).onError(new Error("test"));
    await nextTick();
    expect(wrapper.find(".capture-qr-code-error").attributes("role")).toBe("alert");
    expect(wrapper.find(".capture-qr-code-error button").text()).toContain("Réinitialiser");
  });

  it("lets the error slot replace the default error content", async () => {
    const wrapper = await mountCapture({
      slots: { error: ({ error }: { error: string }) => `Custom: ${error}` },
    });
    const err = new Error("denied");
    err.name = "NotAllowedError";
    (wrapper.vm as unknown as CaptureVM).onError(err);
    await nextTick();
    expect(wrapper.find(".capture-qr-code-error").text()).toBe("Custom: NotAllowedError");
  });

  it("keeps a polite live region for results", async () => {
    const wrapper = await mountCapture();
    expect(wrapper.find(".capture-qr-code-results").attributes("aria-live")).toBe("polite");
  });

  it("updates classes when styleClassPassthrough changes after mount", async () => {
    const wrapper = await mountCapture({ props: { styleClassPassthrough: ["original"] } });
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
