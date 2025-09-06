
"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <TooltipProvider delayDuration={0}>
            <SidebarProvider>{children}</SidebarProvider>
        </TooltipProvider>
    );
}
