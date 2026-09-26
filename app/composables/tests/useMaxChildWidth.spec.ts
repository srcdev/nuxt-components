import { describe, it, expect, vi, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, h } from "vue";
import { useMaxChildWidth } from "../useMaxChildWidth";

const widths: Record<string, number> = { short: 40, long: 120, other: 300 };

const offsetWidthSpy = vi
  .spyOn(HTMLElement.prototype, "offsetWidth", "get")
  .mockImplementation(function (this: HTMLElement) {
    return widths[this.dataset.size ?? ""] ?? 0;
  });

afterEach(() => {
  offsetWidthSpy.mockClear();
});

const mountWith = (refKey?: string, items = ["short", "long"]) =>
  mountSuspended(
    defineComponent({
      setup() {
        const { maxChildWidth, updateMaxChildWidth } = refKey
          ? useMaxChildWidth(".item", "100px", refKey)
          : useMaxChildWidth(".item", "100px");
        return { maxChildWidth, updateMaxChildWidth };
      },
      render() {
        return h("div", [
          h(
            "div",
            { ref: refKey ?? "itemsContainer" },
            items.map((size) => h("span", { class: "item", "data-size": size }))
          ),
          h("span", { class: "item", "data-size": "other" }),
        ]);
      },
    })
  );

describe("useMaxChildWidth", () => {
  it("starts at the fallback", async () => {
    const wrapper = await mountWith();

    expect(wrapper.vm.maxChildWidth).toBe("100px");
  });

  it("measures the widest match inside the itemsContainer template ref", async () => {
    const wrapper = await mountWith();
    wrapper.vm.updateMaxChildWidth();

    expect(wrapper.vm.maxChildWidth).toBe("120px");
  });

  it("uses a custom template ref name", async () => {
    const wrapper = await mountWith("optionsList");
    wrapper.vm.updateMaxChildWidth();

    expect(wrapper.vm.maxChildWidth).toBe("120px");
  });

  it("falls back when nothing matches", async () => {
    const wrapper = await mountWith(undefined, []);
    wrapper.vm.updateMaxChildWidth();

    expect(wrapper.vm.maxChildWidth).toBe("100px");
  });
});
