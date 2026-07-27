export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": "https://daham.serenedge.com/#person",
                "name": "Daham Dissanayake",
                "givenName": "Daham",
                "familyName": "Dissanayake",
                "url": "https://daham.serenedge.com",
                "image": "https://daham.serenedge.com/images/og-image.png",
                "jobTitle": "Full Stack Developer & Edge AI and Robotics Researcher",
                "description": "Full Stack Developer, Edge AI & Robotics Researcher at IIT Sri Lanka, specializing in IoT and Reinforcement Learning.",
                "nationality": {
                    "@type": "Country",
                    "name": "Sri Lanka"
                },
                "alumniOf": {
                    "@type": "EducationalOrganization",
                    "name": "Informatics Institute of Technology (IIT), Sri Lanka",
                    "url": "https://www.iit.ac.lk"
                },
                "knowsAbout": [
                    "Web Development", "Edge AI", "Robotics", "IoT", "Reinforcement Learning", "Machine Learning",
                    "React", "Next.js", "Python", "TypeScript", "Embedded Systems", "React Native", "Docker"
                ],
                "sameAs": [
                    "https://github.com/DahamDissanayake",
                    "https://www.linkedin.com/in/daham-dissanayake/",
                    "https://www.instagram.com/dhmdissanayake/"
                ]
            },
            {
                "@type": "ProfilePage",
                "@id": "https://daham.serenedge.com/#profilepage",
                "name": "Daham Dissanayake — Portfolio",
                "url": "https://daham.serenedge.com",
                "description": "Official portfolio and profile of Daham Dissanayake — Full Stack Developer, Edge AI & Robotics Researcher, specializing in IoT and Reinforcement Learning, from Sri Lanka.",
                "mainEntity": {
                    "@type": "Person",
                    "@id": "https://daham.serenedge.com/#person"
                },
                "dateModified": "2025-06-01"
            },
            {
                "@type": "WebSite",
                "@id": "https://daham.serenedge.com/#website",
                "name": "Daham Dissanayake | SerenEdge",
                "url": "https://daham.serenedge.com",
                "description": "Portfolio of Daham Dissanayake — Full Stack Developer, Edge AI & Robotics Researcher, specializing in IoT and Reinforcement Learning, from Sri Lanka.",
                "author": {
                    "@type": "Person",
                    "@id": "https://daham.serenedge.com/#person"
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
