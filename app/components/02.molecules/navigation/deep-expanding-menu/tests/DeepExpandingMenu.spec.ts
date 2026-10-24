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

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountMenu = async (options: { props?: Record<string, unknown>; attachTo?: HTMLElement } = {}) => {
  const wrapper = await mountSuspended(DeepExpandingMenu, options);
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

describe("DeepExpandingMenu", () => {
  it("mounts without error", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders a <nav> by default", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(wrapper.element.tagName.toLowerCase()).toBe("nav");
  });

  it("renders the given tag", async () => {
    const wrapper = await mountMenu({
      props: { navLinks: defaultNavLinks, tag: "div" },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("div");
  });

  it("renders a direct link for items with a path", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    const links = wrapper.findAll(".deep-expanding-menu-link");
    expect(links.map((l) => l.text())).toEqual(["Home", "Contact"]);
  });

  it("renders a toggle group for items with childLinks", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(wrapper.find(".deep-expanding-menu-group-toggle").text()).toContain("Services");
  });

  it("renders each child link inside the group panel", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    const childLinks = wrapper.findAll(".deep-expanding-menu-group-link");
    expect(childLinks.map((l) => l.text())).toEqual(["Haircuts", "Colouring"]);
  });

  it("renders the childLinksTitle heading", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(wrapper.find(".deep-expanding-menu-group-heading").text()).toBe("Our services");
  });

  it("gives each group toggle a unique popovertarget", async () => {
    const navLinks: ResponsiveHeaderNavItem[] = [
      { name: "A", childLinksTitle: "A", childLinks: [{ name: "A1", path: "/a1" }] },
      { name: "B", childLinksTitle: "B", childLinks: [{ name: "B1", path: "/b1" }] },
    ];
    const wrapper = await mountMenu({ props: { navLinks } });
    const toggles = wrapper.findAll(".deep-expanding-menu-group-toggle");
    const targets = toggles.map((t) => t.attributes("popovertarget"));
    expect(new Set(targets).size).toBe(2);
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountMenu({
      props: { navLinks: defaultNavLinks, styleClassPassthrough: ["custom-class"] },
    });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("resets classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountMenu({
      props: { navLinks: defaultNavLinks, styleClassPassthrough: ["initial-class"] },
    });
    expect(wrapper.classes()).toContain("initial-class");

    await wrapper.setProps({ styleClassPassthrough: ["updated-class"] });
    expect(wrapper.classes()).not.toContain("initial-class");
    expect(wrapper.classes()).toContain("updated-class");
  });

  it("labels the root when ariaLabel is set, and leaves it unlabelled otherwise", async () => {
    const unlabelled = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(unlabelled.attributes("aria-label")).toBeUndefined();

    const labelled = await mountMenu({
      props: { navLinks: defaultNavLinks, ariaLabel: "Main" },
    });
    expect(labelled.attributes("aria-label")).toBe("Main");
  });

  it("gives the child link list a list role", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(wrapper.find(".deep-expanding-menu-group-list").attributes("role")).toBe("list");
  });

  it("omits the heading when childLinksTitle is missing or empty", async () => {
    const navLinks: ResponsiveHeaderNavItem[] = [
      { name: "A", childLinks: [{ name: "A1", path: "/a1" }] },
      { name: "B", childLinksTitle: "", childLinks: [{ name: "B1", path: "/b1" }] },
    ];
    const wrapper = await mountMenu({ props: { navLinks } });
    expect(wrapper.find(".deep-expanding-menu-group-heading").exists()).toBe(false);
  });

  it("omits the list when a group has no child links", async () => {
    const navLinks: ResponsiveHeaderNavItem[] = [{ name: "Empty", childLinksTitle: "Empty", childLinks: [] }];
    const wrapper = await mountMenu({ props: { navLinks } });
    expect(wrapper.find(".deep-expanding-menu-group-list").exists()).toBe(false);
  });

  it("keeps child links with duplicate names in step when the list is reordered", async () => {
    const childLinks = [
      { name: "Same", path: "/one" },
      { name: "Same", path: "/two" },
      { name: "Other", path: "/three" },
    ];
    const wrapper = await mountMenu({
      props: { navLinks: [{ name: "Group", childLinksTitle: "Group", childLinks }] },
    });
    await wrapper.setProps({
      navLinks: [{ name: "Group", childLinksTitle: "Group", childLinks: [childLinks[2]!, childLinks[0]!] }],
    });
    const links = wrapper.findAll(".deep-expanding-menu-group-link");
    expect(links.map((l) => l.attributes("href"))).toEqual(["/three", "/one"]);
  });

  it("hides the caret icon from assistive technology", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(wrapper.find(".deep-expanding-menu-group-icon").attributes("aria-hidden")).toBe("true");
  });

  it("doesn't give the link panels a menu role", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(wrapper.find(".deep-expanding-menu-group-panel").attributes("role")).toBeUndefined();
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
        const wrapper = await mountMenu({ props: { navLinks: twoGroups } });
        const [first, second] = wrapper.findAll(".deep-expanding-menu-group-panel");
        const toggles = wrapper.findAll(".deep-expanding-menu-group-toggle");

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

      it("hides the open panel when one of its links is clicked", async () => {
        const wrapper = await mountMenu({ props: { navLinks: twoGroups } });
        const panel = wrapper.find(".deep-expanding-menu-group-panel");
        panel.element.dispatchEvent(toggleEvent("open"));
        await nextTick();

        await wrapper.find(".deep-expanding-menu-group-link").trigger("click");
        expect(HTMLElement.prototype.hidePopover).toHaveBeenCalled();
      });
    });

    describe("without the Popover API", () => {
      beforeEach(() => {
        Object.defineProperty(HTMLElement.prototype, "showPopover", { value: undefined, writable: true, configurable: true });
      });

      it("opens, switches and closes groups from their toggles", async () => {
        const wrapper = await mountMenu({ props: { navLinks: twoGroups } });
        const toggles = wrapper.findAll(".deep-expanding-menu-group-toggle");
        const panels = wrapper.findAll(".deep-expanding-menu-group-panel");

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

      it("closes the open group when one of its links is clicked", async () => {
        const wrapper = await mountMenu({ props: { navLinks: twoGroups } });
        await wrapper.findAll(".deep-expanding-menu-group-toggle")[0]!.trigger("click");

        await wrapper.find(".deep-expanding-menu-group-link").trigger("click");
        expect(wrapper.find(".deep-expanding-menu-panel-open").exists()).toBe(false);
      });

      it("keeps the group open when a click inside the panel isn't on a link", async () => {
        const wrapper = await mountMenu({ props: { navLinks: twoGroups } });
        await wrapper.findAll(".deep-expanding-menu-group-toggle")[0]!.trigger("click");

        await wrapper.find(".deep-expanding-menu-group-heading").trigger("click");
        expect(wrapper.find(".deep-expanding-menu-panel-open").exists()).toBe(true);
      });

      it("closes the open group on Escape", async () => {
        const wrapper = await mountMenu({ props: { navLinks: twoGroups }, attachTo: document.body });
        await wrapper.findAll(".deep-expanding-menu-group-toggle")[0]!.trigger("click");
        await nextTick();

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        await nextTick();
        expect(wrapper.find(".deep-expanding-menu-panel-open").exists()).toBe(false);
      });
    });
  });
});
