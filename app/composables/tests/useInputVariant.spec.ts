import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { nextTick, ref } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import type { InputUiVariant } from "~/types/forms/types.forms";
import { useInputVariant } from "../useInputVariant";
import InputTextField from "../../components/05.forms/input-text/InputTextField.vue";

const { useAppConfigMock } = vi.hoisted(() => ({
  useAppConfigMock: vi.fn(() => ({ srcdev: undefined as Record<string, unknown> | undefined })),
}));

// Merge over the real app config so modules that read it during setup (@nuxt/icon) keep their keys.
mockNuxtImport("useAppConfig", (original) => () => ({ ...original(), ...useAppConfigMock() }));

let wrapper: VueWrapper | undefined;

beforeEach(() => {
  useAppConfigMock.mockReturnValue({ srcdev: undefined });
});

afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
  vi.restoreAllMocks();
});

describe("useInputVariant", () => {
  it("falls back to normal when neither the prop nor app.config sets one", () => {
    expect(useInputVariant(undefined).value).toBe("normal");
  });

  it("uses the app.config default when the prop is unset", () => {
    useAppConfigMock.mockReturnValue({ srcdev: { forms: { inputVariant: "outlined" } } });
    expect(useInputVariant(undefined).value).toBe("outlined");
  });

  it("lets an explicit prop win over app.config, and follows it reactively", async () => {
    useAppConfigMock.mockReturnValue({ srcdev: { forms: { inputVariant: "outlined" } } });
    const prop = ref<InputUiVariant | undefined>("underlined");
    const variant = useInputVariant(prop);
    expect(variant.value).toBe("underlined");

    prop.value = undefined;
    await nextTick();
    expect(variant.value).toBe("outlined");
  });

  it("reaches a field and its children from app.config alone", async () => {
    useAppConfigMock.mockReturnValue({ srcdev: { forms: { inputVariant: "outlined" } } });
    wrapper = await mountSuspended(InputTextField, {
      props: { type: "text", name: "fullName", label: "Full name", errorMessage: "", modelValue: "" },
    });

    expect(wrapper.attributes("data-input-variant")).toBe("outlined");
    expect(wrapper.find(".input-text-wrapper").attributes("data-input-variant")).toBe("outlined");
    expect(wrapper.find(".input-label").attributes("data-input-variant")).toBe("outlined");
  });
});
