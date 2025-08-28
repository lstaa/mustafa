import type { Metadata } from "next";
import { Geist, Geist_Mono, Lilita_One } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cartoon = Lilita_One({
  variable: "--font-cartoon",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DinnerRecipes",
    template: "%s | DinnerRecipes",
  },
  description: "Discover delicious, easy dinner recipes and cooking tips.",
  openGraph: {
    title: "DinnerRecipes",
    description: "Discover delicious, easy dinner recipes and cooking tips.",
    url: "https://dinnerrecipes.example.com",
    siteName: "DinnerRecipes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DinnerRecipes",
    description: "Discover delicious, easy dinner recipes and cooking tips.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${cartoon.variable} antialiased min-h-screen flex flex-col bg-gray-50 text-black`}>
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="text-2xl md:text-3xl font-bold tracking-tight text-rose-600">DinnerRecipes</Link>
            <div className="flex items-center gap-6 text-base md:text-lg font-semibold">
              <Link href="/" className="text-black hover:text-rose-600">Home</Link>
              <Link href="/blog" className="text-black hover:text-rose-600">Blog</Link>
              <Link href="/contact" className="text-black hover:text-rose-600">Contact</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-6 md:grid-cols-2 items-center">
            <div className="flex gap-4 text-sm text-gray-600">
              <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
              <span>•</span>
              <Link href="/terms-of-use" className="hover:underline">Terms of Use</Link>
            </div>
            <div className="flex md:justify-end gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-80">FB</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-80">IG</a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="hover:opacity-80">PT</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:opacity-80">TW</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
