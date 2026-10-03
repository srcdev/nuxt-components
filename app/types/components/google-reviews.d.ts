export interface GoogleReview {
  authorName: string;
  authorUri?: string;
  authorPhotoUri?: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
  reviewUri?: string;
}

export interface GoogleReviewsData {
  placeName: string;
  rating: number;
  totalReviews: number;
  mapsUri: string;
  reviews: GoogleReview[];
}
