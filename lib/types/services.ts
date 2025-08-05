export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features: ServiceFeature[];
  category?: ServiceCategory;
  slug?: string;
  order?: number;
}

export interface ServiceFeature {
  id: string;
  text: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  services?: Service[];
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  services?: string[];
  icon?: string;
}

export interface Expertise {
  id: string;
  title: string;
  description: string;
  industries: string[];
  keyServices: string[];
}