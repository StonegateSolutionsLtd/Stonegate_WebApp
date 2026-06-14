import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: 'Stonegate Moving Solutions · Apartment Moving in Vancouver',
    template: '%s · Stonegate Moving Solutions',
  },
  description: 'Professional apartment moving company serving Vancouver, Burnaby, Richmond, Surrey, Coquitlam and all of Metro Vancouver. 2 movers with truck from $73/hr. Book online in minutes.',
  keywords: [
    'Vancouver moving company', 'Burnaby movers', 'Richmond movers', 'Surrey moving',
    'apartment moving Vancouver', 'Metro Vancouver movers', 'moving company BC',
    'bin cleaning Vancouver', 'junk removal Vancouver', 'Coquitlam movers',
  ],
  metadataBase: new URL('https://stonegatemoving.com'),
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://stonegatemoving.com',
    siteName: 'Stonegate Moving Solutions',
    title: 'Stonegate Moving Solutions · Apartment Moving in Vancouver',
    description: 'Professional apartment movers serving all of Metro Vancouver. 2 movers with truck from $73/hr.',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${raleway.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-raleway)]">{children}</body>
    </html>
  );
}
