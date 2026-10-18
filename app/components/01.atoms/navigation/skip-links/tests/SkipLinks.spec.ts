import { describe, it, expect, vi, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SkipLinks from "../SkipLinks.vue";
import type { SkipLink } from "~/types/components";

const mounted: { unmount: () => void }[] = [];

const mountSkipLinks = async (options: Parameters<typeof mountSuspended<typeof SkipLinks>>[1] = {}) => {
  const wrapper = await mountSuspended(SkipLinks, options);
  mounted.push(wrapper);
  return wrapper;
};

describe("SkipLinks", () => {
  afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount());
    vi.restoreAllMocks();
  });

  it("mounts without error", async () => {
    const wrapper = await mountSkipLinks();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountSkipLinks();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (all props set)", async () => {
    const wrapper = await mountSkipLinks({
      props: {
        links: [{ href: "#content", label: "Skip to content" }],
        ariaLabel: "Custom skip nav",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders the default main-content and footer links", async () => {
    const wrapper = await mountSkipLinks();
    const links = wrapper.findAll(".skip-links__link");
    expect(links).toHaveLength(2);
    expect(links[0]!.attributes("href")).toBe("#main-content");
    expect(links[0]!.text()).toBe("Skip to main content");
    expect(links[1]!.attributes("href")).toBe("#footer-content");
    expect(links[1]!.text()).toBe("Skip to footer");
  });

  it("renders custom links when the links prop is provided", async () => {
    const customLinks: SkipLink[] = [
      { href: "#nav", label: "Skip to navigation" },
      { href: "#search", label: "Skip to search" },
      { href: "#content", label: "Skip to content" },
    ];
    const wrapper = await mountSkipLinks({ props: { links: customLinks } });
    const links = wrapper.findAll(".skip-links__link");
    expect(links).toHaveLength(3);
    expect(links.map((link) => link.text())).toEqual(["Skip to navigation", "Skip to search", "Skip to content"]);
  });

  it("drops links with an empty or whitespace-only href or label", async () => {
    const wrapper = await mountSkipLinks({
      props: {
        links: [
          { href: "#a", label: "Keep" },
          { href: "", label: "No target" },
          { href: "#b", label: "   " },
          { href: "#c", label: "Also keep" },
        ],
      },
    });
    expect(wrapper.findAll(".skip-links__link").map((link) => link.text())).toEqual(["Keep", "Also keep"]);
  });

  it("keeps the right links when two share an href and the list is reordered", async () => {
    const wrapper = await mountSkipLinks({
      props: {
        links: [
          { href: "#nav", label: "Skip to navigation" },
          { href: "#main", label: "Skip to content" },
          { href: "#main", label: "Skip to article" },
          { href: "#footer", label: "Skip to footer" },
        ],
      },
    });
    expect(wrapper.findAll(".skip-links__link")).toHaveLength(4);
    await wrapper.setProps({
      links: [
        { href: "#footer", label: "Skip to footer" },
        { href: "#main", label: "Skip to content" },
        { href: "#main", label: "Skip to article" },
        { href: "#nav", label: "Skip to navigation" },
      ],
    });
    expect(wrapper.findAll(".skip-links__link").map((link) => link.text())).toEqual([
      "Skip to footer",
      "Skip to content",
      "Skip to article",
      "Skip to navigation",
    ]);
  });

  it("omits the nav landmark entirely when there are no usable links", async () => {
    const wrapper = await mountSkipLinks({ props: { links: [{ href: "", label: "" }] } });
    expect(wrapper.find("nav").exists()).toBe(false);
  });

  it("defaults the nav aria-label to 'Skip navigation'", async () => {
    const wrapper = await mountSkipLinks();
    expect(wrapper.find(".skip-links__nav").attributes("aria-label")).toBe("Skip navigation");
  });

  it("uses a custom ariaLabel when provided", async () => {
    const wrapper = await mountSkipLinks({ props: { ariaLabel: "Custom skip nav" } });
    expect(wrapper.find(".skip-links__nav").attributes("aria-label")).toBe("Custom skip nav");
  });

  it("does not render the home-link slot wrapper when the slot is unused", async () => {
    const wrapper = await mountSkipLinks();
    expect(wrapper.find(".skip-links__home").exists()).toBe(false);
  });

  it("renders the homeLink slot content when provided", async () => {
    const wrapper = await mountSkipLinks({
      slots: { homeLink: "<a href='/' class='logo-link'>Home</a>" },
    });
    expect(wrapper.find(".skip-links__home").exists()).toBe(true);
    expect(wrapper.find(".logo-link").exists()).toBe(true);
  });
});
