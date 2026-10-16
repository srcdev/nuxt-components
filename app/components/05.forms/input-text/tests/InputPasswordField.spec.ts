// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputPasswordField.vue";

const initialPropsData = {
  name: "password",
  label: "Password",
  errorMessage: "",
  modelValue: "",
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

describe("InputPasswordField", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders an InputTextField root with the input-password-field class", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.classes()).toContain("input-text-field");
    expect(wrapper.classes()).toContain("input-password-field");
  });

  it("defaults to type=password and the default toggle button text", async () => {
    wrapper = await wrapperFactory();

    expect(wrapper.find("input").attributes("type")).toBe("password");
    expect(wrapper.find("button").text()).toContain("Show password");
  });

  it("defaults autocomplete to current-password and forwards a custom one", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.find("input").attributes("autocomplete")).toBe("current-password");

    await wrapper.setProps({ autocomplete: "new-password" });
    expect(wrapper.find("input").attributes("autocomplete")).toBe("new-password");
  });

  it("toggles the input type and button text when the toggle button is clicked", async () => {
    wrapper = await wrapperFactory();

    await wrapper.find("button").trigger("click");

    expect(wrapper.find("input").attributes("type")).toBe("text");
    expect(wrapper.find("button").text()).toContain("Hide password");
  });

  it("ignores a passed type so the toggle stays in control", async () => {
    wrapper = await wrapperFactory({ type: "text" });
    expect(wrapper.find("input").attributes("type")).toBe("password");
  });

  it("uses custom showPasswordText/hidePasswordText when provided", async () => {
    wrapper = await wrapperFactory({
      showPasswordText: "Afficher le mot de passe",
      hidePasswordText: "Masquer le mot de passe",
    });

    expect(wrapper.find("button").text()).toContain("Afficher le mot de passe");

    await wrapper.find("button").trigger("click");

    expect(wrapper.find("button").text()).toContain("Masquer le mot de passe");
  });

  it("renders no description and no description id without a description slot", async () => {
    wrapper = await wrapperFactory();

    expect(wrapper.find(".input-text-description").exists()).toBe(false);
    expect(wrapper.find("input").attributes("aria-describedby")).toBeUndefined();
  });

  it("forwards the descriptionText slot", async () => {
    wrapper = await wrapperFactory({}, { descriptionText: () => "At least 12 characters" });

    expect(wrapper.text()).toContain("At least 12 characters");
    expect(wrapper.find("input").attributes("aria-describedby")).toMatch(/-description$/);
  });
});
