import { describe, it, expect, vi, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import BannerVideo from "../BannerVideo.vue";

type Wrapper = Awaited<ReturnType<typeof mountSuspended>>;

const defaultProps = {
  src: "/images/banners/video/lake-banner.mp4",
  poster: "/images/banners/video/lake-banner.jpg",
};

describe("BannerVideo", () => {
  let wrapper: Wrapper | undefined;

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.restoreAllMocks();
  });

  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshots ───────────────────────────────────────────────────────────

  it("renders correct HTML structure (default props)", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders correct HTML structure (all props set)", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: {
        ...defaultProps,
        tag: "header",
        alt: "Lake banner",
        imgWidth: 1280,
        imgHeight: 720,
        depth: "xl",
        aspectRatio: "16/9",
        styleClassPassthrough: ["full-bleed"],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ────────────────────────────────────────────────────────

  it("renders a <div> as the root element by default", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.element.tagName).toBe("DIV");
  });

  it("renders the specified tag as root", async () => {
    for (const tag of ["div", "header", "main", "article"] as const) {
      wrapper = await mountSuspended(BannerVideo, {
        props: { ...defaultProps, tag },
      });
      expect(wrapper.element.tagName).toBe(tag.toUpperCase());
      wrapper.unmount();
    }
  });

  it("always has the banner-video class", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.classes()).toContain("banner-video");
  });

  // ─── Video element ───────────────────────────────────────────────────────

  it("renders a video element", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").exists()).toBe(true);
  });

  it("video has the banner-video-media class", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").classes()).toContain("banner-video-media");
  });

  it("video has autoplay attribute", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").attributes()).toHaveProperty("autoplay");
  });

  it("video has muted attribute", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").attributes()).toHaveProperty("muted");
  });

  it("video has loop attribute", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").attributes()).toHaveProperty("loop");
  });

  it("video has playsinline attribute", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").attributes()).toHaveProperty("playsinline");
  });

  it("video has the poster attribute set to the poster prop", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").attributes("poster")).toBe(defaultProps.poster);
  });

  it("video element has preload=auto", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("video").attributes("preload")).toBe("auto");
  });

  it("source element has the correct src", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("source").attributes("src")).toBe(defaultProps.src);
  });

  it("source element has type video/mp4", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("source").attributes("type")).toBe("video/mp4");
  });

  it("calls play() when loadeddata fires", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    (wrapper.find("video").element as HTMLVideoElement).play = play;
    await wrapper.find("video").trigger("loadeddata");
    expect(play).toHaveBeenCalled();
  });

  it("calls play() when canplay fires", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    (wrapper.find("video").element as HTMLVideoElement).play = play;
    await wrapper.find("video").trigger("canplay");
    expect(play).toHaveBeenCalled();
  });

  // ─── Pause/play toggle (WCAG 2.2.2) ─────────────────────────────────────

  it("renders a pause/play toggle button", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find(".banner-video-toggle").exists()).toBe(true);
  });

  it("toggle label reads 'Pause background video' once playback starts", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    await wrapper.find("video").trigger("play");
    expect(wrapper.find(".banner-video-toggle").find(".input-button-text").text()).toBe("Pause background video");
  });

  it("toggle reads 'Play background video' before playback has started", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find(".banner-video-toggle").find(".input-button-text").text()).toBe("Play background video");
  });

  it("clicking the toggle calls pause() while playing", async () => {
    const pause = vi.fn();
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const videoElement = wrapper.find("video").element as HTMLVideoElement;
    videoElement.pause = pause;
    Object.defineProperty(videoElement, "paused", { value: false, configurable: true });
    await wrapper.find(".banner-video-toggle").trigger("click");
    expect(pause).toHaveBeenCalled();
  });

  it("clicking the toggle calls play() while paused", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const videoElement = wrapper.find("video").element as HTMLVideoElement;
    videoElement.play = play;
    Object.defineProperty(videoElement, "paused", { value: true, configurable: true });
    await wrapper.find(".banner-video-toggle").trigger("click");
    expect(play).toHaveBeenCalled();
  });

  it("updates the toggle label to 'Play background video' after the video pauses", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    await wrapper.find("video").trigger("play");
    await wrapper.find("video").trigger("pause");
    expect(wrapper.find(".banner-video-toggle").find(".input-button-text").text()).toBe("Play background video");
  });

  it("renders the toggle as an icon-only InputButton with a visually hidden label", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const toggle = wrapper.find(".banner-video-toggle");
    expect(toggle.classes()).toContain("input-button");
    expect(toggle.attributes("type")).toBe("button");
    expect(toggle.attributes("data-variant")).toBe("inline");
    expect(toggle.attributes()).toHaveProperty("data-icon-only");
    expect(toggle.find(".input-button-text").classes()).toContain("sr-only");
    expect(toggle.attributes("aria-label")).toBeUndefined();
  });

  it("uses custom playLabel and pauseLabel", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, playLabel: "Video abspielen", pauseLabel: "Video anhalten" },
    });
    const label = () => wrapper!.find(".banner-video-toggle .input-button-text").text();
    expect(label()).toBe("Video abspielen");
    await wrapper.find("video").trigger("play");
    expect(label()).toBe("Video anhalten");
  });

  // ─── Fallback image ──────────────────────────────────────────────────────

  it("renders a NuxtImg fallback element", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").exists()).toBe(true);
  });

  it("fallback image has the banner-video-fallback class", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").classes()).toContain("banner-video-fallback");
  });

  it("fallback image src contains the poster filename", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const src = wrapper.find("img[data-nuxt-img]").attributes("src") ?? "";
    expect(src).toContain("lake-banner.jpg");
  });

  it("fallback image alt defaults to empty string", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").attributes("alt")).toBe("");
  });

  it("fallback image alt reflects the alt prop", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, alt: "A serene lake" },
    });
    expect(wrapper.find("img[data-nuxt-img]").attributes("alt")).toBe("A serene lake");
  });

  it("fallback image width defaults to 1920", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").attributes("width")).toBe("1920");
  });

  it("fallback image height defaults to 1080", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").attributes("height")).toBe("1080");
  });

  it("fallback image uses custom imgWidth and imgHeight when provided", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, imgWidth: 1280, imgHeight: 720 },
    });
    const img = wrapper.find("img[data-nuxt-img]");
    expect(img.attributes("width")).toBe("1280");
    expect(img.attributes("height")).toBe("720");
  });

  it("fallback image has loading=eager", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").attributes("loading")).toBe("eager");
  });

  it("fallback image has decoding=async", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find("img[data-nuxt-img]").attributes("decoding")).toBe("async");
  });

  // ─── depth / data-depth ──────────────────────────────────────────────────

  it("sets data-depth to md by default", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.attributes("data-depth")).toBe("md");
  });

  it.each(["xs", "sm", "md", "lg", "xl"] as const)("sets data-depth to %s when depth prop is %s", async (depth) => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, depth },
    });
    expect(wrapper.attributes("data-depth")).toBe(depth);
  });

  // ─── CSS custom properties ───────────────────────────────────────────────

  it("sets --_aspect-ratio to 21/9 by default", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_aspect-ratio")).toBe("21/9");
  });

  it("reflects aspectRatio prop in --_aspect-ratio", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, aspectRatio: "16/9" },
    });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_aspect-ratio")).toBe("16/9");
  });

  it.each(["4/3", "1", "1.5", " 16 / 9 ", "2.35/1"])("accepts a valid aspectRatio %j", async (aspectRatio) => {
    wrapper = await mountSuspended(BannerVideo, { props: { ...defaultProps, aspectRatio } });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_aspect-ratio")).toBe(aspectRatio.trim());
  });

  it.each(["", "abc", "0", "0/9", "16/0", "-16/9", "16/9/4", "16:9"])(
    "falls back to 21/9 for an invalid aspectRatio %j",
    async (aspectRatio) => {
      wrapper = await mountSuspended(BannerVideo, { props: { ...defaultProps, aspectRatio } });
      const style = (wrapper.element as HTMLElement).style;
      expect(style.getPropertyValue("--_aspect-ratio")).toBe("21/9");
    }
  );

  it("sets object-fit to cover on the video element by default", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.find("video").element as HTMLElement).style;
    expect(style.objectFit).toBe("cover");
  });

  it("reflects objectFit prop on the video element", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, objectFit: "contain" },
    });
    const style = (wrapper.find("video").element as HTMLElement).style;
    expect(style.objectFit).toBe("contain");
  });

  it("sets object-fit to cover on the fallback image by default", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.find("img[data-nuxt-img]").element as HTMLElement).style;
    expect(style.objectFit).toBe("cover");
  });

  it("reflects objectFit prop on the fallback image", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, objectFit: "contain" },
    });
    const style = (wrapper.find("img[data-nuxt-img]").element as HTMLElement).style;
    expect(style.objectFit).toBe("contain");
  });

  it("video element does not have object-position style", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.find("video").element as HTMLElement).style;
    expect(style.objectPosition).toBe("");
  });

  it("sets --_align-self to center by default", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_align-self")).toBe("center");
  });

  it("reflects verticalPosition prop in --_align-self", async () => {
    for (const [prop, expected] of [
      ["start", "start"],
      ["end", "end"],
    ] as const) {
      wrapper = await mountSuspended(BannerVideo, {
        props: { ...defaultProps, verticalPosition: prop },
      });
      expect((wrapper.element as HTMLElement).style.getPropertyValue("--_align-self")).toBe(expected);
      wrapper.unmount();
    }
  });

  it("sets --_justify-self to center by default", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.element as HTMLElement).style;
    expect(style.getPropertyValue("--_justify-self")).toBe("center");
  });

  it("reflects horizontalPosition prop in --_justify-self", async () => {
    for (const [prop, expected] of [
      ["start", "start"],
      ["end", "end"],
    ] as const) {
      wrapper = await mountSuspended(BannerVideo, {
        props: { ...defaultProps, horizontalPosition: prop },
      });
      expect((wrapper.element as HTMLElement).style.getPropertyValue("--_justify-self")).toBe(expected);
      wrapper.unmount();
    }
  });

  it("fallback image object-position defaults to center center", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    const style = (wrapper.find("img[data-nuxt-img]").element as HTMLElement).style;
    expect(style.objectPosition).toBe("center center");
  });

  it("fallback image object-position reflects verticalPosition", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, verticalPosition: "start" },
    });
    const style = (wrapper.find("img[data-nuxt-img]").element as HTMLElement).style;
    expect(style.objectPosition).toBe("center top");
  });

  it("fallback image object-position reflects horizontalPosition", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, horizontalPosition: "end" },
    });
    const style = (wrapper.find("img[data-nuxt-img]").element as HTMLElement).style;
    expect(style.objectPosition).toBe("right center");
  });

  it("fallback image object-position reflects both verticalPosition and horizontalPosition", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, verticalPosition: "end", horizontalPosition: "start" },
    });
    const style = (wrapper.find("img[data-nuxt-img]").element as HTMLElement).style;
    expect(style.objectPosition).toBe("left bottom");
  });

  // ─── styleClassPassthrough ───────────────────────────────────────────────

  it("applies a single styleClassPassthrough string to the root", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, styleClassPassthrough: "full-bleed" },
    });
    expect(wrapper.classes()).toContain("full-bleed");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, styleClassPassthrough: ["full-bleed", "mbe-0"] },
    });
    expect(wrapper.classes()).toContain("full-bleed");
    expect(wrapper.classes()).toContain("mbe-0");
  });

  it("does not apply styleClassPassthrough to the video element", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, styleClassPassthrough: "full-bleed" },
    });
    expect(wrapper.find("video").classes()).not.toContain("full-bleed");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });

  // ─── Toggle icon ─────────────────────────────────────────────────────────

  it("renders the default play icon before playback starts", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    expect(wrapper.find(".banner-video-toggle").html()).toContain("mdi:play");
  });

  it("renders the default pause icon once playback starts", async () => {
    wrapper = await mountSuspended(BannerVideo, { props: defaultProps });
    await wrapper.find("video").trigger("play");
    expect(wrapper.find(".banner-video-toggle").html()).toContain("mdi:pause");
  });

  it("renders a custom playIcon", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, playIcon: "mdi:play-circle" },
    });
    expect(wrapper.find(".banner-video-toggle").html()).toContain("mdi:play-circle");
  });

  it("renders a custom pauseIcon", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: { ...defaultProps, pauseIcon: "mdi:pause-circle" },
    });
    await wrapper.find("video").trigger("play");
    expect(wrapper.find(".banner-video-toggle").html()).toContain("mdi:pause-circle");
  });

  it("replaces the toggle icon via the toggle-icon slot", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: defaultProps,
      slots: {
        "toggle-icon": '<span class="test-custom-icon">custom</span>',
      },
    });
    expect(wrapper.find(".test-custom-icon").exists()).toBe(true);
  });

  it("passes isPlaying to the toggle-icon slot", async () => {
    wrapper = await mountSuspended(BannerVideo, {
      props: defaultProps,
      slots: {
        "toggle-icon": `<span class="test-is-playing">{{ params.isPlaying }}</span>`,
      },
    });
    expect(wrapper.find(".test-is-playing").text()).toBe("false");
    await wrapper.find("video").trigger("play");
    expect(wrapper.find(".test-is-playing").text()).toBe("true");
  });
});
