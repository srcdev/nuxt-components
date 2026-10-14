import { describe, it, expect } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
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

  it("renders no profile-info blocks when no profile-info slots are given", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
    });
    expect(wrapper.findAll(".profile-section-info-block").length).toBe(0);
  });

  it("renders one block per provided profile-info slot, in numeric order, with gaps", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
      slots: {
        "profile-info-10": "<p>Ten</p>",
        "profile-info-3": "<p>Three</p>",
        "profile-info-1": "<p>One</p>",
      },
    });
    expect(wrapper.findAll(".profile-section-info-block").map((b) => b.text())).toEqual(["One", "Three", "Ten"]);
  });

  it("renders named profile-info slot content", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
      slots: {
        "profile-info-1": "<p>First info block</p>",
        "profile-info-2": "<p>Second info block</p>",
      },
    });
    expect(wrapper.html()).toContain("First info block");
    expect(wrapper.html()).toContain("Second info block");
  });

  it("does not render eyebrowText slot area when slot is not provided", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
    });
    expect(wrapper.html()).not.toContain("eyebrow");
  });

  it("renders eyebrowText slot content when provided", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
      slots: {
        eyebrowText: "<p class='eyebrow'>About the author</p>",
      },
    });
    expect(wrapper.find(".eyebrow").exists()).toBe(true);
    expect(wrapper.html()).toContain("About the author");
  });

  it("does not render heroText slot area when slot is not provided", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
    });
    expect(wrapper.find("header h1, header h2, header h3, header h4, header h5, header h6").exists()).toBe(false);
  });

  it("renders heroText slot content when provided", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
      slots: {
        heroText: "<h2 class='hero-heading'>My Heading</h2>",
      },
    });
    expect(wrapper.find(".hero-heading").exists()).toBe(true);
    expect(wrapper.html()).toContain("My Heading");
  });

  it("adds aria-labelledby when tag is section", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { ...defaultProps, tag: "section" },
    });
    const root = wrapper.find(".profile-section");
    expect(root.attributes("aria-labelledby")).toBeTruthy();
  });

  it("adds aria-labelledby when tag is article", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { ...defaultProps, tag: "article" },
    });
    const root = wrapper.find(".profile-section");
    expect(root.attributes("aria-labelledby")).toBeTruthy();
  });

  it("exposes headingId via heroText scoped slot and aria-labelledby matches the heading id", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { ...defaultProps, tag: "section" },
      slots: {
        heroText: (props: Record<string, unknown>) =>
          h("h2", { id: props.headingId, class: "hero-heading" }, "My Heading"),
      },
    });
    const labelledBy = wrapper.find(".profile-section").attributes("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(wrapper.find(".hero-heading").attributes("id")).toBe(labelledBy);
  });

  it("does not add aria-labelledby when tag is div", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { ...defaultProps, tag: "div" },
    });
    expect(wrapper.find(".profile-section").attributes("aria-labelledby")).toBeUndefined();
  });

  it("does not add aria-labelledby when tag is main (main never needs an accessible name)", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { ...defaultProps, tag: "main" },
    });
    expect(wrapper.find(".profile-section").attributes("aria-labelledby")).toBeUndefined();
  });

  it("does not render profile-links section when slot is not provided", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
    });
    expect(wrapper.find(".profile-section-links").exists()).toBe(false);
  });

  it("renders profile-links section when profileLinks slot is provided", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: defaultProps,
      slots: {
        profileLinks: "<a href='/'>Link</a>",
      },
    });
    expect(wrapper.find(".profile-section-links").exists()).toBe(true);
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

  // ─── Stress test 2026-10-14 ────────────────────────────────────────────────

  it("does not render an empty header when neither header slot is given", async () => {
    const wrapper = await mountSuspended(ProfileSection, { props: defaultProps });
    expect(wrapper.find(".profile-section-header").exists()).toBe(false);
  });

  it("adds and removes the header and info blocks when slots are toggled after mount", async () => {
    const show = ref(false);
    const Host = defineComponent({
      components: { ProfileSection },
      setup: () => ({ show, defaultProps }),
      template: `
        <ProfileSection v-bind="defaultProps">
          <template v-if="show" #heroText><h2>Heading</h2></template>
          <template v-if="show" #profile-info-1><p>Info</p></template>
        </ProfileSection>
      `,
    });
    const wrapper = await mountSuspended(Host);
    expect(wrapper.find(".profile-section-header").exists()).toBe(false);
    expect(wrapper.findAll(".profile-section-info-block").length).toBe(0);

    show.value = true;
    await nextTick();
    expect(wrapper.find(".profile-section-header").exists()).toBe(true);
    expect(wrapper.findAll(".profile-section-info-block").length).toBe(1);

    show.value = false;
    await nextTick();
    expect(wrapper.find(".profile-section-header").exists()).toBe(false);
    expect(wrapper.findAll(".profile-section-info-block").length).toBe(0);
  });

  it("uses the given picture width and height", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { profilePicture: { src: "/a.jpg", alt: "A", width: 640, height: 480 } },
    });
    expect(wrapper.find("img").attributes("width")).toBe("640");
    expect(wrapper.find("img").attributes("height")).toBe("480");
  });

  it.each([0, -100, Number.NaN, Number.POSITIVE_INFINITY])(
    "falls back to 828x1104 for an invalid picture size (%s)",
    async (size) => {
      const wrapper = await mountSuspended(ProfileSection, {
        props: { profilePicture: { src: "/a.jpg", alt: "A", width: size, height: size } },
      });
      expect(wrapper.find("img").attributes("width")).toBe("828");
      expect(wrapper.find("img").attributes("height")).toBe("1104");
    }
  );

  it("renders HTML-like alt text as text", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { profilePicture: { src: "/a.jpg", alt: "<script>alert(1)</script>" } },
    });
    expect(wrapper.find("script").exists()).toBe(false);
    expect(wrapper.find("img").attributes("alt")).toBe("<script>alert(1)</script>");
  });

  // ─── headerPlacement ─────────────────────────────────────────────────────────────────────────────────────────────────────────

  const headerSlots = {
    eyebrowText: "<p class='eyebrow'>About</p>",
    heroText: (props: Record<string, unknown>) => h("h2", { id: props.headingId, class: "hero-heading" }, "Heading"),
  };

  it("renders the header above the grid by default", async () => {
    const wrapper = await mountSuspended(ProfileSection, { props: defaultProps, slots: headerSlots });
    expect(wrapper.find(".profile-section > .profile-section-header").exists()).toBe(true);
    expect(wrapper.find(".profile-section-picture .profile-section-header").exists()).toBe(false);
    expect(wrapper.attributes("data-header-placement")).toBe("above");
  });

  it("renders the header inside the picture frame, before the image, for picture-bottom", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { ...defaultProps, headerPlacement: "picture-bottom" },
      slots: headerSlots,
    });
    expect(wrapper.attributes("data-header-placement")).toBe("picture-bottom");
    expect(wrapper.findAll(".profile-section-header").length).toBe(1);
    const picture = wrapper.find(".profile-section-picture");
    expect(picture.element.firstElementChild?.classList.contains("profile-section-header")).toBe(true);
    expect(picture.find(".eyebrow").exists()).toBe(true);
    expect(picture.find(".hero-heading").exists()).toBe(true);
  });

  it("keeps aria-labelledby pointing at the heading when it is inside the picture", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { ...defaultProps, tag: "section", headerPlacement: "picture-bottom" },
      slots: headerSlots,
    });
    expect(wrapper.attributes("aria-labelledby")).toBe(wrapper.find(".hero-heading").attributes("id"));
  });

  it("renders no header in the picture when no header slot is given", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { ...defaultProps, headerPlacement: "picture-bottom" },
    });
    expect(wrapper.find(".profile-section-header").exists()).toBe(false);
  });

  it("moves the header when headerPlacement changes after mount", async () => {
    const wrapper = await mountSuspended(ProfileSection, { props: defaultProps, slots: headerSlots });
    await wrapper.setProps({ headerPlacement: "picture-bottom" });
    expect(wrapper.find(".profile-section-picture .profile-section-header").exists()).toBe(true);
    expect(wrapper.find(".profile-section > .profile-section-header").exists()).toBe(false);
  });

  it("renders the header inside the picture for picture-top too", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { ...defaultProps, headerPlacement: "picture-top" },
      slots: headerSlots,
    });
    expect(wrapper.attributes("data-header-placement")).toBe("picture-top");
    expect(wrapper.find(".profile-section-picture > .profile-section-header").exists()).toBe(true);
    expect(wrapper.find(".profile-section > .profile-section-header").exists()).toBe(false);
  });

  it("moves the header back above the grid when headerPlacement returns to above", async () => {
    const wrapper = await mountSuspended(ProfileSection, {
      props: { ...defaultProps, headerPlacement: "picture-top" },
      slots: headerSlots,
    });
    await wrapper.setProps({ headerPlacement: "above" });
    expect(wrapper.find(".profile-section > .profile-section-header").exists()).toBe(true);
    expect(wrapper.find(".profile-section-picture .profile-section-header").exists()).toBe(false);
  });
});
