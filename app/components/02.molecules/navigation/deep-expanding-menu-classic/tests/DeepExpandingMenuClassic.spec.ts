import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DeepExpandingMenuClassic from "../DeepExpandingMenuClassic.vue";
import type { ResponsiveHeaderNavItem } from "~/types/components";

const defaultNavLinks: ResponsiveHeaderNavItem[] = [
  { name: "Home", path: "/" },
  {
    name: "Services",
    childLinksTitle: "Our services",
    childLinks: [
      { name: "Haircuts", path: "/services/haircuts" },
      { name: "Colouring", path: "/services/colouring" },
    ],
  },
  { name: "Contact", path: "/contact" },
];

describe("DeepExpandingMenuClassic", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenuClassic, { props: { navLinks: defaultNavLinks } });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenuClassic, { props: { navLinks: defaultNavLinks } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders a <nav> by default", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenuClassic, { props: { navLinks: defaultNavLinks } });
    expect(wrapper.element.tagName.toLowerCase()).toBe("nav");
  });

  it("renders the given tag", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenuClassic, {
      props: { navLinks: defaultNavLinks, tag: "div" },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("div");
  });

  it("renders a direct link for items with a path", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenuClassic, { props: { navLinks: defaultNavLinks } });
    const links = wrapper.findAll(".navigation-link");
    expect(links.map((l) => l.text())).toEqual(["Home", "Contact"]);
  });

  it("renders a <details> group for items with childLinks", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenuClassic, { props: { navLinks: defaultNavLinks } });
    expect(wrapper.find("details.navigation-group").exists()).toBe(true);
    expect(wrapper.find(".navigation-group-toggle").text()).toContain("Services");
  });

  it("renders each child link inside the group panel", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenuClassic, { props: { navLinks: defaultNavLinks } });
    const childLinks = wrapper.findAll(".navigation-group-link");
    expect(childLinks.map((l) => l.text())).toEqual(["Haircuts", "Colouring"]);
  });

  it("renders the childLinksTitle heading", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenuClassic, { props: { navLinks: defaultNavLinks } });
    expect(wrapper.find(".navigation-group-panel h4").text()).toBe("Our services");
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenuClassic, {
      props: { navLinks: defaultNavLinks, styleClassPassthrough: ["custom-class"] },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("resets classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenuClassic, {
      props: { navLinks: defaultNavLinks, styleClassPassthrough: ["initial-class"] },
    });
    expect(wrapper.classes()).toContain("initial-class");

    await wrapper.setProps({ styleClassPassthrough: ["updated-class"] });
    expect(wrapper.classes()).not.toContain("initial-class");
    expect(wrapper.classes()).toContain("updated-class");
  });
});
