import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HTP Analyzer - AI-Powered House-Tree-Person Test Analysis",
    template: "%s | HTP Analyzer"
  },
  description: "Transform subjective psychological assessments into objective, standardized reports. Analyze children's house drawings with AI-powered precision, reducing interpretation time and increasing diagnostic accuracy. Free, open-source, and privacy-focused.",
  keywords: [
    "HTP test",
    "House-Tree-Person test",
    "psychological assessment",
    "children's drawings",
    "AI psychology",
    "mental health assessment",
    "child psychology",
    "drawing analysis",
    "psychological evaluation",
    "behavioral assessment",
    "learning difficulties",
    "emotional assessment",
    "family dynamics",
    "developmental assessment"
  ],
  authors: [{ name: "HTP Analyzer Team" }],
  creator: "HTP Analyzer",
  publisher: "HTP Analyzer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://htp-analyzer.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://htp-analyzer.com',
    title: 'HTP Analyzer - AI-Powered House-Tree-Person Test Analysis',
    description: 'Transform subjective psychological assessments into objective, standardized reports. Analyze children\'s house drawings with AI-powered precision.',
    siteName: 'HTP Analyzer',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HTP Analyzer - AI-Powered Psychological Assessment Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTP Analyzer - AI-Powered House-Tree-Person Test Analysis',
    description: 'Transform subjective psychological assessments into objective, standardized reports. Analyze children\'s house drawings with AI-powered precision.',
    images: ['/og-image.jpg'],
    creator: '@htpanalyzer',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "HTP Analyzer",
  "description": "AI-powered House-Tree-Person test analysis tool for psychological assessments. Transform subjective evaluations into objective, standardized reports.",
  "url": "https://htp-analyzer.com",
  "applicationCategory": "HealthcareApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Organization",
    "name": "HTP Analyzer Team"
  },
  "featureList": [
    "AI-powered drawing analysis",
    "250+ characteristic identification",
    "Comprehensive psychological reports",
    "Privacy-first data handling",
    "Open source software",
    "No account required"
  ],
  "screenshot": "https://htp-analyzer.com/screenshot.jpg",
  "softwareVersion": "1.0.0",
  "datePublished": "2025-01-01",
  "isAccessibleForFree": true,
  "applicationSubCategory": "Psychology Assessment Tool"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
