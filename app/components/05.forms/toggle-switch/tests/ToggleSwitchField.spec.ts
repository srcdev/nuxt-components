// https://nuxt.com/docs/getting-started/testing#unit-testing
import { defineComponent, nextTick, ref } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../ToggleSwitchField.vue";

const initialPropsData = {
  name: "notifications",
  label: "Enable notifications",
  modelValue: false,
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}, slots = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };

  return mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: mockPropsData,
    slots,
  });
};

afterEach(() => {
  wrapper?.unmount();
  vi.restoreAllMocks();
});

describe("ToggleSwitchField", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders .toggle-switch-field as the root with the stacked layout by default", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.classes()).toContain("toggle-switch-field");
    expect(wrapper.attributes("data-layout")).toBe("stacked");
  });

  it("renders the label text, linked to the switch", async () => {
    wrapper = await wrapperFactory();
    const label = wrapper.find("label");

    expect(label.text()).toContain("Enable notifications");
    expect(label.classes()).toContain("toggle-switch-label");
    expect(label.attributes("for")).toBe(wrapper.find("input[type='checkbox']").attributes("id"));
  });

  it("uses a bold label when stacked and a normal one when inline, unless labelWeight is set", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("label").classes()).toContain("body-normal-bold");

    await wrapper.setProps({ layout: "inline" });
    expect(wrapper.attributes("data-layout")).toBe("inline");
    expect(wrapper.find("label").classes()).toContain("body-normal");

    await wrapper.setProps({ labelWeight: "semi-bold" });
    expect(wrapper.find("label").classes()).toContain("body-normal-semibold");
  });

  it("keeps the label, description, switch, error DOM order in both layouts", async () => {
    for (const layout of ["stacked", "inline"]) {
      wrapper = await wrapperFactory(
        { layout, fieldHasError: true, errorMessage: "Required" },
        { descriptionText: () => "Sends at most one email a week." }
      );
      const html = wrapper.html();
      const order = ["<label", "Sends at most one email", "<input", "Required"].map((marker) => html.indexOf(marker));

      expect(order).toEqual([...order].sort((a, b) => a - b));
      wrapper.unmount();
    }
  });

  it("renders the error message and sets data-invalid when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, errorMessage: "Please choose" });

    expect(wrapper.text()).toContain("Please choose");
    expect(wrapper.attributes("data-invalid")).toBe("");
    expect(wrapper.attributes("data-theme")).toBe("error");
    expect(wrapper.find(".toggle-switch").attributes("data-theme")).toBe("error");
  });

  it("renders descriptionText and descriptionHtml through InputDescription", async () => {
    wrapper = await wrapperFactory({}, { descriptionText: () => "Plain hint" });
    expect(wrapper.find(".toggle-switch-description").text()).toContain("Plain hint");
    wrapper.unmount();

    wrapper = await wrapperFactory({}, { descriptionHtml: () => "Rich hint" });
    expect(wrapper.find(".toggle-switch-description").text()).toContain("Rich hint");
  });

  it("renders no description element without a description slot", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find(".toggle-switch-description").exists()).toBe(false);
  });

  it("forwards required to the underlying input", async () => {
    wrapper = await wrapperFactory({ required: true });
    expect(wrapper.find("input").attributes("required")).toBeDefined();
  });

  it("applies styleClassPassthrough to its root only and reacts to changes", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: ["custom-toggle"] });
    expect(wrapper.classes()).toContain("custom-toggle");
    expect(wrapper.find(".toggle-switch").classes()).not.toContain("custom-toggle");

    await wrapper.setProps({ styleClassPassthrough: ["other-toggle"] });
    await nextTick();
    expect(wrapper.classes()).toContain("other-toggle");
  });

  it("forwards round to ToggleSwitch without leaking it as a DOM attribute", async () => {
    wrapper = await wrapperFactory({ round: false });
    const toggle = wrapper.findComponent({ name: "ToggleSwitch" });

    expect(toggle.props("round")).toBe(false);
    expect(wrapper.find(".toggle-switch").attributes("round")).toBeUndefined();
  });

  it("points aria-describedby at the description once it appears after mount", async () => {
    const Host = defineComponent({
      components: { ComponentUnderTest },
      setup() {
        return { modelValue: ref(false), showDescription: ref(false) };
      },
      template: `
        <ComponentUnderTest v-model="modelValue" name="notifications" label="Enable notifications">
          <template v-if="showDescription" #descriptionText>Sends at most one email a week.</template>
        </ComponentUnderTest>
      `,
    });
    const host = await mountSuspended(Host);
    const input = () => host.find("input[type='checkbox']");
    expect(input().attributes("aria-describedby")).toBeFalsy();
    (host.vm as unknown as { showDescription: boolean }).showDescription = true;
    await nextTick();
    expect(input().attributes("aria-describedby")).toMatch(/-description$/);
    host.unmount();
  });

  it("points aria-describedby at both the description and the error when both are present", async () => {
    wrapper = await wrapperFactory(
      { fieldHasError: true, errorMessage: "Required" },
      { descriptionText: () => "Sends at most one email a week." }
    );
    const ids = (wrapper.find("input[type='checkbox']").attributes("aria-describedby") ?? "").split(" ");

    expect(ids).toHaveLength(2);
    expect(ids[0]).toMatch(/-description$/);
    expect(ids[1]).toMatch(/-error-message$/);
    expect(wrapper.find(`[id="${ids[0]}"]`).exists()).toBe(true);
  });
});
