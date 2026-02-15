import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://daham.serenedge.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/", // Example of standard disallow
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
