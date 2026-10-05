import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import DeepExpandingMenu from "../DeepExpandingMenu.vue";
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

describe("DeepExpandingMenu", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenu, { props: { navLinks: defaultNavLinks } });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenu, { props: { navLinks: defaultNavLinks } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders a <nav> by default", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenu, { props: { navLinks: defaultNavLinks } });
    expect(wrapper.element.tagName.toLowerCase()).toBe("nav");
  });

  it("renders the given tag", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenu, {
      props: { navLinks: defaultNavLinks, tag: "div" },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("div");
  });

  it("renders a direct link for items with a path", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenu, { props: { navLinks: defaultNavLinks } });
    const links = wrapper.findAll(".navigation-link");
    expect(links.map((l) => l.text())).toEqual(["Home", "Contact"]);
  });

  it("renders a toggle group for items with childLinks", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenu, { props: { navLinks: defaultNavLinks } });
    expect(wrapper.find(".navigation-group-toggle").text()).toContain("Services");
  });

  it("renders each child link inside the group panel", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenu, { props: { navLinks: defaultNavLinks } });
    const childLinks = wrapper.findAll(".navigation-group-link");
    expect(childLinks.map((l) => l.text())).toEqual(["Haircuts", "Colouring"]);
  });

  it("renders the childLinksTitle heading", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenu, { props: { navLinks: defaultNavLinks } });
    expect(wrapper.find(".navigation-group-panel h4").text()).toBe("Our services");
  });

  it("gives each group toggle a unique popovertarget", async () => {
    const navLinks: ResponsiveHeaderNavItem[] = [
      { name: "A", childLinksTitle: "A", childLinks: [{ name: "A1", path: "/a1" }] },
      { name: "B", childLinksTitle: "B", childLinks: [{ name: "B1", path: "/b1" }] },
    ];
    const wrapper = await mountSuspended(DeepExpandingMenu, { props: { navLinks } });
    const toggles = wrapper.findAll(".navigation-group-toggle");
    const targets = toggles.map((t) => t.attributes("popovertarget"));
    expect(new Set(targets).size).toBe(2);
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenu, {
      props: { navLinks: defaultNavLinks, styleClassPassthrough: ["custom-class"] },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("resets classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(DeepExpandingMenu, {
      props: { navLinks: defaultNavLinks, styleClassPassthrough: ["initial-class"] },
    });
    expect(wrapper.classes()).toContain("initial-class");

    await wrapper.setProps({ styleClassPassthrough: ["updated-class"] });
    expect(wrapper.classes()).not.toContain("initial-class");
    expect(wrapper.classes()).toContain("updated-class");
  });

  describe("open state", () => {
    const twoGroups: ResponsiveHeaderNavItem[] = [
      { name: "Services", childLinksTitle: "Our services", childLinks: [{ name: "Haircuts", path: "/haircuts" }] },
      { name: "About", childLinksTitle: "About us", childLinks: [{ name: "Team", path: "/team" }] },
    ];

    const toggleEvent = (newState: "open" | "closed") => Object.assign(new Event("toggle"), { newState });

    afterEach(() => {
      delete (HTMLElement.prototype as unknown as Record<string, unknown>)["showPopover"];
      delete (HTMLElement.prototype as unknown as Record<string, unknown>)["hidePopover"];
    });

    describe("with the Popover API", () => {
      beforeEach(() => {
        Object.defineProperty(HTMLElement.prototype, "showPopover", { value: vi.fn(), writable: true, configurable: true });
        Object.defineProperty(HTMLElement.prototype, "hidePopover", { value: vi.fn(), writable: true, configurable: true });
      });

      it("tracks the open group from toggle events, whichever order they arrive in", async () => {
        const wrapper = await mountSuspended(DeepExpandingMenu, { props: { navLinks: twoGroups } });
        const [first, second] = wrapper.findAll(".navigation-group-panel");
        const toggles = wrapper.findAll(".navigation-group-toggle");

        first!.element.dispatchEvent(toggleEvent("open"));
        await nextTick();
        expect(toggles[0]!.attributes("aria-expanded")).toBe("true");

        second!.element.dispatchEvent(toggleEvent("open"));
        first!.element.dispatchEvent(toggleEvent("closed"));
        await nextTick();
        expect(toggles[0]!.attributes("aria-expanded")).toBe("false");
        expect(toggles[1]!.attributes("aria-expanded")).toBe("true");

        second!.element.dispatchEvent(toggleEvent("closed"));
        await nextTick();
        expect(toggles[1]!.attributes("aria-expanded")).toBe("false");
      });
    });

    describe("without the Popover API", () => {
      beforeEach(() => {
        Object.defineProperty(HTMLElement.prototype, "showPopover", { value: undefined, writable: true, configurable: true });
      });

      it("opens, switches and closes groups from their toggles", async () => {
        const wrapper = await mountSuspended(DeepExpandingMenu, { props: { navLinks: twoGroups } });
        const toggles = wrapper.findAll(".navigation-group-toggle");
        const panels = wrapper.findAll(".navigation-group-panel");

        await toggles[0]!.trigger("click");
        expect(panels[0]!.classes()).toContain("deep-expanding-menu-panel-open");
        expect(toggles[0]!.attributes("aria-expanded")).toBe("true");

        await toggles[1]!.trigger("click");
        expect(panels[0]!.classes()).not.toContain("deep-expanding-menu-panel-open");
        expect(panels[1]!.classes()).toContain("deep-expanding-menu-panel-open");

        await toggles[1]!.trigger("click");
        expect(panels[1]!.classes()).not.toContain("deep-expanding-menu-panel-open");
        expect(toggles[1]!.attributes("aria-expanded")).toBe("false");
      });

      it("closes the open group on Escape", async () => {
        const wrapper = await mountSuspended(DeepExpandingMenu, { props: { navLinks: twoGroups }, attachTo: document.body });
        await wrapper.findAll(".navigation-group-toggle")[0]!.trigger("click");
        await nextTick();

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        await nextTick();
        expect(wrapper.find(".deep-expanding-menu-panel-open").exists()).toBe(false);
        wrapper.unmount();
      });
    });
  });
});
