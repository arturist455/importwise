import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "ImportWise.ie — Car imports from Japan & the UK",
  description: "Quality car imports to Ireland from Japan and the UK. Inspected, customs & VRT handled, delivered nationwide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
