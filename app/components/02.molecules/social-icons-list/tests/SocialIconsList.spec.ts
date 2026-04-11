import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SocialIconsList from "../SocialIconsList.vue";
import type { ISocialIcon } from "~/types/components/social-icons-list.d";

const defaultItems: ISocialIcon[] = [
  {
    networkName: "Facebook",
    iconName: "logos:facebook",
    baseHref: "https://www.facebook.com/",
    profileId: "testprofile",
  },
  {
    networkName: "Instagram",
    iconName: "logos:instagram-icon",
    baseHref: "https://www.instagram.com/",
    profileId: "testhandle",
  },
  {
    networkName: "YouTube",
    iconName: "logos:youtube-icon",
    baseHref: "https://www.youtube.com/@",
    profileId: "testchannel",
  },
];

describe("SocialIconsList", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders as a ul element", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("ul");
  });

  it("renders the correct number of list items", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems },
    });
    expect(wrapper.findAll(".social-icon-item").length).toBe(defaultItems.length);
  });

  it("renders the correct href for each item", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems },
    });
    const links = wrapper.findAll(".social-icon-link");
    defaultItems.forEach((item, i) => {
      expect(links[i]!.attributes("href")).toBe(`${item.baseHref}${item.profileId}`);
    });
  });

  it("renders aria-label on each link using networkName", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems },
    });
    const links = wrapper.findAll(".social-icon-link");
    defaultItems.forEach((item, i) => {
      expect(links[i]!.attributes("aria-label")).toBe(`${item.networkName} profile`);
    });
  });

  it("adds rel='noopener noreferrer' to each link", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems },
    });
    const links = wrapper.findAll(".social-icon-link");
    links.forEach((link) => {
      expect(link.attributes("rel")).toBe("noopener noreferrer");
    });
  });

  it("opens each link in a new tab", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems },
    });
    const links = wrapper.findAll(".social-icon-link");
    links.forEach((link) => {
      expect(link.attributes("target")).toBe("_blank");
    });
  });

  it("uses the default aria-label on the list", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems },
    });
    expect(wrapper.attributes("aria-label")).toBe("Social media profiles");
  });

  it("uses a custom label prop as aria-label on the list", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems, label: "Follow us" },
    });
    expect(wrapper.attributes("aria-label")).toBe("Follow us");
  });

  it("renders an empty list when items is empty", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: [] },
    });
    expect(wrapper.findAll(".social-icon-item").length).toBe(0);
  });

  it("applies styleClassPassthrough classes to the root element", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems, styleClassPassthrough: ["custom-class", "another-class"] },
    });
    expect(wrapper.classes()).toContain("custom-class");
    expect(wrapper.classes()).toContain("another-class");
  });

  it("renders the correct HTML structure", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
