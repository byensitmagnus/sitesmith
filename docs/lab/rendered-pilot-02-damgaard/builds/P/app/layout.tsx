import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Condensed, IBM_Plex_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexSansCondensed = IBM_Plex_Sans_Condensed({
  variable: "--font-plex-sans-condensed",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://damgaard-estrik.example"),
  title: {
    default: "Damgaard Estrik — udtørring og reetablering af gulvkonstruktioner",
    template: "%s — Damgaard Estrik",
  },
  description:
    "Fugtgennemgang med kernemåling, udtørring og ny estrik af vandskadede gulve inden for 75 km fra Lemvig. Book en gennemgang uden at ringe.",
  openGraph: {
    type: "website",
    locale: "da_DK",
    siteName: "Damgaard Estrik",
    title: "Damgaard Estrik — udtørring og reetablering af gulvkonstruktioner",
    description:
      "Fugtgennemgang med kernemåling, udtørring og ny estrik af vandskadede gulve inden for 75 km fra Lemvig.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="da"
      className={`${plexSans.variable} ${plexSansCondensed.variable} ${plexMono.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Spring til indhold
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
