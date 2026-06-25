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
                "jobTitle": "Full Stack Developer & Computer Science Undergraduate",
                "description": "Computer Science Undergraduate at IIT Sri Lanka, Full Stack Developer, Machine Learning and IoT Enthusiast.",
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
                    "Web Development", "IoT", "Machine Learning", "React", "Next.js",
                    "Python", "TypeScript", "Embedded Systems", "React Native", "Docker"
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
                "description": "Official portfolio and profile of Daham Dissanayake — Full Stack Developer, Computer Science Undergraduate, and IoT Enthusiast from Sri Lanka.",
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
                "description": "Portfolio of Daham Dissanayake — Computer Science Undergraduate, Full Stack Developer, and IoT Enthusiast from Sri Lanka.",
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
