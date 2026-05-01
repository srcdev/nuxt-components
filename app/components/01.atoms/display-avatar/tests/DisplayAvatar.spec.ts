import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayAvatar from "../DisplayAvatar.vue";
import DisplayChip from "../../../02.molecules/display-chip/DisplayChip.vue";

describe("DisplayAvatar", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DisplayAvatar);
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default)", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { alt: "John Doe" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (with src)", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { src: "/avatar.jpg", alt: "John Doe", size: "lg" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (with chip)", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { alt: "John Doe", chip: true },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders as <span> by default", async () => {
    const wrapper = await mountSuspended(DisplayAvatar);
    expect(wrapper.element.tagName).toBe("SPAN");
  });

  it("renders as the element specified by the as prop", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { as: "div" },
    });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders as DisplayChip when chip prop is set", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { chip: true },
    });
    expect(wrapper.findComponent(DisplayChip).exists()).toBe(true);
  });

  // ─── Base class ───────────────────────────────────────────────────────────

  it("always has the display-avatar class", async () => {
    const wrapper = await mountSuspended(DisplayAvatar);
    expect(wrapper.classes()).toContain("display-avatar");
  });

  // ─── Size ─────────────────────────────────────────────────────────────────

  it("applies md size class by default", async () => {
    const wrapper = await mountSuspended(DisplayAvatar);
    expect(wrapper.classes()).toContain("md");
  });

  it.each(["xs", "s", "md", "lg", "xl"] as const)("applies %s size class when size='%s'", async (size) => {
    const wrapper = await mountSuspended(DisplayAvatar, { props: { size } });
    expect(wrapper.classes()).toContain(size);
  });

  // ─── Fallback text ────────────────────────────────────────────────────────

  it("shows initials derived from alt when no src or text is set", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { alt: "John Doe" },
    });
    expect(wrapper.find("span").text()).toBe("JD");
  });

  it("caps initials at two characters", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { alt: "Alice Bob Charlie" },
    });
    expect(wrapper.find("span").text()).toBe("AB");
  });

  it("shows single initial for a single-word alt", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { alt: "Alice" },
    });
    expect(wrapper.find("span").text()).toBe("A");
  });

  it("shows text prop instead of alt-derived initials when text is set", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { alt: "John Doe", text: "?" },
    });
    expect(wrapper.find("span").text()).toBe("?");
  });

  it("shows empty fallback when neither src, text, nor alt are set", async () => {
    const wrapper = await mountSuspended(DisplayAvatar);
    expect(wrapper.find("span").text()).toBe("");
  });

  // ─── Image ────────────────────────────────────────────────────────────────

  it("renders an image element when src is provided", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { src: "/avatar.jpg" },
    });
    expect(wrapper.find(".avatar-image").exists()).toBe(true);
  });

  it("does not render an image element when src is not provided", async () => {
    const wrapper = await mountSuspended(DisplayAvatar);
    expect(wrapper.find(".avatar-image").exists()).toBe(false);
  });

  it("falls back to 'Avatar' as alt text when src is set but alt is not", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { src: "/avatar.jpg" },
    });
    expect(wrapper.find(".avatar-image").attributes("alt")).toBe("Avatar");
  });

  it("uses the alt prop as alt text on the image", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { src: "/avatar.jpg", alt: "Profile picture" },
    });
    expect(wrapper.find(".avatar-image").attributes("alt")).toBe("Profile picture");
  });

  // ─── Slots ────────────────────────────────────────────────────────────────

  it("renders default slot content instead of the fallback", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { alt: "John Doe" },
      slots: { default: "<img class='custom-avatar' src='/x.jpg' alt='x' />" },
    });
    expect(wrapper.find(".custom-avatar").exists()).toBe(true);
    expect(wrapper.text()).not.toContain("JD");
  });

  it("renders icon slot content", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      slots: { icon: "<span class='status-icon'>●</span>" },
    });
    expect(wrapper.find(".status-icon").exists()).toBe(true);
  });

  // ─── Chip ─────────────────────────────────────────────────────────────────

  it("passes chipDefaultConfig when chip=true", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { chip: true },
    });
    const chip = wrapper.findComponent(DisplayChip);
    expect(chip.props("config")).toMatchObject({
      size: "12px",
      maskWidth: "4px",
      offset: "0px",
      angle: "90deg",
    });
  });

  it("passes custom config when chip is an object", async () => {
    const chipConfig = { size: "16px", maskWidth: "2px", offset: "4px", angle: "45deg" };
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { chip: chipConfig },
    });
    const chip = wrapper.findComponent(DisplayChip);
    expect(chip.props("config")).toMatchObject(chipConfig);
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { styleClassPassthrough: "online" },
    });
    expect(wrapper.classes()).toContain("online");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { styleClassPassthrough: ["online", "featured"] },
    });
    expect(wrapper.classes()).toContain("online");
    expect(wrapper.classes()).toContain("featured");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(DisplayAvatar, {
      props: { styleClassPassthrough: ["online"] },
    });
    expect(wrapper.classes()).toContain("online");
    await wrapper.setProps({ styleClassPassthrough: ["offline"] });
    expect(wrapper.classes()).not.toContain("online");
    expect(wrapper.classes()).toContain("offline");
  });
});
