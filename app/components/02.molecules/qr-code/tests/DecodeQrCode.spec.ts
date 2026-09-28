import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import DecodeQrCode from "../DecodeQrCode.vue";

interface DecodeVM {
  result: string[] | undefined;
  isDropping: boolean;
  onDetect: (codes: { rawValue: string }[]) => void;
  onDropping: (dropping: boolean) => void;
}

describe("DecodeQrCode", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders as a div", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("always has the decode-qr-code class", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    expect(wrapper.classes()).toContain("decode-qr-code");
  });

  // ─── Initial DOM structure ─────────────────────────────────────────────────

  it("renders the file capture element", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    expect(wrapper.find(".decode-qr-code-capture").exists()).toBe(true);
  });

  it("renders the drop zone element", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    expect(wrapper.find(".decode-qr-code-dropzone").exists()).toBe(true);
  });

  it("does not show scanned results initially", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    expect(wrapper.find(".decode-qr-code-results ul").exists()).toBe(false);
  });

  // ─── Detect ───────────────────────────────────────────────────────────────

  it("shows scanned results after onDetect is called", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    const vm = wrapper.vm as unknown as DecodeVM;
    vm.onDetect([{ rawValue: "https://example.com" }]);
    await nextTick();
    expect(wrapper.find(".decode-qr-code-results ul").exists()).toBe(true);
  });

  it("shows the detected value in the results list", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    const vm = wrapper.vm as unknown as DecodeVM;
    vm.onDetect([{ rawValue: "https://example.com" }]);
    await nextTick();
    expect(wrapper.find(".decode-qr-code-results").text()).toContain("https://example.com");
  });

  it("shows all detected values when multiple codes are decoded", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    const vm = wrapper.vm as unknown as DecodeVM;
    vm.onDetect([{ rawValue: "https://one.com" }, { rawValue: "https://two.com" }]);
    await nextTick();
    const items = wrapper.findAll(".decode-qr-code-results li");
    expect(items).toHaveLength(2);
    expect(items[0]!.text()).toBe("https://one.com");
    expect(items[1]!.text()).toBe("https://two.com");
  });

  it("replaces results on subsequent detections", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    const vm = wrapper.vm as unknown as DecodeVM;
    vm.onDetect([{ rawValue: "first" }]);
    await nextTick();
    vm.onDetect([{ rawValue: "second" }]);
    await nextTick();
    const items = wrapper.findAll(".decode-qr-code-results li");
    expect(items).toHaveLength(1);
    expect(items[0]!.text()).toBe("second");
  });

  it("hides results when detecting an empty array", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    const vm = wrapper.vm as unknown as DecodeVM;
    vm.onDetect([{ rawValue: "https://example.com" }]);
    await nextTick();
    vm.onDetect([]);
    await nextTick();
    expect(wrapper.find(".decode-qr-code-results ul").exists()).toBe(false);
  });

  // ─── Dropping state ───────────────────────────────────────────────────────

  it("sets isDropping to true when onDropping is called with true", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    const vm = wrapper.vm as unknown as DecodeVM;
    vm.onDropping(true);
    await nextTick();
    expect(vm.isDropping).toBe(true);
  });

  it("sets isDropping to false when onDropping is called with false", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    const vm = wrapper.vm as unknown as DecodeVM;
    vm.onDropping(true);
    await nextTick();
    vm.onDropping(false);
    await nextTick();
    expect(vm.isDropping).toBe(false);
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(DecodeQrCode, {
      props: { styleClassPassthrough: "custom-class" },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(DecodeQrCode, {
      props: { styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("retains decode-qr-code class alongside styleClassPassthrough", async () => {
    const wrapper = await mountSuspended(DecodeQrCode, {
      props: { styleClassPassthrough: "extra" },
    });
    expect(wrapper.classes()).toContain("decode-qr-code");
    expect(wrapper.classes()).toContain("extra");
  });
});

describe("DecodeQrCode labels, drop state and a11y", () => {
  it("wraps the file input in a label with the default upload text", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    const label = wrapper.find("label.decode-qr-code-upload");
    expect(label.text()).toContain("Upload a QR code image");
    expect(label.find(".decode-qr-code-capture").exists()).toBe(true);
  });

  it("uses uploadLabel and dropLabel when given", async () => {
    const wrapper = await mountSuspended(DecodeQrCode, {
      props: { uploadLabel: "Téléverser", dropLabel: "Déposer ici" },
    });
    expect(wrapper.find(".decode-qr-code-upload-label").text()).toBe("Téléverser");
    expect(wrapper.find(".decode-qr-code-dropzone-label").text()).toBe("Déposer ici");
  });

  it("adds is-dropping to the drop zone while an image is dragged over it", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    (wrapper.vm as unknown as DecodeVM).onDropping(true);
    await nextTick();
    expect(wrapper.find(".decode-qr-code-dropzone").classes()).toContain("is-dropping");
  });

  it("keeps a polite live region for results", async () => {
    const wrapper = await mountSuspended(DecodeQrCode);
    expect(wrapper.find(".decode-qr-code-results").attributes("aria-live")).toBe("polite");
  });

  it("updates classes when styleClassPassthrough changes after mount", async () => {
    const wrapper = await mountSuspended(DecodeQrCode, { props: { styleClassPassthrough: ["original"] } });
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
