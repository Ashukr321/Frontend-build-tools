import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import ServiceWorker from "@/components/service-worker";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "frontend build tools", "webpack", "vite", "esbuild", "rollup", "parcel", "babel",
    "typescript", "postcss", "sass", "tailwind", "eslint", "prettier", "npm", "pnpm", "yarn",
    "hot module replacement", "tree shaking", "code splitting", "CI/CD",
  ],
  openGraph: { type: "website", siteName: SITE_NAME, title: SITE_NAME, description: SITE_DESCRIPTION, url: "/" },
  twitter: { card: "summary", title: SITE_NAME, description: SITE_DESCRIPTION },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: SITE_NAME },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// Dark by default; runs before paint so there is no flash of the wrong theme.
const themeScript = `try{document.documentElement.classList.toggle("dark",localStorage.getItem("theme")!=="light")}catch(e){document.documentElement.classList.add("dark")}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <Script id="theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
