// https://nuxt.com/docs/getting-started/testing#unit-testing
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ComponentUnderTest from "../InputTextWithLabel.vue";
import { defineComponent, nextTick, ref } from "vue";

const initialPropsData = {
  type: "text" as const,
  name: "testName",
  label: "Test label",
  errorMessage: "",
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

describe("InputTextWithLabel", () => {
  it("mounts without error", async () => {
    wrapper = await wrapperFactory();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders the label text", async () => {
    wrapper = await wrapperFactory({ label: "Email address" });
    expect(wrapper.text()).toContain("Email address");
  });

  it("forwards min/max through to the underlying InputTextCore input (e.g. for type=date)", async () => {
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

  it("points aria-describedby at the description once it appears after mount", async () => {
    const Host = defineComponent({
      components: { ComponentUnderTest },
      setup() {
        return { modelValue: ref(""), showDescription: ref(false) };
      },
      template: `
        <ComponentUnderTest v-model="modelValue" type="text" name="email" label="Email" error-message="">
          <template v-if="showDescription" #descriptionText>We never share it.</template>
        </ComponentUnderTest>
      `,
    });
    const host = await mountSuspended(Host);
    const input = () => host.find("input");
    expect(input().attributes("aria-describedby")).toBeFalsy();
    (host.vm as unknown as { showDescription: boolean }).showDescription = true;
    await nextTick();
    expect(input().attributes("aria-describedby")).toMatch(/-description$/);
    (host.vm as unknown as { showDescription: boolean }).showDescription = false;
    await nextTick();
    expect(input().attributes("aria-describedby")).toBeFalsy();
  });
});
