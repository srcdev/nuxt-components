import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import SliderGallery from "../SliderGallery.vue";
import type { IGalleryData } from "~/types/components";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockGalleryData: IGalleryData[] = [
  {
    src: "/images/slide-1.jpg",
    alt: "Slide 1",
    stylist: "Stylist One",
    title: "First Slide",
    category: "Fashion",
    description: "Description for first slide",
    thumbnail: { title: "Thumb 1", description: "Thumb desc 1" },
    textBrightness: "light",
  },
  {
    src: "/images/slide-2.jpg",
    alt: "Slide 2",
    title: "Second Slide",
    category: "Style",
    thumbnail: { title: "Thumb 2", description: "Thumb desc 2" },
    textBrightness: "dark",
  },
  {
    src: "/images/slide-3.jpg",
    alt: "Slide 3",
    textBrightness: "light",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type MockImageInstance = {
  src: string;
  onload: (() => void) | null;
  onerror: (() => void) | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Mount the gallery and simulate the first image loading successfully. */
async function mountAndLoad(galleryData: IGalleryData[], mockImage: MockImageInstance) {
  const wrapper = await mountSuspended(SliderGallery, {
    props: { galleryData },
  });
  mockImage.onload?.();
  await nextTick(); // let onMounted resume after Promise.race resolves
  vi.advanceTimersByTime(500); // fire the 500ms loading fade-out timeout
  await nextTick(); // let Vue update the DOM
  return wrapper;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("SliderGallery", () => {
  let mockImage: MockImageInstance;

  beforeEach(() => {
    mockImage = { src: "", onload: null, onerror: null };
    vi.stubGlobal(
      "Image",
      // Vitest 4: a mock's implementation must be a regular function (not an
      // arrow function) to remain constructible via `new`.
      vi.fn(function () {
        return mockImage;
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── Mount ───────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(SliderGallery);
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure after load", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("has slider-gallery class on root", async () => {
    const wrapper = await mountSuspended(SliderGallery);
    expect(wrapper.classes()).toContain("slider-gallery");
  });

  // ─── Loading state ────────────────────────────────────────────────────────

  it("shows loading state before images load", async () => {
    const wrapper = await mountSuspended(SliderGallery, {
      props: { galleryData: mockGalleryData },
    });
    expect(wrapper.find(".slider-gallery-loading").exists()).toBe(true);
  });

  it("hides gallery content before images load", async () => {
    const wrapper = await mountSuspended(SliderGallery, {
      props: { galleryData: mockGalleryData },
    });
    expect(wrapper.find(".slider-gallery-content").exists()).toBe(false);
  });

  it("shows gallery content after image loads", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    expect(wrapper.find(".slider-gallery-content").exists()).toBe(true);
  });

  it("dismisses loading state when galleryData is empty", async () => {
    const wrapper = await mountSuspended(SliderGallery, {
      props: { galleryData: [] },
    });
    await nextTick();
    // loading finishes → the loading block gains is-loaded
    expect(wrapper.find(".slider-gallery-loading.is-loaded").exists()).toBe(true);
  });

  it("resolves loading when first image errors", async () => {
    const wrapper = await mountSuspended(SliderGallery, {
      props: { galleryData: mockGalleryData },
    });
    mockImage.onerror?.();
    await nextTick();
    await nextTick(); // extra tick — onerror → resolve → Promise.race → onMounted resume
    vi.advanceTimersByTime(500);
    await nextTick();
    expect(wrapper.find(".slider-gallery-content").exists()).toBe(true);
  });

  // ─── Gallery items ────────────────────────────────────────────────────────

  it("renders correct number of slide items", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    expect(wrapper.findAll(".slider-gallery-list .slider-gallery-item")).toHaveLength(mockGalleryData.length);
  });

  it("renders correct number of thumbnail items", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    expect(wrapper.findAll(".slider-gallery-thumbnails .slider-gallery-item")).toHaveLength(mockGalleryData.length);
  });

  it("renders slide image alt text correctly", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    const images = wrapper.findAll(".slider-gallery-list .slider-gallery-item img");
    expect(images[0]?.attributes("alt")).toBe(mockGalleryData[0]?.alt);
    expect(images[1]?.attributes("alt")).toBe(mockGalleryData[1]?.alt);
  });

  it("renders thumbnail images with lazy loading", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    const thumbImages = wrapper.findAll(".slider-gallery-thumbnails .slider-gallery-item img");
    thumbImages.forEach((img) => {
      expect(img.attributes("loading")).toBe("lazy");
    });
  });

  it("renders slide content fields when provided", async () => {
    const wrapper = await mountAndLoad([mockGalleryData[0]!], mockImage);
    expect(wrapper.find(".slider-gallery-list .slider-gallery-item .slider-gallery-author").text()).toBe(mockGalleryData[0]!.stylist);
    expect(wrapper.find(".slider-gallery-list .slider-gallery-item .slider-gallery-title").text()).toBe(mockGalleryData[0]!.title);
    expect(wrapper.find(".slider-gallery-list .slider-gallery-item .slider-gallery-topic").text()).toBe(mockGalleryData[0]!.category);
    expect(wrapper.find(".slider-gallery-list .slider-gallery-item .slider-gallery-description").text()).toBe(mockGalleryData[0]!.description);
  });

  it("renders thumbnail content when provided", async () => {
    const wrapper = await mountAndLoad([mockGalleryData[0]!], mockImage);
    expect(wrapper.find(".slider-gallery-thumbnails .slider-gallery-item .slider-gallery-title").text()).toBe(mockGalleryData[0]!.thumbnail?.title);
    expect(wrapper.find(".slider-gallery-thumbnails .slider-gallery-item .slider-gallery-description").text()).toBe(mockGalleryData[0]!.thumbnail?.description);
  });

  // ─── Navigation buttons ───────────────────────────────────────────────────

  it("renders prev and next arrow buttons", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    expect(wrapper.find(".slider-gallery-prev").exists()).toBe(true);
    expect(wrapper.find(".slider-gallery-next").exists()).toBe(true);
  });

  it("prev button has accessible aria-label", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    expect(wrapper.find(".slider-gallery-prev").attributes("aria-label")).toBe("Previous image");
  });

  it("next button has accessible aria-label", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    expect(wrapper.find(".slider-gallery-next").attributes("aria-label")).toBe("Next image");
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a single styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(SliderGallery, {
      props: { galleryData: [], styleClassPassthrough: "custom-gallery" },
    });
    expect(wrapper.classes()).toContain("custom-gallery");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(SliderGallery, {
      props: { galleryData: [], styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  it("updates classes when styleClassPassthrough prop changes", async () => {
    const wrapper = await mountSuspended(SliderGallery, {
      props: { galleryData: [], styleClassPassthrough: ["original"] },
    });
    expect(wrapper.classes()).toContain("original");
    await wrapper.setProps({ styleClassPassthrough: ["updated"] });
    expect(wrapper.classes()).not.toContain("original");
    expect(wrapper.classes()).toContain("updated");
  });

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  it("removes keydown listener from wrapper on unmount", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    const el = wrapper.element as HTMLElement;
    const spy = vi.spyOn(el, "removeEventListener");
    wrapper.unmount();
    expect(spy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  // ─── Carousel semantics and a11y ──────────────────────────────────────────

  it("is a labelled carousel region", async () => {
    const wrapper = await mountSuspended(SliderGallery, { props: { galleryData: [], ariaLabel: "Our work" } });
    expect(wrapper.attributes("role")).toBe("region");
    expect(wrapper.attributes("aria-roledescription")).toBe("carousel");
    expect(wrapper.attributes("aria-label")).toBe("Our work");
  });

  it("does not use fixed ids on the arrow buttons", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    expect(wrapper.find(".slider-gallery-prev").attributes("id")).toBeUndefined();
    expect(wrapper.find(".slider-gallery-next").attributes("id")).toBeUndefined();
  });

  it("hides the decorative thumbnail strip from assistive tech", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    expect(wrapper.find(".slider-gallery-thumbnails").attributes("aria-hidden")).toBe("true");
  });

  it("renders the see-more link only for slides with an href", async () => {
    const data: IGalleryData[] = [{ ...mockGalleryData[0]!, href: "/work/1" }, mockGalleryData[1]!];
    const wrapper = await mountAndLoad(data, mockImage);
    const ctas = wrapper.findAll(".slider-gallery-cta");
    expect(ctas).toHaveLength(1);
    expect(ctas[0]!.attributes("href")).toBe("/work/1");
    expect(ctas[0]!.text()).toBe("SEE MORE");
  });

  it("pauses auto-advance while hovered and resumes on leave", async () => {
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    await wrapper.trigger("mouseenter");
    vi.advanceTimersByTime(7000);
    await nextTick();
    expect(wrapper.classes()).not.toContain("is-next");
    await wrapper.trigger("mouseleave");
    vi.advanceTimersByTime(7000);
    await nextTick();
    expect(wrapper.classes()).toContain("is-next");
  });

  it("does not auto-advance under prefers-reduced-motion", async () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    const wrapper = await mountAndLoad(mockGalleryData, mockImage);
    vi.advanceTimersByTime(7000);
    await nextTick();
    expect(wrapper.classes()).not.toContain("is-next");
  });
});
