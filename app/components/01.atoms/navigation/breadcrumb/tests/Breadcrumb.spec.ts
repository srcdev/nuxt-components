import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Breadcrumb from "../Breadcrumb.vue";
import type { BreadcrumbItem } from "~/types/components/breadcrumb";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const items: BreadcrumbItem[] = [
  { label: "Services", to: "/services" },
  { label: "Balayage", to: "/services/balayage" },
  { label: "Highlights" },
];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Breadcrumb", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items } });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders a nav with the Breadcrumb aria-label", async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items } });
    expect(wrapper.attributes("aria-label")).toBe("Breadcrumb");
  });

  it("renders every item's label", async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items } });
    expect(wrapper.text()).toContain("Services");
    expect(wrapper.text()).toContain("Balayage");
    expect(wrapper.text()).toContain("Highlights");
  });

  it("renders a link for items with a to prop", async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items } });
    const links = wrapper.findAll("a");
    expect(links.length).toBe(2);
    expect(links[0]?.text()).toBe("Services");
    expect(links[1]?.text()).toBe("Balayage");
  });

  it("renders the last item without a to prop as plain text marked as current page", async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items } });
    const current = wrapper.find('[aria-current="page"]');
    expect(current.exists()).toBe(true);
    expect(current.text()).toBe("Highlights");
  });

  it("does not render a separator after the last item", async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items } });
    const separators = wrapper.findAll(".breadcrumb__separator");
    expect(separators.length).toBe(items.length - 1);
  });

  it("uses a custom separator", async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items, separator: ">" } });
    expect(wrapper.find(".breadcrumb__separator").text()).toBe(">");
  });

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items, styleClassPassthrough: "custom-class" } });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(Breadcrumb, {
      props: { items, styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(Breadcrumb, {
      props: { items, styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
