export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  image?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  qualifications?: string[];
  specializations?: string[];
  experience?: number; // years
  order?: number;
}

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  position?: string;
  company?: string;
  rating?: number;
  image?: string;
  date?: string;
  featured?: boolean;
}