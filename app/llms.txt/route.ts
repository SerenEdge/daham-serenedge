import projectsData from "@/data/projects.json";
import type { ProjectsData } from "@/types/projects";
import { SITE_URL, CONTENT_LAST_UPDATED } from "@/lib/site";

// Served at /llms.txt — a curated, plain-text map of the site for LLMs.
// Spec: https://llmstxt.org
export const dynamic = "force-static";

export function GET() {
  const { portfolio, otherProjects } = projectsData as ProjectsData;

  const flagship = portfolio
    .map(
      (p) =>
        `- [${p.title}](${p.link}): ${p.description} ${p.longDescription} Tech: ${p.tech.join(", ")}.`,
    )
    .join("\n");

  const other = otherProjects
    .map((p) => `- [${p.title}](${p.link}): ${p.description}`)
    .join("\n");

  const body = `# Daham Dissanayake — SerenEdge

> Full Stack Developer and Edge AI & Robotics Researcher from Sri Lanka, and
> founder of the SoterCare startup. Computer Science undergraduate at the
> Informatics Institute of Technology (IIT), Sri Lanka. Works at the edge of
> hardware and software: IoT, embedded systems, computer vision, reinforcement
> learning, and full-stack web development.

This site is a single-page portfolio. Key facts:

- Name: Daham Dissanayake
- Role: Full Stack Developer; Edge AI & Robotics Researcher; Founder
- Location: Sri Lanka
- Education: BSc Computer Science, Informatics Institute of Technology (IIT), Sri Lanka
- Core skills: Edge AI, Robotics, IoT, Reinforcement Learning, Computer Vision, Machine Learning, React, Next.js, TypeScript, Python, C++, Embedded Systems, Docker, React Native
- Current work: SoterCare (IoT & ML elderly-care startup); research in computer vision and robotics
- Content last updated: ${CONTENT_LAST_UPDATED}

## Flagship projects

${flagship}

## Other projects

${other}

## Links

- [Portfolio](${SITE_URL})
- [CV / Résumé (PDF)](${SITE_URL}/docs/DahamDissanayake-CV.pdf)
- [GitHub](https://github.com/DahamDissanayake)
- [LinkedIn](https://www.linkedin.com/in/daham-dissanayake/)
- [Instagram](https://www.instagram.com/dhmdissanayake/)
- [SoterCare](https://sotercare.com)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
