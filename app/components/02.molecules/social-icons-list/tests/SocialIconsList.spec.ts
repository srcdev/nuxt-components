import { describe, it, expect, vi, afterEach } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SocialIconsList from "../SocialIconsList.vue";
import type { ISocialIcon } from "~/types/components/social-icons-list.d";

const mounted: { unmount: () => void }[] = [];

async function mountList(props: Record<string, unknown>) {
  const wrapper = await mountSuspended(SocialIconsList, { props: props as { items: ISocialIcon[] } });
  mounted.push(wrapper);
  return wrapper;
}

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});

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
    const wrapper = await mountList({ items: defaultItems });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders as a ul element", async () => {
    const wrapper = await mountList({ items: defaultItems });
    expect(wrapper.element.tagName.toLowerCase()).toBe("ul");
  });

  it("renders the correct number of list items", async () => {
    const wrapper = await mountList({ items: defaultItems });
    expect(wrapper.findAll(".social-icons-list-item").length).toBe(defaultItems.length);
  });

  it("renders the correct href for each item", async () => {
    const wrapper = await mountList({ items: defaultItems });
    const links = wrapper.findAll(".social-icons-list-link");
    defaultItems.forEach((item, i) => {
      expect(links[i]!.attributes("href")).toBe(`${item.baseHref}${item.profileId}`);
    });
  });

  it("renders aria-label on each link using networkName", async () => {
    const wrapper = await mountList({ items: defaultItems });
    const links = wrapper.findAll(".social-icons-list-link");
    defaultItems.forEach((item, i) => {
      expect(links[i]!.attributes("aria-label")).toBe(`${item.networkName} profile (opens in a new tab)`);
    });
  });

  it("adds rel='noopener noreferrer' to each link", async () => {
    const wrapper = await mountList({ items: defaultItems });
    const links = wrapper.findAll(".social-icons-list-link");
    links.forEach((link) => {
      expect(link.attributes("rel")).toBe("noopener noreferrer");
    });
  });

  it("opens each link in a new tab", async () => {
    const wrapper = await mountList({ items: defaultItems });
    const links = wrapper.findAll(".social-icons-list-link");
    links.forEach((link) => {
      expect(link.attributes("target")).toBe("_blank");
    });
  });

  it("uses the default aria-label on the list", async () => {
    const wrapper = await mountList({ items: defaultItems });
    expect(wrapper.attributes("aria-label")).toBe("Social media profiles");
  });

  it("uses a custom label prop as aria-label on the list", async () => {
    const wrapper = await mountList({ items: defaultItems, label: "Follow us" });
    expect(wrapper.attributes("aria-label")).toBe("Follow us");
  });

  it("renders an empty list when items is empty", async () => {
    const wrapper = await mountList({ items: [] });
    expect(wrapper.findAll(".social-icons-list-item").length).toBe(0);
  });

  it("applies styleClassPassthrough classes to the root element", async () => {
    const wrapper = await mountList({ items: defaultItems, styleClassPassthrough: ["custom-class", "another-class"] });
    expect(wrapper.classes()).toContain("custom-class");
    expect(wrapper.classes()).toContain("another-class");
  });

  it("renders the correct HTML structure", async () => {
    const wrapper = await mountList({ items: defaultItems });
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe("SocialIconsList link labels", () => {
  it("uses linkLabelTemplate for each link", async () => {
    const wrapper = await mountList({ items: defaultItems, linkLabelTemplate: "Profil {network}" });
    expect(wrapper.findAll(".social-icons-list-link")[0]!.attributes("aria-label")).toBe("Profil Facebook");
  });

  it("lets an item's own label override the template", async () => {
    const wrapper = await mountList({ items: [{ ...defaultItems[0]!, label: "Our Facebook page" }] });
    expect(wrapper.find(".social-icons-list-link").attributes("aria-label")).toBe("Our Facebook page");
  });

  it("hides the icon from assistive tech (the link carries the name)", async () => {
    const wrapper = await mountList({ items: defaultItems });
    expect(wrapper.find(".social-icons-list-icon-wrapper").attributes("aria-hidden")).toBe("true");
  });
});

describe("SocialIconsList hostile data", () => {
  it("announces as a list even with list-style: none (Safari/VoiceOver)", async () => {
    const wrapper = await mountList({ items: defaultItems });
    expect(wrapper.attributes("role")).toBe("list");
  });

  it("renders every item when two share a networkName", async () => {
    const twoInstagrams: ISocialIcon[] = [
      { ...defaultItems[1]!, profileId: "salon" },
      { ...defaultItems[1]!, profileId: "academy" },
    ];
    const wrapper = await mountList({ items: twoInstagrams });
    const hrefs = wrapper.findAll(".social-icons-list-link").map((link) => link.attributes("href"));
    expect(hrefs).toEqual(["https://www.instagram.com/salon", "https://www.instagram.com/academy"]);
  });

  it("skips an item whose href isn't http(s), mailto, tel or site-relative", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = await mountList({
      items: [
        { ...defaultItems[0]!, baseHref: "javascript:", profileId: "alert(1)" },
        { ...defaultItems[0]!, baseHref: " JavaScript:", profileId: "alert(1)" },
        { ...defaultItems[0]!, baseHref: "//evil.example/", profileId: "x" },
        defaultItems[1]!,
      ],
    });
    const links = wrapper.findAll(".social-icons-list-link");
    expect(links.length).toBe(1);
    expect(links[0]!.attributes("href")).toBe("https://www.instagram.com/testhandle");
  });

  it("keeps mailto, tel and site-relative hrefs", async () => {
    const wrapper = await mountList({
      items: [
        { networkName: "Email", iconName: "mdi:email", baseHref: "mailto:", profileId: "hello@example.com" },
        { networkName: "Phone", iconName: "mdi:phone", baseHref: "tel:", profileId: "+441234567890" },
        { networkName: "Contact", iconName: "mdi:account", baseHref: "/", profileId: "contact" },
      ],
    });
    const hrefs = wrapper.findAll(".social-icons-list-link").map((link) => link.attributes("href"));
    expect(hrefs).toEqual(["mailto:hello@example.com", "tel:+441234567890", "/contact"]);
  });
});

describe("SocialIconsList labels, slots and brand colour", () => {
  it("renders no visible label by default", async () => {
    const wrapper = await mountList({ items: defaultItems });
    expect(wrapper.find(".social-icons-list-label").exists()).toBe(false);
  });

  it("shows each networkName as visible text with showLabel, keeping the aria-label", async () => {
    const wrapper = await mountList({ items: defaultItems, showLabel: true });
    const labels = wrapper.findAll(".social-icons-list-label").map((label) => label.text());
    expect(labels).toEqual(["Facebook", "Instagram", "YouTube"]);
    expect(wrapper.find(".social-icons-list-link").attributes("aria-label")).toBe("Facebook profile (opens in a new tab)");
  });

  it("sets --social-icons-list-brand-colour on an item only when it has a brandColour", async () => {
    const wrapper = await mountList({ items: [{ ...defaultItems[0]!, brandColour: "#1877f2" }, defaultItems[1]!] });
    const items = wrapper.findAll(".social-icons-list-item");
    expect((items[0]!.element as HTMLElement).style.getPropertyValue("--social-icons-list-brand-colour")).toBe("#1877f2");
    expect((items[1]!.element as HTMLElement).style.getPropertyValue("--social-icons-list-brand-colour")).toBe("");
  });

  it("replaces the icon with the scoped icon slot, inside the wrapper", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems },
      slots: { icon: ({ item }: { item: ISocialIcon }) => h("b", { class: "custom-icon" }, item.networkName[0]) },
    });
    mounted.push(wrapper);
    const custom = wrapper.findAll(".social-icons-list-icon-wrapper .custom-icon");
    expect(custom.map((el) => el.text())).toEqual(["F", "I", "Y"]);
    expect(wrapper.find(".social-icons-list-icon").exists()).toBe(false);
  });

  it("renders the scoped label slot without showLabel", async () => {
    const wrapper = await mountSuspended(SocialIconsList, {
      props: { items: defaultItems },
      slots: { label: ({ item }: { item: ISocialIcon }) => `@${item.profileId}` },
    });
    mounted.push(wrapper);
    expect(wrapper.find(".social-icons-list-label").text()).toBe("@testprofile");
  });
});
