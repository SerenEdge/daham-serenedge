import { MetadataRoute } from "next";
import { SITE_URL, CONTENT_LAST_UPDATED } from "@/lib/site";
import { portfolioProjects, projectPath } from "@/lib/projects";

/**
 * Only indexable HTML pages belong here.
 *
 * The CV PDF and /llms.txt were previously listed and both sat in Google's
 * "Crawled - currently not indexed" bucket for months; a sitemap where most
 * entries are never indexed is a weak quality signal. Both files are still
 * served and still linked — they just aren't advertised as pages any more.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_LAST_UPDATED);

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...portfolioProjects.map((project) => ({
      url: `${SITE_URL}${projectPath(project)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
