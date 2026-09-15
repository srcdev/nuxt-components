import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SkipLinks from "../SkipLinks.vue";
import type { SkipLink } from "~/types/components";

describe("SkipLinks", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(SkipLinks);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountSuspended(SkipLinks);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (all props set)", async () => {
    const wrapper = await mountSuspended(SkipLinks, {
      props: {
        links: [{ href: "#content", label: "Skip to content" }],
        ariaLabel: "Custom skip nav",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders the default main-content and footer links", async () => {
    const wrapper = await mountSuspended(SkipLinks);
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
    const wrapper = await mountSuspended(SkipLinks, { props: { links: customLinks } });
    const links = wrapper.findAll(".skip-links__link");
    expect(links).toHaveLength(3);
    expect(links.map((link) => link.text())).toEqual(["Skip to navigation", "Skip to search", "Skip to content"]);
  });

  it("defaults the nav aria-label to 'Skip navigation'", async () => {
    const wrapper = await mountSuspended(SkipLinks);
    expect(wrapper.find(".skip-links__nav").attributes("aria-label")).toBe("Skip navigation");
  });

  it("uses a custom ariaLabel when provided", async () => {
    const wrapper = await mountSuspended(SkipLinks, { props: { ariaLabel: "Custom skip nav" } });
    expect(wrapper.find(".skip-links__nav").attributes("aria-label")).toBe("Custom skip nav");
  });

  it("does not render the home-link slot wrapper when the slot is unused", async () => {
    const wrapper = await mountSuspended(SkipLinks);
    expect(wrapper.find(".skip-links__home").exists()).toBe(false);
  });

  it("renders the homeLink slot content when provided", async () => {
    const wrapper = await mountSuspended(SkipLinks, {
      slots: { homeLink: "<a href='/' class='logo-link'>Home</a>" },
    });
    expect(wrapper.find(".skip-links__home").exists()).toBe(true);
    expect(wrapper.find(".logo-link").exists()).toBe(true);
  });
});
