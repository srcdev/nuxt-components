import { describe, it, expect, vi, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, h, nextTick } from "vue";
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

const twoGroups: ResponsiveHeaderNavItem[] = [
  { name: "Services", childLinksTitle: "Our services", childLinks: [{ name: "Haircuts", path: "/haircuts" }] },
  { name: "About", childLinksTitle: "About us", childLinks: [{ name: "Team", path: "/team" }] },
];

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];

const mountMenu = async (options: { props?: Record<string, unknown>; attachTo?: HTMLElement } = {}) => {
  const wrapper = await mountSuspended(DeepExpandingMenuClassic, options);
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

const groups = (wrapper: Awaited<ReturnType<typeof mountMenu>>) =>
  wrapper.findAll("details").map((d) => d.element as HTMLDetailsElement);

describe("DeepExpandingMenuClassic", () => {
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
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks, tag: "div" } });
    expect(wrapper.element.tagName.toLowerCase()).toBe("div");
  });

  it("labels the root when ariaLabel is set, and leaves it unlabelled otherwise", async () => {
    const unlabelled = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(unlabelled.attributes("aria-label")).toBeUndefined();

    const labelled = await mountMenu({ props: { navLinks: defaultNavLinks, ariaLabel: "Main" } });
    expect(labelled.attributes("aria-label")).toBe("Main");
  });

  it("renders a direct link for items with a path", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    const links = wrapper.findAll(".deep-expanding-menu-classic-link");
    expect(links.map((l) => l.text())).toEqual(["Home", "Contact"]);
  });

  it("renders a <details> group for items with childLinks", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(wrapper.find("details.deep-expanding-menu-classic-group").exists()).toBe(true);
    expect(wrapper.find(".deep-expanding-menu-classic-group-toggle").text()).toContain("Services");
  });

  it("renders each child link inside the group panel", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    const childLinks = wrapper.findAll(".deep-expanding-menu-classic-group-link");
    expect(childLinks.map((l) => l.text())).toEqual(["Haircuts", "Colouring"]);
  });

  it("renders the childLinksTitle heading", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(wrapper.find(".deep-expanding-menu-classic-group-heading").text()).toBe("Our services");
  });

  it("omits the heading when childLinksTitle is missing or empty", async () => {
    const navLinks: ResponsiveHeaderNavItem[] = [
      { name: "A", childLinks: [{ name: "A1", path: "/a1" }] },
      { name: "B", childLinksTitle: "", childLinks: [{ name: "B1", path: "/b1" }] },
    ];
    const wrapper = await mountMenu({ props: { navLinks } });
    expect(wrapper.find(".deep-expanding-menu-classic-group-heading").exists()).toBe(false);
  });

  it("omits the list when a group has no child links", async () => {
    const navLinks: ResponsiveHeaderNavItem[] = [{ name: "Empty", childLinksTitle: "Empty", childLinks: [] }];
    const wrapper = await mountMenu({ props: { navLinks } });
    expect(wrapper.find(".deep-expanding-menu-classic-group-list").exists()).toBe(false);
  });

  it("gives the child link list a list role and hides the caret from assistive technology", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks } });
    expect(wrapper.find(".deep-expanding-menu-classic-group-list").attributes("role")).toBe("list");
    expect(wrapper.find(".deep-expanding-menu-classic-group-icon").attributes("aria-hidden")).toBe("true");
  });

  it("keeps child links with duplicate names in step when the list is reordered", async () => {
    const childLinks = [
      { name: "Same", path: "/one" },
      { name: "Same", path: "/two" },
      { name: "Other", path: "/three" },
    ];
    const wrapper = await mountMenu({ props: { navLinks: [{ name: "Group", childLinks }] } });
    await wrapper.setProps({ navLinks: [{ name: "Group", childLinks: [childLinks[2]!, childLinks[0]!] }] });
    const links = wrapper.findAll(".deep-expanding-menu-classic-group-link");
    expect(links.map((l) => l.attributes("href"))).toEqual(["/three", "/one"]);
  });

  it("shares a details name within one menu but not across menus", async () => {
    const Host = defineComponent({
      setup: () => () => [
        h(DeepExpandingMenuClassic, { navLinks: twoGroups }),
        h(DeepExpandingMenuClassic, { navLinks: twoGroups }),
      ],
    });
    const wrapper = await mountSuspended(Host);
    mounted.push(wrapper);
    const names = wrapper.findAll("details").map((d) => d.attributes("name"));
    expect(names[0]).toBe(names[1]);
    expect(names[2]).toBe(names[3]);
    expect(names[0]).not.toBe(names[2]);
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks, styleClassPassthrough: ["custom-class"] } });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("resets classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountMenu({ props: { navLinks: defaultNavLinks, styleClassPassthrough: ["initial-class"] } });
    expect(wrapper.classes()).toContain("initial-class");

    await wrapper.setProps({ styleClassPassthrough: ["updated-class"] });
    expect(wrapper.classes()).not.toContain("initial-class");
    expect(wrapper.classes()).toContain("updated-class");
  });

  describe("closing", () => {
    it("closes an open group when something else in the menu is clicked", async () => {
      const wrapper = await mountMenu({ props: { navLinks: twoGroups } });
      const [first] = groups(wrapper);
      first!.open = true;

      await wrapper.findAll("summary")[1]!.trigger("click");
      expect(first!.open).toBe(false);
    });

    it("keeps a group open when its own panel is clicked, and closes it when a child link is followed", async () => {
      const wrapper = await mountMenu({ props: { navLinks: twoGroups } });
      const [first] = groups(wrapper);
      first!.open = true;

      await wrapper.find(".deep-expanding-menu-classic-group-heading").trigger("click");
      expect(first!.open).toBe(true);

      await wrapper.find(".deep-expanding-menu-classic-group-link").trigger("click");
      expect(first!.open).toBe(false);
    });

    it("closes the group on Escape and returns focus to its toggle", async () => {
      const wrapper = await mountMenu({ props: { navLinks: twoGroups }, attachTo: document.body });
      const [first] = groups(wrapper);
      first!.open = true;

      const link = wrapper.find(".deep-expanding-menu-classic-group-link");
      await link.trigger("keydown", { key: "Escape" });
      expect(first!.open).toBe(false);
      expect(document.activeElement).toBe(wrapper.findAll("summary")[0]!.element);
    });

    it("closes open groups on a click outside the menu", async () => {
      const wrapper = await mountMenu({ props: { navLinks: twoGroups }, attachTo: document.body });
      const [first] = groups(wrapper);
      first!.open = true;
      vi.advanceTimersByTime(1);

      document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await nextTick();
      expect(first!.open).toBe(false);
    });
  });
});
