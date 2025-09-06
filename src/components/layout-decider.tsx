
"use client";

import { usePathname } from "next/navigation";
import { AppProvider } from "./app-provider";
import { SidebarLayout } from "./sidebar-layout";

export function LayoutDecider({ children, session }: { children: React.ReactNode, session: any }) {
    const pathname = usePathname();
    const isDashboardPage = pathname.startsWith('/dashboard');

    if (session && isDashboardPage) {
        return (
            <div className="overflow-hidden">
                <AppProvider>
                    <SidebarLayout>{children}</SidebarLayout>
                </AppProvider>
            </div>
        );
    }
    
    return <main>{children}</main>;
}
