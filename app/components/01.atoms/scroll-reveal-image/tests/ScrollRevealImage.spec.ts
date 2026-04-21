import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ScrollRevealImage from "../ScrollRevealImage.vue";

describe("ScrollRevealImage", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg", alt: "Test image" },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (all props set)", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: {
        src: "/images/test.jpg",
        alt: "All props",
        imgWidth: 800,
        imgHeight: 600,
        frameHeight: "400px",
        parallaxOffset: "20rem",
        focalX: "30%",
        radius: "1.6rem",
        styleClassPassthrough: ["custom-class"],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ────────────────────────────────────────────────────────

  it("renders a <figure> as the root element", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    expect(wrapper.element.tagName).toBe("FIGURE");
  });

  it("always has the reveal-frame class", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    expect(wrapper.classes()).toContain("reveal-frame");
  });

  // ─── CSS custom properties ───────────────────────────────────────────────

  it("sets --_frame-height to 540px by default", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_frame-height")).toBe("540px");
  });

  it("sets --_parallax-offset to 36rem by default", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_parallax-offset")).toBe("36rem");
  });

  it("sets --_radius to 0px by default", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_radius")).toBe("0px");
  });

  it("sets --_focal-x to 50% by default", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_focal-x")).toBe("50%");
  });

  it("reflects frameHeight prop in --_frame-height", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg", frameHeight: "80vh" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_frame-height")).toBe("80vh");
  });

  it("reflects parallaxOffset prop in --_parallax-offset", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg", parallaxOffset: "48rem" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_parallax-offset")).toBe("48rem");
  });

  it("reflects radius prop in --_radius", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg", radius: "2.4rem" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_radius")).toBe("2.4rem");
  });

  it("reflects focalX prop in --_focal-x", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg", focalX: "75%" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_focal-x")).toBe("75%");
  });

  // ─── Image element ───────────────────────────────────────────────────────

  it("renders an img child element with the reveal-image class", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    // NuxtImg resolves to a real <img> element in the Nuxt test environment,
    // identified by the data-nuxt-img attribute it injects.
    const img = wrapper.find("img[data-nuxt-img]");
    expect(img.exists()).toBe(true);
    expect(img.classes()).toContain("reveal-image");
  });

  it("passes src through to the image element", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/hero.jpg" },
    });
    // NuxtImg transforms the URL via /_ipx/, so check the original path is present.
    const src = wrapper.find("img[data-nuxt-img]").attributes("src") ?? "";
    expect(src).toContain("hero.jpg");
  });

  it("passes alt to the image element (default empty string)", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    expect(wrapper.find("img[data-nuxt-img]").attributes("alt")).toBe("");
  });

  it("passes alt to the image element when provided", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg", alt: "A hair portrait" },
    });
    expect(wrapper.find("img[data-nuxt-img]").attributes("alt")).toBe("A hair portrait");
  });

  it("passes imgWidth to the image element (default 1920)", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    expect(wrapper.find("img[data-nuxt-img]").attributes("width")).toBe("1920");
  });

  it("passes imgHeight to the image element (default 1080)", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    expect(wrapper.find("img[data-nuxt-img]").attributes("height")).toBe("1080");
  });

  it("passes custom imgWidth and imgHeight to the image element", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg", imgWidth: 1280, imgHeight: 1920 },
    });
    const img = wrapper.find("img[data-nuxt-img]");
    expect(img.attributes("width")).toBe("1280");
    expect(img.attributes("height")).toBe("1920");
  });

  it("sets loading=lazy on the image element", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    expect(wrapper.find("img[data-nuxt-img]").attributes("loading")).toBe("lazy");
  });

  it("sets decoding=async on the image element", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg" },
    });
    expect(wrapper.find("img[data-nuxt-img]").attributes("decoding")).toBe("async");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string to the root", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg", styleClassPassthrough: "hero-image" },
    });
    expect(wrapper.classes()).toContain("hero-image");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: {
        src: "/images/test.jpg",
        styleClassPassthrough: ["hero-image", "mbe-32"],
      },
    });
    expect(wrapper.classes()).toContain("hero-image");
    expect(wrapper.classes()).toContain("mbe-32");
  });

  it("does not apply styleClassPassthrough to the image element", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: {
        src: "/images/test.jpg",
        styleClassPassthrough: "hero-image",
      },
    });
    expect(wrapper.find("img[data-nuxt-img]").classes()).not.toContain("hero-image");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(ScrollRevealImage, {
      props: { src: "/images/test.jpg", styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
