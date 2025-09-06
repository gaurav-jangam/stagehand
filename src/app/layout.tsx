
import type { Metadata } from "next";
import { Playfair_Display, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { getSession } from './login/actions';
import { LayoutDecider } from "@/components/layout-decider";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair-display",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Stagehand",
  description: "Manage your songs and shows with ease.",
  manifest: "/manifest.json",
  icons: {
    icon: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22hsl(330 100% 50%)%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M9 18V5l12-2v13%22/><circle cx=%226%22 cy=%2218%22 r=%223%22/><circle cx=%2218%22 cy=%2216%22 r=%223%22/></svg>`
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn("font-body antialiased", playfairDisplay.variable, roboto.variable)} suppressHydrationWarning={true}>
        <LayoutDecider session={session}>
          {children}
        </LayoutDecider>
        <Toaster />
      </body>
    </html>
  );
}
