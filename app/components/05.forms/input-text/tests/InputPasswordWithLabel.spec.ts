// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../variants/InputPasswordWithLabel.vue";

const initialPropsData = {
  name: "password",
  label: "Password",
  errorMessage: "",
};

let wrapper: VueWrapper<InstanceType<typeof ComponentUnderTest>>;
const wrapperFactory = (propsData = {}) => {
  const mockPropsData = { ...initialPropsData, ...propsData };

  return mountSuspended(ComponentUnderTest, {
    attachTo: document.body,
    props: mockPropsData,
  });
};

describe("InputPasswordWithLabel", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("defaults to type=password and the default toggle button text", async () => {
    wrapper = await wrapperFactory();

    expect(wrapper.find("input").attributes("type")).toBe("password");
    expect(wrapper.find("button").text()).toContain("Show password");
  });

  it("toggles the input type and button text when the toggle button is clicked", async () => {
    wrapper = await wrapperFactory();

    await wrapper.find("button").trigger("click");

    expect(wrapper.find("input").attributes("type")).toBe("text");
    expect(wrapper.find("button").text()).toContain("Hide password");
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
});
