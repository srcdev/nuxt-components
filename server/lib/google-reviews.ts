import { createError } from "h3";
import type { GoogleReviewsData } from "../../app/types/components/google-reviews";

export interface GoogleReviewsConfig {
  apiKey?: string;
  placeId?: string;
  languageCode?: string;
}

interface PlacesReview {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  googleMapsUri?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
}

export interface PlacesResponse {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
}

type Fetcher = (url: string, options: { headers: Record<string, string>; query?: Record<string, string> }) => Promise<PlacesResponse>;

const FIELD_MASK = "displayName,rating,userRatingCount,googleMapsUri,reviews";

export function mapPlaceToGoogleReviews(place: PlacesResponse): GoogleReviewsData {
  return {
    placeName: place.displayName?.text ?? "",
    rating: place.rating ?? 0,
    totalReviews: place.userRatingCount ?? 0,
    mapsUri: place.googleMapsUri ?? "",
    reviews: (place.reviews ?? []).map((review) => ({
      authorName: review.authorAttribution?.displayName ?? "",
      authorUri: review.authorAttribution?.uri,
      authorPhotoUri: review.authorAttribution?.photoUri,
      rating: review.rating ?? 0,
      text: review.text?.text ?? review.originalText?.text ?? "",
      relativeTime: review.relativePublishTimeDescription ?? "",
      publishTime: review.publishTime ?? "",
      reviewUri: review.googleMapsUri,
    })),
  };
}

export async function fetchGoogleReviews(
  config: GoogleReviewsConfig,
  fetcher: Fetcher = $fetch as unknown as Fetcher
): Promise<GoogleReviewsData> {
  if (!config.apiKey) {
    throw createError({ statusCode: 500, statusMessage: "Google reviews not configured: set NUXT_GOOGLE_REVIEWS_API_KEY" });
  }
  if (!config.placeId) {
    throw createError({ statusCode: 500, statusMessage: "Google reviews not configured: set NUXT_GOOGLE_REVIEWS_PLACE_ID" });
  }

  let place: PlacesResponse;
  try {
    place = await fetcher(`https://places.googleapis.com/v1/places/${encodeURIComponent(config.placeId)}`, {
      headers: { "X-Goog-Api-Key": config.apiKey, "X-Goog-FieldMask": FIELD_MASK },
      query: config.languageCode ? { languageCode: config.languageCode } : undefined,
    });
  } catch {
    throw createError({ statusCode: 502, statusMessage: "Google Places request failed" });
  }

  return mapPlaceToGoogleReviews(place);
}
