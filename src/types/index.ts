// Type definitions for project data

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface TechStack {
  name: string;
  category: string;
}

export interface SocialLinks {
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}
