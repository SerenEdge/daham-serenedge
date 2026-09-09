export interface PortfolioProject {
  id: string;
  /** Optional URL slug override; defaults to a slugified `title`. */
  slug?: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription: string;
  tech: string[];
  link: string;
  images: string[];
}

export interface OtherProject {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface ProjectsData {
  portfolio: PortfolioProject[];
  otherProjects: OtherProject[];
}
