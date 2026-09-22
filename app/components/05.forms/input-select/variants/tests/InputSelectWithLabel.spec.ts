// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputSelectWithLabel.vue";

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

describe("InputSelectWithLabel", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the label text", async () => {
    wrapper = await wrapperFactory({ label: "Favourite colour" });
    expect(wrapper.text()).toContain("Favourite colour");
  });

  it("renders a native select with an option per fieldData item", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("select").exists()).toBe(true);
    expect(wrapper.findAll("option").map((o) => o.text())).toEqual(["Red", "Blue"]);
  });

  it("sets data-invalid and the error class when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true });
    expect(wrapper.find(".input-select-with-label").attributes("data-invalid")).toBe("");
    expect(wrapper.find(".input-select-with-label").classes()).toContain("error");
  });

  it("renders the error message when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, errorMessage: "Please choose a colour" });
    expect(wrapper.text()).toContain("Please choose a colour");
  });

  it("renders the descriptionText slot", async () => {
    wrapper = await wrapperFactory({}, { descriptionText: () => "Pick your favourite" });
    expect(wrapper.text()).toContain("Pick your favourite");
  });

  it("applies inputVariant as a class on the wrapper", async () => {
    wrapper = await wrapperFactory({ inputVariant: "underlined" });
    expect(wrapper.find(".input-select-with-label").classes()).toContain("underlined");
  });

  it("applies styleClassPassthrough", async () => {
    wrapper = await wrapperFactory({ styleClassPassthrough: "custom-select" });
    expect(wrapper.find("select").classes()).toContain("custom-select");
  });

  it("forwards required to the native select", async () => {
    wrapper = await wrapperFactory({ required: true });
    expect(wrapper.find("select").attributes("required")).toBeDefined();
  });

  it("applies the error theme to InputSelectCore when fieldHasError is true", async () => {
    wrapper = await wrapperFactory({ fieldHasError: true, theme: "default" });
    expect(wrapper.find(".input-select-wrapper").attributes("data-theme")).toBe("error");
  });
});
