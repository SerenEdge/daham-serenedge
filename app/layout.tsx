import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SplashScreen from "@/components/SplashScreen";
import { Analytics } from "@vercel/analytics/next";



const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daham Dissanayake | SerenEdge",
  description: "Computer Science, Web Development, and IoT enthusiast.",
  icons: {
    icon: "/images/daham-sign-strokeicon.ico",
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
