// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputTextCore.vue";

const initialPropsData = {
  id: "test-input",
  name: "testName",
  modelValue: "",
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };

  return mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: mockPropsData,
  });
};

describe("InputTextCore", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("does not set min/max attributes when not provided", async () => {
    wrapper = await wrapperFactory();
    const input = wrapper.find("input");

    expect(input.attributes("min")).toBeUndefined();
    expect(input.attributes("max")).toBeUndefined();
  });

  it("passes through a string min/max (e.g. for type=date)", async () => {
    wrapper = await wrapperFactory({
      type: "date",
      min: "2026-01-01",
      max: "2026-12-31",
    });
    const input = wrapper.find("input");

    expect(input.attributes("type")).toBe("date");
    expect(input.attributes("min")).toBe("2026-01-01");
    expect(input.attributes("max")).toBe("2026-12-31");
  });

  it("passes through a numeric min/max (e.g. for type=number)", async () => {
    wrapper = await wrapperFactory({
      type: "number",
      min: 0,
      max: 100,
    });
    const input = wrapper.find("input");

    expect(input.attributes("min")).toBe("0");
    expect(input.attributes("max")).toBe("100");
  });
});
