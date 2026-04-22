import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import BannerVideo from "../BannerVideo.vue";

const defaultProps = {
  src: "/images/banners/video/lake-banner.mp4",
  poster: "/images/banners/video/lake-banner.jpg",
};

describe("BannerVideo", () => {
  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default props)", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (all props set)", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: {
        ...defaultProps,
        tag: "header",
        alt: "Lake banner",
        imgWidth: 1280,
        imgHeight: 720,
        height: "40rem",
        styleClassPassthrough: ["full-bleed"],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ────────────────────────────────────────────────────────

  it("renders a <section> as the root element by default", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  it("renders the specified tag as root", async () => {
    for (const tag of ["div", "header", "main", "article"] as const) {
      const wrapper = await mountSuspended(BannerVideo, {
        props: { ...defaultProps, tag },
      });
      expect(wrapper.element.tagName).toBe(tag.toUpperCase());
    }
  });

  it("always has the banner-video class", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.classes()).toContain("banner-video");
  });

  // ─── Video element ───────────────────────────────────────────────────────

  it("renders a video element", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").exists()).toBe(true);
  });

  it("video has the video class", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").classes()).toContain("video");
  });

  it("video has autoplay attribute", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").attributes()).toHaveProperty("autoplay");
  });

  it("video has muted attribute", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").attributes()).toHaveProperty("muted");
  });

  it("video has loop attribute", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").attributes()).toHaveProperty("loop");
  });

  it("video has playsinline attribute", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").attributes()).toHaveProperty("playsinline");
  });

  it("video has the poster attribute set to the poster prop", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").attributes("poster")).toBe(defaultProps.poster);
  });

  it("video element has preload=auto", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").attributes("preload")).toBe("auto");
  });

  it("source element has the correct src", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("source").attributes("src")).toBe(defaultProps.src);
  });

  it("source element has type video/mp4", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("source").attributes("type")).toBe("video/mp4");
  });

  it("calls play() when loadeddata fires", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    (wrapper.find("video").element as HTMLVideoElement).play = play;
    await wrapper.find("video").trigger("loadeddata");
    expect(play).toHaveBeenCalled();
  });

  it("calls play() when canplay fires", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    (wrapper.find("video").element as HTMLVideoElement).play = play;
    await wrapper.find("video").trigger("canplay");
    expect(play).toHaveBeenCalled();
  });

  // ─── Fallback image ──────────────────────────────────────────────────────

  it("renders a NuxtImg fallback element", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").exists()).toBe(true);
  });

  it("fallback image has the fallback class", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").classes()).toContain("fallback");
  });

  it("fallback image src contains the poster filename", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const src = wrapper.find("img[data-nuxt-img]").attributes("src") ?? "";
    expect(src).toContain("lake-banner.jpg");
  });

  it("fallback image alt defaults to empty string", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").attributes("alt")).toBe("");
  });

  it("fallback image alt reflects the alt prop", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, alt: "A serene lake" },
    });
    expect(wrapper.find("img[data-nuxt-img]").attributes("alt")).toBe("A serene lake");
  });

  it("fallback image width defaults to 1920", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").attributes("width")).toBe("1920");
  });

  it("fallback image height defaults to 1080", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").attributes("height")).toBe("1080");
  });

  it("fallback image uses custom imgWidth and imgHeight when provided", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, imgWidth: 1280, imgHeight: 720 },
    });
    const img = wrapper.find("img[data-nuxt-img]");
    expect(img.attributes("width")).toBe("1280");
    expect(img.attributes("height")).toBe("720");
  });

  it("fallback image has loading=eager", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").attributes("loading")).toBe("eager");
  });

  it("fallback image has decoding=async", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").attributes("decoding")).toBe("async");
  });

  // ─── CSS custom properties ───────────────────────────────────────────────

  it("sets --_max-height to 56rem by default", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_max-height")).toBe("56rem");
  });

  it("reflects maxHeight prop in --_max-height", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, maxHeight: "80rem" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_max-height")).toBe("80rem");
  });

  it("does not set --_max-height-tablet when maxHeightTablet is not provided", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_max-height-tablet")).toBe("");
  });

  it("reflects maxHeightTablet prop in --_max-height-tablet", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, maxHeightTablet: "48rem" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_max-height-tablet")).toBe("48rem");
  });

  it("does not set --_max-height-mobile when maxHeightMobile is not provided", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_max-height-mobile")).toBe("");
  });

  it("reflects maxHeightMobile prop in --_max-height-mobile", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, maxHeightMobile: "32rem" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_max-height-mobile")).toBe("32rem");
  });

  it("sets --_aspect-ratio to 21/9 by default", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_aspect-ratio")).toBe("21/9");
  });

  it("reflects aspectRatio prop in --_aspect-ratio", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, aspectRatio: "16/9" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_aspect-ratio")).toBe("16/9");
  });

  it("sets object-fit to cover on the video element by default", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.find("video").element as HTMLElement).style;
    expect(style.objectFit).toBe("cover");
  });

  it("reflects objectFit prop on the video element", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, objectFit: "contain" },
    });
    const style = (wrapper.find("video").element as HTMLElement).style;
    expect(style.objectFit).toBe("contain");
  });

  it("sets object-fit to cover on the fallback image by default", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.find("img[data-nuxt-img]").element as HTMLElement).style;
    expect(style.objectFit).toBe("cover");
  });

  it("reflects objectFit prop on the fallback image", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, objectFit: "contain" },
    });
    const style = (wrapper.find("img[data-nuxt-img]").element as HTMLElement).style;
    expect(style.objectFit).toBe("contain");
  });

  it("video element does not have object-position style", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.find("video").element as HTMLElement).style;
    expect(style.objectPosition).toBe("");
  });

  it("sets --_align-self to center by default", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_align-self")).toBe("center");
  });

  it("reflects verticalPosition prop in --_align-self", async () => {
    for (const [prop, expected] of [["start", "start"], ["end", "end"]] as const) {
      const wrapper = await mountSuspended(BannerVideo, {
        props: { ...defaultProps, verticalPosition: prop },
      });
      expect((wrapper.element as HTMLElement).style.getPropertyValue("--_align-self")).toBe(expected);
    }
  });

  it("sets --_justify-self to center by default", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_justify-self")).toBe("center");
  });

  it("reflects horizontalPosition prop in --_justify-self", async () => {
    for (const [prop, expected] of [["start", "start"], ["end", "end"]] as const) {
      const wrapper = await mountSuspended(BannerVideo, {
        props: { ...defaultProps, horizontalPosition: prop },
      });
      expect((wrapper.element as HTMLElement).style.getPropertyValue("--_justify-self")).toBe(expected);
    }
  });

  it("fallback image object-position defaults to center center", async () => {
    const wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.find("img[data-nuxt-img]").element as HTMLElement).style;
    expect(style.objectPosition).toBe("center center");
  });

  it("fallback image object-position reflects verticalPosition", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, verticalPosition: "start" },
    });
    const style = (wrapper.find("img[data-nuxt-img]").element as HTMLElement).style;
    expect(style.objectPosition).toBe("center top");
  });

  it("fallback image object-position reflects horizontalPosition", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, horizontalPosition: "end" },
    });
    const style = (wrapper.find("img[data-nuxt-img]").element as HTMLElement).style;
    expect(style.objectPosition).toBe("right center");
  });

  it("fallback image object-position reflects both verticalPosition and horizontalPosition", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, verticalPosition: "end", horizontalPosition: "start" },
    });
    const style = (wrapper.find("img[data-nuxt-img]").element as HTMLElement).style;
    expect(style.objectPosition).toBe("left bottom");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string to the root", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, styleClassPassthrough: "full-bleed" },
    });
    expect(wrapper.classes()).toContain("full-bleed");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, styleClassPassthrough: ["full-bleed", "mbe-0"] },
    });
    expect(wrapper.classes()).toContain("full-bleed");
    expect(wrapper.classes()).toContain("mbe-0");
  });

  it("does not apply styleClassPassthrough to the video element", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, styleClassPassthrough: "full-bleed" },
    });
    expect(wrapper.find("video").classes()).not.toContain("full-bleed");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });
});
