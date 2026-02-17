import Script from 'next/script';

export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "name": "Daham Dissanayake",
                "url": "https://daham.serenedge.com",
                "sameAs": [
                    "https://github.com/DahamDissanayake",
                    "https://www.linkedin.com/in/daham-dissanayake/",
                    "https://www.instagram.com/dhmdissanayake/"
                ],
                "jobTitle": "Software Engineer",
                "worksFor": {
                    "@type": "Organization",
                    "name": "SerenEdge"
                },
                "description": "Computer Science Undergraduate, Full Stack Developer, and IoT Enthusiast.",
                "knowsAbout": ["Web Development", "IoT", "Machine Learning", "React", "Next.js", "Python"]
            },
            {
                "@type": "WebSite",
                "name": "Daham Dissanayake | SerenEdge",
                "url": "https://daham.serenedge.com",
                "author": {
                    "@type": "Person",
                    "name": "Daham Dissanayake"
                }
            }
        ]
    };

    return (
        <Script
            id="json-ld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
