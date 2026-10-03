import { describe, it, expect, vi } from "vitest";
import { fetchGoogleReviews, mapPlaceToGoogleReviews, type PlacesResponse } from "../google-reviews";

const placeResponse: PlacesResponse = {
  displayName: { text: "Test Salon" },
  rating: 4.7,
  userRatingCount: 128,
  googleMapsUri: "https://maps.google.com/?cid=1",
  reviews: [
    {
      rating: 5,
      text: { text: "Lovely visit" },
      relativePublishTimeDescription: "2 weeks ago",
      publishTime: "2026-09-18T10:00:00Z",
      googleMapsUri: "https://maps.google.com/review/1",
      authorAttribution: { displayName: "Alex Doe", uri: "https://maps.google.com/contrib/1", photoUri: "https://lh3.googleusercontent.com/a" },
    },
    { rating: 3, originalText: { text: "Original only" } },
  ],
};

const config = { apiKey: "secret-key", placeId: "place-123" };

describe("mapPlaceToGoogleReviews", () => {
  it("maps the Places response to the component data shape", () => {
    const data = mapPlaceToGoogleReviews(placeResponse);
    expect(data).toMatchObject({ placeName: "Test Salon", rating: 4.7, totalReviews: 128, mapsUri: "https://maps.google.com/?cid=1" });
    expect(data.reviews[0]).toEqual({
      authorName: "Alex Doe",
      authorUri: "https://maps.google.com/contrib/1",
      authorPhotoUri: "https://lh3.googleusercontent.com/a",
      rating: 5,
      text: "Lovely visit",
      relativeTime: "2 weeks ago",
      publishTime: "2026-09-18T10:00:00Z",
      reviewUri: "https://maps.google.com/review/1",
    });
  });

  it("falls back to original text and empty values for missing fields", () => {
    const review = mapPlaceToGoogleReviews(placeResponse).reviews[1]!;
    expect(review.text).toBe("Original only");
    expect(review.authorName).toBe("");
    expect(review.reviewUri).toBeUndefined();
  });

  it("returns an empty list when the place has no reviews", () => {
    expect(mapPlaceToGoogleReviews({}).reviews).toEqual([]);
  });
});

describe("fetchGoogleReviews", () => {
  it("sends the API key and field mask only in request headers", async () => {
    const fetcher = vi.fn().mockResolvedValue(placeResponse);
    await fetchGoogleReviews({ ...config, languageCode: "en-GB" }, fetcher);
    expect(fetcher).toHaveBeenCalledWith("https://places.googleapis.com/v1/places/place-123", {
      headers: { "X-Goog-Api-Key": "secret-key", "X-Goog-FieldMask": expect.stringContaining("reviews") },
      query: { languageCode: "en-GB" },
    });
  });

  it("never includes the API key in the response", async () => {
    const fetcher = vi.fn().mockResolvedValue(placeResponse);
    const data = await fetchGoogleReviews(config, fetcher);
    expect(JSON.stringify(data)).not.toContain("secret-key");
  });

  it("names the missing API key env var", async () => {
    await expect(fetchGoogleReviews({ placeId: "place-123" }, vi.fn())).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: expect.stringContaining("NUXT_GOOGLE_REVIEWS_API_KEY"),
    });
  });

  it("names the missing place ID env var", async () => {
    await expect(fetchGoogleReviews({ apiKey: "secret-key" }, vi.fn())).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: expect.stringContaining("NUXT_GOOGLE_REVIEWS_PLACE_ID"),
    });
  });

  it("returns a 502 when the Google request fails", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("network"));
    await expect(fetchGoogleReviews(config, fetcher)).rejects.toMatchObject({ statusCode: 502 });
  });
});
