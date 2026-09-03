import projectsData from "@/data/projects.json";
import type { ProjectsData } from "@/types/projects";
import { SITE_URL, CONTENT_LAST_UPDATED } from "@/lib/site";

export default function JsonLd() {
    const { portfolio } = projectsData as ProjectsData;

    const projectNodes = portfolio.map((project) => ({
        "@type": "CreativeWork",
        "@id": `${SITE_URL}/#project-${project.id}`,
        name: project.title,
        headline: project.description,
        description: project.longDescription,
        url: project.link,
        keywords: project.tech.join(", "),
        author: { "@id": `${SITE_URL}/#person` },
        creator: { "@id": `${SITE_URL}/#person` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        ...(project.images?.length
            ? { image: project.images.map((img) => `${SITE_URL}${img}`) }
            : {}),
    }));

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": `${SITE_URL}/#person`,
                "name": "Daham Dissanayake",
                "givenName": "Daham",
                "familyName": "Dissanayake",
                "url": SITE_URL,
                "image": `${SITE_URL}/images/og-image.png`,
                "jobTitle": "Full Stack Developer & Edge AI and Robotics Researcher",
                "description": "Full Stack Developer, Edge AI & Robotics Researcher at IIT Sri Lanka, specializing in IoT and Reinforcement Learning.",
                "nationality": {
                    "@type": "Country",
                    "name": "Sri Lanka"
                },
                "knowsLanguage": ["English", "Sinhala"],
                "alumniOf": {
                    "@type": "EducationalOrganization",
                    "name": "Informatics Institute of Technology (IIT), Sri Lanka",
                    "url": "https://www.iit.ac.lk"
                },
                "worksFor": { "@id": `${SITE_URL}/#organization` },
                "hasOccupation": [
                    { "@type": "Occupation", "name": "Full Stack Developer" },
                    { "@type": "Occupation", "name": "Edge AI & Robotics Researcher" }
                ],
                "knowsAbout": [
                    "Web Development", "Edge AI", "Robotics", "IoT", "Reinforcement Learning", "Machine Learning",
                    "Computer Vision", "React", "Next.js", "Python", "TypeScript", "C++", "Embedded Systems",
                    "React Native", "Docker"
                ],
                "sameAs": [
                    "https://github.com/DahamDissanayake",
                    "https://www.linkedin.com/in/daham-dissanayake/",
                    "https://www.instagram.com/dhmdissanayake/"
                ]
            },
            {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                "name": "SerenEdge",
                "alternateName": "Daham Dissanayake | SerenEdge",
                "url": SITE_URL,
                "logo": `${SITE_URL}/images/logo.png`,
                "founder": { "@id": `${SITE_URL}/#person` },
                "description": "Personal brand and portfolio of Daham Dissanayake, covering work in Edge AI, robotics, IoT, and full-stack web development.",
                "sameAs": [
                    "https://github.com/DahamDissanayake"
                ]
            },
            {
                "@type": "ProfilePage",
                "@id": `${SITE_URL}/#profilepage`,
                "name": "Daham Dissanayake — Portfolio",
                "url": SITE_URL,
                "description": "Official portfolio and profile of Daham Dissanayake — Full Stack Developer, Edge AI & Robotics Researcher, specializing in IoT and Reinforcement Learning, from Sri Lanka.",
                "mainEntity": {
                    "@type": "Person",
                    "@id": `${SITE_URL}/#person`
                },
                "dateModified": CONTENT_LAST_UPDATED
            },
            {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                "name": "Daham Dissanayake | SerenEdge",
                "url": SITE_URL,
                "inLanguage": "en",
                "description": "Portfolio of Daham Dissanayake — Full Stack Developer, Edge AI & Robotics Researcher, specializing in IoT and Reinforcement Learning, from Sri Lanka.",
                "author": {
                    "@type": "Person",
                    "@id": `${SITE_URL}/#person`
                },
                "publisher": { "@id": `${SITE_URL}/#organization` }
            },
            ...projectNodes
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
