import type { GoogleReviewsData } from "~/types/components";

export const useGoogleReviews = () =>
  useFetch<GoogleReviewsData>("/api/google-reviews", { key: "srcdev-google-reviews" });
