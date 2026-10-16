// https://nuxt.com/docs/getting-started/testing#unit-testing
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputSelectField.vue";

const initialFieldData = {
  data: [
    { id: "1", name: "red", value: "red", label: "Red" },
    { id: "2", name: "blue", value: "blue", label: "Blue" },
  ],
  total: 2,
  skip: 0,
  limit: 10,
};

const initialPropsData = {
  name: "colour",
  label: "Colour",
  errorMessage: "",
  modelValue: "red",
  fieldData: initialFieldData,
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

describe("InputSelectField", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders .input-select-field as the root", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.classes()).toContain("input-select-field");
  });

  it("renders the label text, linked to the select", async () => {
    wrapper = await wrapperFactory({ label: "Favourite colour" });
    const label = wrapper.find("label");
    expect(label.text()).toContain("Favourite colour");
    expect(label.attributes("for")).toBe(wrapper.find("select").attributes("id"));
  });

  it("renders a native select with an option per fieldData item", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("select").exists()).toBe(true);
    expect(wrapper.findAll("option").map((o) => o.text())).toEqual(["Red", "Blue"]);
  });

  it("sets data-invalid on the root when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true });
    expect(wrapper.attributes("data-invalid")).toBe("");
  });

  it("renders the error message and links it via aria-describedby", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, errorMessage: "Please choose a colour" });
    expect(wrapper.text()).toContain("Please choose a colour");
    const describedBy = wrapper.find("select").attributes("aria-describedby") ?? "";
    expect(describedBy.length).toBeGreaterThan(0);
  });

  it("renders the descriptionText slot before the select by default", async () => {
    wrapper = await wrapperFactory({}, { descriptionText: () => "Pick your favourite" });
    const html = wrapper.html();
    expect(wrapper.text()).toContain("Pick your favourite");
    expect(html.indexOf("Pick your favourite")).toBeLessThan(html.indexOf("<select"));
  });

  it("renders the description after the select for the outlined variant", async () => {
    wrapper = await wrapperFactory({ inputVariant: "outlined" }, { descriptionText: () => "Pick your favourite" });
    const html = wrapper.html();
    expect(html.indexOf("Pick your favourite")).toBeGreaterThan(html.indexOf("<select"));
  });

  it("sets data-input-variant on the root", async () => {
    wrapper = await wrapperFactory({ inputVariant: "underlined" });
    expect(wrapper.attributes("data-input-variant")).toBe("underlined");
  });

  it("applies styleClassPassthrough to its root only and reacts to changes", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: "custom-select" });
    expect(wrapper.classes()).toContain("custom-select");
    expect(wrapper.find("select").classes()).not.toContain("custom-select");

    await wrapper.setProps({ styleClassPassthrough: "other-select" });
    await nextTick();
    expect(wrapper.classes()).toContain("other-select");
    expect(wrapper.classes()).not.toContain("custom-select");
  });

  it("forwards required and title to the native select", async () => {
    wrapper = await wrapperFactory({ required: true, title: "Choisissez" });
    expect(wrapper.find("select").attributes("required")).toBeDefined();
    expect(wrapper.find("select").attributes("title")).toBe("Choisissez");
  });

  it("applies the error theme to InputSelect when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, theme: "default" });
    expect(wrapper.find(".input-select-wrapper").attributes("data-theme")).toBe("error");
  });

  it("defaults data-testid to input-select-field", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.attributes("data-testid")).toBe("input-select-field");
  });
});
