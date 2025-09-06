
import type { Metadata } from "next";
import { Playfair_Display, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/components/app-provider";
import { getSession } from './login/actions';
import { SidebarLayout } from "@/components/sidebar-layout";
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
  icons: {
    icon: "/icon.svg",
  }
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
