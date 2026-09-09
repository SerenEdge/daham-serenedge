import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import { otherProjectsList, portfolioProjects, projectPath } from "@/lib/projects";
import { SITE_URL, CONTENT_LAST_UPDATED } from "@/lib/site";

const DESCRIPTION =
  "Every project by Daham Dissanayake — edge AI, robotics, IoT, and full-stack work, from a wearable elderly-care system and a reinforcement-learning quadruped to a SLURM GPU gateway and a self-hosted automation OS.";

export const metadata: Metadata = {
  title: "Projects",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/projects` },
};

export default function ProjectsIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/projects#page`,
        name: "Projects — Daham Dissanayake",
        description: DESCRIPTION,
        url: `${SITE_URL}/projects`,
        dateModified: CONTENT_LAST_UPDATED,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "ItemList",
        itemListElement: portfolioProjects.map((project, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: project.title,
          url: `${SITE_URL}${projectPath(project)}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/projects` },
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
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-tertiary hover:text-secondary transition-colors mb-12"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Home
        </Link>

        <header className="mb-16">
          <h1 className="text-5xl md:text-8xl font-medium tracking-tight leading-[0.85] mb-6">
            Projects
          </h1>
          <p className="text-xl md:text-2xl text-tertiary max-w-3xl leading-relaxed">
            {DESCRIPTION}
          </p>
        </header>

        <section className="mb-20">
          <h2 className="text-sm font-medium uppercase tracking-widest text-tertiary mb-8">
            Selected works
          </h2>
          <ul className="flex flex-col gap-12">
            {portfolioProjects.map((project) => (
              <li key={project.id}>
                <Link href={projectPath(project)} className="group grid md:grid-cols-2 gap-6 items-start">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={project.images[0]}
                      alt={`${project.title} — ${project.description}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    {project.subtitle && (
                      <p className="text-tertiary mb-3 font-mono text-xs uppercase tracking-wider">
                        {project.subtitle}
                      </p>
                    )}
                    <h3 className="text-3xl md:text-4xl font-medium tracking-tight mb-3 inline-flex items-center gap-2">
                      {project.title}
                      <FiArrowUpRight className="text-tertiary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </h3>
                    <p className="text-lg text-tertiary leading-relaxed mb-4">
                      {project.description}
                    </p>
                    <p className="text-base leading-relaxed">{project.longDescription}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-widest text-tertiary mb-2">
            Other projects
          </h2>
          <p className="text-tertiary mb-8">Projects outside the featured selection.</p>
          <ul className="grid sm:grid-cols-2 gap-6">
            {otherProjectsList.map((project) => (
              <li key={project.id} className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-medium mb-2">{project.title}</h3>
                <p className="text-tertiary leading-relaxed mb-4">{project.description}</p>
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-medium text-primary hover:opacity-70 transition-opacity"
                >
                  View source
                  <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
