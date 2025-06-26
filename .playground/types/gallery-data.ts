export interface IGalleryData {
  src: string;
  alt: string;
  stylist?: string;
  title?: string;
  category?: string;
  description?: string;
  thumbnail?: {
    title: string;
    description: string;
  };
  textBrightness: 'light' | 'dark';
}
