export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: FAQCategory;
  order?: number;
  keywords?: string[];
}

export interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  faqs?: FAQ[];
  order?: number;
}