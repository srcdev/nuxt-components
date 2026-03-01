export interface Service {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  image: string;
  shortDescription: string;
  longDescription: string;
  whatIsIt: string;
  process: string[];
  idealFor: string[];
  maintenance: string;
  faqs: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
}
