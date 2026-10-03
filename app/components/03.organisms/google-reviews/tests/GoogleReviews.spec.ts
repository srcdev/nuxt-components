import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, h, nextTick, ref } from "vue";
import GoogleReviews from "../GoogleReviews.vue";
import type { GoogleReviewsData } from "~/types/components";

const makeReview = (n: number, rating: number) => ({
  authorName: `Reviewer ${n}`,
  authorUri: `https://maps.google.com/contrib/${n}`,
  rating,
  text: `Review text ${n}`,
  relativeTime: `${n} weeks ago`,
  publishTime: "2026-09-18T10:00:00Z",
  reviewUri: `https://maps.google.com/review/${n}`,
});

const data: GoogleReviewsData = {
  placeName: "Test Salon",
  rating: 4.66,
  totalReviews: 128,
  mapsUri: "https://maps.google.com/?cid=1",
  reviews: [makeReview(1, 5), makeReview(2, 4), makeReview(3, 3)],
};

const mountReviews = (props: Partial<InstanceType<typeof GoogleReviews>["$props"]> = {}, slots = {}) =>
  mountSuspended(GoogleReviews, { props: { data, ...props }, slots });

const setScrollMetrics = (el: Element, metrics: { scrollWidth: number; clientWidth: number; scrollLeft: number }) => {
  for (const [key, value] of Object.entries(metrics)) {
    Object.defineProperty(el, key, { configurable: true, value });
  }
};

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    vi.fn(function () {
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    })
  );
});

describe("GoogleReviews", () => {
  it("mounts without error", async () => {
    const wrapper = await mountReviews();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountReviews();
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Empty states ───────────────────────────────────────────────────────

  it("renders nothing when data is null", async () => {
    const wrapper = await mountReviews({ data: null });
    expect(wrapper.find(".google-reviews").exists()).toBe(false);
  });

  it("renders nothing when every review is filtered out", async () => {
    const wrapper = await mountReviews({ minRating: 5, data: { ...data, reviews: [makeReview(1, 4)] } });
    expect(wrapper.find(".google-reviews").exists()).toBe(false);
  });

  // ─── Summary and attribution ───────────────────────────────────────────

  it("shows the overall rating, total count and a link to the Google Maps listing", async () => {
    const wrapper = await mountReviews();
    expect(wrapper.find(".google-reviews-summary-rating").text()).toBe("4.7");
    expect(wrapper.find(".google-reviews-summary .sr-only").text()).toBe("Rated 4.7 out of 5");
    const link = wrapper.find("a.google-reviews-summary-link");
    expect(link.attributes("href")).toBe(data.mapsUri);
    expect(link.text()).toBe("128 reviews on Google");
  });

  it("hides the summary when showSummary is false", async () => {
    const wrapper = await mountReviews({ showSummary: false });
    expect(wrapper.find(".google-reviews-summary").exists()).toBe(false);
  });

  it("always renders the Google Maps attribution", async () => {
    const wrapper = await mountReviews({ showSummary: false });
    expect(wrapper.find(".google-reviews-attribution").text()).toBe("Reviews from Google Maps");
  });

  // ─── Semantics ─────────────────────────────────────────────────────────

  it("is a labelled section containing a list of reviews", async () => {
    const wrapper = await mountReviews();
    expect(wrapper.element.tagName).toBe("SECTION");
    expect(wrapper.attributes("aria-label")).toBe("Google reviews");
    expect(wrapper.find("ul.google-reviews-list").exists()).toBe(true);
    expect(wrapper.findAll("li.google-reviews-item")).toHaveLength(3);
  });

  it("labels the section by the heading slot when one is given", async () => {
    const wrapper = await mountReviews(
      {},
      { heading: ({ headingId }: { headingId: string }) => h("h2", { id: headingId }, "What clients say") }
    );
    const heading = wrapper.find("h2");
    expect(wrapper.attributes("aria-labelledby")).toBe(heading.attributes("id"));
    expect(wrapper.attributes("aria-label")).toBeUndefined();
  });

  it("switches between aria-label and aria-labelledby when the heading slot is toggled after mount", async () => {
    const showHeading = ref(false);
    const Host = defineComponent({
      setup() {
        return () =>
          h(GoogleReviews, { data }, showHeading.value
            ? { heading: ({ headingId }: { headingId: string }) => h("h2", { id: headingId }, "Reviews") }
            : {});
      },
    });
    const wrapper = await mountSuspended(Host);
    const root = () => wrapper.find(".google-reviews");
    expect(root().attributes("aria-label")).toBe("Google reviews");

    showHeading.value = true;
    await nextTick();
    expect(root().attributes("aria-labelledby")).toBe(wrapper.find("h2").attributes("id"));
    expect(root().attributes("aria-label")).toBeUndefined();

    showHeading.value = false;
    await nextTick();
    expect(root().attributes("aria-labelledby")).toBeUndefined();
    expect(root().attributes("aria-label")).toBe("Google reviews");
  });

  it("makes the scroll area keyboard focusable", async () => {
    const wrapper = await mountReviews();
    expect(wrapper.find(".google-reviews-list").attributes("tabindex")).toBe("0");
  });

  // ─── Filtering ─────────────────────────────────────────────────────────

  it("hides lower-rated reviews and shows the filter notice when minRating is set", async () => {
    const wrapper = await mountReviews({ minRating: 4 });
    expect(wrapper.findAll(".google-reviews-item")).toHaveLength(2);
    expect(wrapper.find(".google-reviews-filter-notice").text()).toBe(
      "Showing reviews rated 4 stars and above, in Google's order."
    );
  });

  it("shows no filter notice when there is no filter", async () => {
    const wrapper = await mountReviews();
    expect(wrapper.find(".google-reviews-filter-notice").exists()).toBe(false);
  });

  // ─── Prev/next controls ────────────────────────────────────────────────

  it("hides the prev/next buttons when every card fits", async () => {
    const wrapper = await mountReviews();
    expect(wrapper.find(".google-reviews-controls").exists()).toBe(false);
  });

  it("shows the prev/next buttons when cards overflow, disabling each at its end", async () => {
    const wrapper = await mountReviews();
    const list = wrapper.find(".google-reviews-list");

    setScrollMetrics(list.element, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 0 });
    await list.trigger("scroll");
    expect(wrapper.find(".google-reviews-prev").attributes("aria-disabled")).toBe("true");
    expect(wrapper.find(".google-reviews-next").attributes("aria-disabled")).toBe("false");

    setScrollMetrics(list.element, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 600 });
    await list.trigger("scroll");
    expect(wrapper.find(".google-reviews-prev").attributes("aria-disabled")).toBe("false");
    expect(wrapper.find(".google-reviews-next").attributes("aria-disabled")).toBe("true");
  });

  it("scrolls by one card when prev/next is pressed", async () => {
    const wrapper = await mountReviews();
    const list = wrapper.find(".google-reviews-list");
    const scrollBy = vi.fn();
    (list.element as HTMLElement).scrollBy = scrollBy;
    Object.defineProperty(wrapper.find(".google-reviews-item").element, "offsetWidth", { configurable: true, value: 300 });

    setScrollMetrics(list.element, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 300 });
    await list.trigger("scroll");

    await wrapper.find(".google-reviews-next").trigger("click");
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 300 });
    await wrapper.find(".google-reviews-prev").trigger("click");
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -300 });
  });

  it("gives the icon-only buttons accessible names", async () => {
    const wrapper = await mountReviews();
    const list = wrapper.find(".google-reviews-list");
    setScrollMetrics(list.element, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 0 });
    await list.trigger("scroll");
    expect(wrapper.find(".google-reviews-prev .button-text").text()).toBe("Previous reviews");
    expect(wrapper.find(".google-reviews-next .button-text").text()).toBe("Next reviews");
  });

  // ─── Copy and slots ────────────────────────────────────────────────────

  it("uses custom label text throughout", async () => {
    const wrapper = await mountReviews({
      minRating: 4,
      ariaLabel: "Avis Google",
      ratingLabel: "{rating} sur 5",
      totalLabel: "{count} avis sur Google",
      readMoreLabel: "Lire sur Google",
      filterNotice: "Avis de {rating} étoiles et plus.",
      attributionText: "Avis de Google Maps",
    });
    expect(wrapper.attributes("aria-label")).toBe("Avis Google");
    expect(wrapper.find(".google-reviews-summary .sr-only").text()).toBe("4.7 sur 5");
    expect(wrapper.find(".google-reviews-summary-link").text()).toBe("128 avis sur Google");
    expect(wrapper.find(".google-review-card-link").text()).toBe("Lire sur Google");
    expect(wrapper.find(".google-reviews-filter-notice").text()).toBe("Avis de 4 étoiles et plus.");
    expect(wrapper.find(".google-reviews-attribution").text()).toBe("Avis de Google Maps");
  });

  it("replaces each card with the card slot", async () => {
    const wrapper = await mountReviews(
      {},
      { card: ({ review }: { review: { authorName: string } }) => h("div", { class: "custom-card" }, review.authorName) }
    );
    expect(wrapper.findAll(".custom-card")).toHaveLength(3);
    expect(wrapper.find(".google-review-card").exists()).toBe(false);
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountReviews({ styleClassPassthrough: ["custom-reviews"] });
    expect(wrapper.classes()).toContain("custom-reviews");
  });
});
