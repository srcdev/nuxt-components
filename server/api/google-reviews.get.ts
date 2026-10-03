import { fetchGoogleReviews } from "../lib/google-reviews";

export default defineCachedEventHandler(
  (event) => fetchGoogleReviews(useRuntimeConfig(event).googleReviews),
  {
    name: "google-reviews",
    getKey: () => "place",
    maxAge: Number(useRuntimeConfig().googleReviews?.cacheMaxAge) || 3600,
  }
);
