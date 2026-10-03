import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import GoogleReviewCard from "../GoogleReviewCard.vue";
import type { GoogleReview } from "~/types/components";

const review: GoogleReview = {
  authorName: "Alex Doe",
  authorUri: "https://maps.google.com/contrib/1",
  authorPhotoUri: "https://lh3.googleusercontent.com/a",
  rating: 4,
  text: "Lovely visit, would come again.",
  relativeTime: "2 weeks ago",
  publishTime: "2026-09-18T10:00:00Z",
  reviewUri: "https://maps.google.com/review/1",
};

const mountCard = (props: Partial<InstanceType<typeof GoogleReviewCard>["$props"]> = {}) =>
  mountSuspended(GoogleReviewCard, { props: { review, ...props } });

describe("GoogleReviewCard", () => {
  it("mounts without error", async () => {
    const wrapper = await mountCard();
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correct HTML structure", async () => {
    const wrapper = await mountCard();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders as an article by default and a div when tag is div", async () => {
    expect((await mountCard()).element.tagName).toBe("ARTICLE");
    expect((await mountCard({ tag: "div" })).element.tagName).toBe("DIV");
  });

  it("links the author name to their profile", async () => {
    const wrapper = await mountCard();
    const author = wrapper.find(".google-review-card-author-name");
    expect(author.element.tagName).toBe("A");
    expect(author.attributes("href")).toBe(review.authorUri);
    expect(author.text()).toBe("Alex Doe");
  });

  it("shows the author name as plain text when there is no profile link", async () => {
    const wrapper = await mountCard({ review: { ...review, authorUri: undefined } });
    expect(wrapper.find(".google-review-card-author-name").element.tagName).toBe("SPAN");
  });

  it("hides the avatar from screen readers, since the name is already read out", async () => {
    const avatar = (await mountCard()).find(".display-avatar");
    expect(avatar.attributes("aria-hidden")).toBe("true");
    expect(avatar.find(".sr-only").exists()).toBe(false);
  });

  it("shows the author photo, or initials when there is no photo", async () => {
    expect((await mountCard()).find(".display-avatar img").exists()).toBe(true);
    const noPhoto = await mountCard({ review: { ...review, authorPhotoUri: undefined } });
    expect(noPhoto.find(".display-avatar img").exists()).toBe(false);
    expect(noPhoto.find(".display-avatar").text()).toContain("AD");
  });

  it("takes whole characters for initials when a name starts with an emoji", async () => {
    const wrapper = await mountCard({ review: { ...review, authorName: "🌸 Rosa Lee", authorPhotoUri: undefined } });
    expect(wrapper.find(".display-avatar").text()).toContain("🌸R");
  });

  it("hides the stars from screen readers and announces the rating as text", async () => {
    const wrapper = await mountCard();
    expect(wrapper.find(".google-review-card-stars").attributes("aria-hidden")).toBe("true");
    expect(wrapper.find(".google-review-card-rating .sr-only").text()).toBe("Rated 4 out of 5");
  });

  it("shows the relative date with a machine-readable datetime", async () => {
    const time = (await mountCard()).find("time");
    expect(time.text()).toBe("2 weeks ago");
    expect(time.attributes("datetime")).toBe(review.publishTime);
  });

  it("links to the full review on Google, described by the author name", async () => {
    const wrapper = await mountCard();
    const link = wrapper.find(".google-review-card-link");
    expect(link.attributes("href")).toBe(review.reviewUri);
    expect(link.text()).toBe("Read on Google");
    const authorId = wrapper.find(".google-review-card-author-name").attributes("id");
    expect(authorId).toBeTruthy();
    expect(link.attributes("aria-describedby")).toBe(authorId);
  });

  it("omits the read link when there is no review link", async () => {
    const wrapper = await mountCard({ review: { ...review, reviewUri: undefined } });
    expect(wrapper.find(".google-review-card-link").exists()).toBe(false);
  });

  it("uses custom label text", async () => {
    const wrapper = await mountCard({ ratingLabel: "{rating} étoiles sur 5", readMoreLabel: "Lire sur Google" });
    expect(wrapper.find(".sr-only").text()).toBe("4 étoiles sur 5");
    expect(wrapper.find(".google-review-card-link").text()).toBe("Lire sur Google");
  });

  it("applies styleClassPassthrough classes", async () => {
    const wrapper = await mountCard({ styleClassPassthrough: ["custom-card"] });
    expect(wrapper.classes()).toContain("custom-card");
  });
});
