import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SplashScreen from "@/components/SplashScreen";
import { Analytics } from "@vercel/analytics/next";
import JsonLd from "@/components/JsonLd";



const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://daham.serenedge.com"),
  title: {
    default: "Daham Dissanayake | SerenEdge",
    template: "%s | SerenEdge",
  },
  description: "Computer Science Undergraduate, Full Stack Developer, and IoT Enthusiast from Sri Lanka. specializing in building exceptional digital experiences.",
  keywords: [
    "Daham Dissanayake", "SerenEdge", "Full Stack Developer", "IoT Developer",
    "React Developer", "Next.js", "Sri Lanka", "Software Engineer",
    "Web Development", "Computer Science"
  ],
  authors: [{ name: "Daham Dissanayake", url: "https://daham.serenedge.com" }],
  creator: "Daham Dissanayake",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://daham.serenedge.com",
    title: "Daham Dissanayake | SerenEdge",
    description: "Computer Science Undergraduate, Full Stack Developer, and IoT Enthusiast from Sri Lanka.",
    siteName: "SerenEdge",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Daham Dissanayake - SerenEdge Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daham Dissanayake | SerenEdge",
    description: "Computer Science Undergraduate, Full Stack Developer, and IoT Enthusiast.",
    images: ["/images/og-image.png"],
    creator: "@dhmdissanayake",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/images/daham-sign-strokeicon.ico",
    shortcut: "/images/daham-sign-strokeicon.ico",
    apple: "/images/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://serenedge.com",
  },
  verification: {
    google: "JZbYOAdrz10YPPu4FBfxAQS8xdykd42xtzFKDa9XkSI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (!sessionStorage.getItem('splash-loaded')) {
                document.documentElement.classList.add('splash-active');
                document.documentElement.style.backgroundColor = '#1c1c2b';
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistMono.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <JsonLd />
        <SmoothScroll>
          <SplashScreen />
          <div id="content-wrapper">
            {children}
            <Analytics />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
