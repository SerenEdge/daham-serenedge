export interface PortfolioProject {
  id: string;
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
