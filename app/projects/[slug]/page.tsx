import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import {
  getProjectBySlug,
  portfolioProjects,
  projectPath,
  projectSlug,
} from "@/lib/projects";
import { SITE_URL, CONTENT_LAST_UPDATED } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: projectSlug(project) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const url = `${SITE_URL}/projects/${slug}`;
  const title = `${project.title} — ${project.description}`;

  return {
    title: project.title,
    description: project.longDescription,
    alternates: { canonical: url },
    keywords: project.tech,
    openGraph: {
      type: "article",
      url,
      title,
      description: project.longDescription,
      siteName: "SerenEdge",
      images: project.images.map((image) => ({ url: image, alt: project.title })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
      images: [project.images[0]],
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = portfolioProjects.findIndex((p) => projectSlug(p) === slug);
  const previous = portfolioProjects[index - 1];
  const next = portfolioProjects[index + 1];
  const url = `${SITE_URL}/projects/${slug}`;
  const isRepo = project.link.includes("github.com");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#project`,
        name: project.title,
        headline: project.description,
        description: project.longDescription,
        url,
        sameAs: project.link,
        keywords: project.tech.join(", "),
        dateModified: CONTENT_LAST_UPDATED,
        author: { "@id": `${SITE_URL}/#person` },
        creator: { "@id": `${SITE_URL}/#person` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        image: project.images.map((image) => `${SITE_URL}${image}`),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/projects` },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-secondary font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <nav aria-label="Breadcrumb" className="mb-12">
          <ol className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-tertiary">
            <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/projects" className="hover:text-secondary transition-colors">Projects</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-secondary">{project.title}</li>
          </ol>
        </nav>

        <header className="mb-14">
          {project.subtitle && (
            <p className="text-tertiary mb-4 font-mono text-sm uppercase tracking-wider">
              {project.subtitle}
            </p>
          )}
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[0.9] mb-6">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-tertiary max-w-3xl leading-relaxed">
            {project.description}
          </p>
        </header>

        <section className="mb-14">
          <h2 className="text-sm font-medium uppercase tracking-widest text-tertiary mb-4">
            About the project
          </h2>
          <p className="text-lg md:text-xl leading-relaxed max-w-3xl">
            {project.longDescription}
          </p>

          <Link
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 mt-8 text-xl font-medium text-primary hover:opacity-70 transition-opacity"
          >
            {isRepo ? "View source on GitHub" : `Visit ${project.title}`}
            <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </section>

        <section className="mb-14">
          <h2 className="text-sm font-medium uppercase tracking-widest text-tertiary mb-4">
            Technologies
          </h2>
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="px-3 py-1.5 border border-gray-200 rounded-full text-sm"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-sm font-medium uppercase tracking-widest text-tertiary mb-6">
            Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.images.map((image, i) => (
              <div
                key={image}
                className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100"
              >
                <Image
                  src={image}
                  alt={`${project.title} — ${project.description} (image ${i + 1})`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </section>

        <nav className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row gap-6 sm:justify-between">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-tertiary hover:text-secondary transition-colors"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            All projects
          </Link>

          <div className="flex flex-col sm:flex-row gap-6">
            {previous && (
              <Link href={projectPath(previous)} className="text-tertiary hover:text-secondary transition-colors">
                ← {previous.title}
              </Link>
            )}
            {next && (
              <Link href={projectPath(next)} className="text-tertiary hover:text-secondary transition-colors">
                {next.title} →
              </Link>
            )}
          </div>
        </nav>
      </div>
    </main>
  );
}
