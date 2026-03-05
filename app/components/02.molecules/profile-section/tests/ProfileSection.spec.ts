import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ProfileSection from "../ProfileSection.vue";

const defaultProps = {
  profilePicture: { src: "/images/test.jpg", alt: "Test profile picture" },
};

describe("ProfileSection", () => {
  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
    });
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: {
        ...defaultProps,
        styleClassPassthrough: ["custom-class"],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders as a div by default", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe("div");
  });

  it("renders with the correct tag when tag prop is provided", async () => {
    for (const tag of ["section", "article", "main"] as const) {
      const wrapper = await mountSuspended(ProfileSection, {
        props: { ...defaultProps, tag },
      });
      expect(wrapper.element.tagName.toLowerCase()).toBe(tag);
    }
  });

  it("renders profilePicture with correct src and alt", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: {
        profilePicture: { src: "/images/profile.jpg", alt: "Jane Doe" },
      },
    });
    const img = wrapper.find("img");
    expect(img.attributes("src")).toContain("profile.jpg");
    expect(img.attributes("alt")).toBe("Jane Doe");
  });

  it("renders 3 profile-info blocks by default", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
    });
    const blocks = wrapper.findAll(".profile-info-block");
    expect(blocks.length).toBe(3);
  });

  it("renders the correct number of profile-info blocks from profileInfoCount", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { ...defaultProps, profileInfoCount: 5 },
    });
    const blocks = wrapper.findAll(".profile-info-block");
    expect(blocks.length).toBe(5);
  });

  it("renders named profile-info slot content", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { ...defaultProps, profileInfoCount: 2 },
      slots: {
        "profile-info-1": "<p>First info block</p>",
        "profile-info-2": "<p>Second info block</p>",
      },
    });
    expect(wrapper.html()).toContain("First info block");
    expect(wrapper.html()).toContain("Second info block");
  });

  it("does not render profile-links section when slot is not provided", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
    });
    expect(wrapper.find(".profile-links").exists()).toBe(false);
  });

  it("renders profile-links section when profileLinks slot is provided", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
      slots: {
        profileLinks: "<a href='/'>Link</a>",
      },
    });
    expect(wrapper.find(".profile-links").exists()).toBe(true);
    expect(wrapper.html()).toContain("Link");
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: {
        ...defaultProps,
        styleClassPassthrough: ["extra-class", "another-class"],
      },
    });
    const el = wrapper.find(".profile-section");
    expect(el.classes()).toContain("extra-class");
    expect(el.classes()).toContain("another-class");
  });
});
