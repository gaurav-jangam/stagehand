
"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { Music, ListMusic, Users, LogOut, BrainCircuit, Mic, Guitar, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/app/login/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from './ui/avatar';


const musicIcons = [Music, Mic, Guitar, Waves];

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname.startsWith(path);
  const [Icon, setIcon] = useState(() => musicIcons[0]);

  useEffect(() => {
    setIcon(() => musicIcons[Math.floor(Math.random() * musicIcons.length)]);
  }, [pathname]);
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
              <Link href="/dashboard">
                <Music className="size-5 text-primary" />
              </Link>
            </Button>
            <h1 className="font-headline text-2xl font-bold text-foreground">Stagehand</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Song Library" isActive={isActive('/dashboard/songs') || pathname === '/dashboard'}>
                <Link href="/dashboard">
                  <ListMusic />
                  <span>Song Library</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Shows" isActive={isActive('/dashboard/shows')}>
                <Link href="/dashboard/shows">
                  <Users />
                  <span>Shows</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="AI Assistant" isActive={isActive('/dashboard/assistant')}>
                <Link href="/dashboard/assistant">
                  <BrainCircuit />
                  <span>AI Assistant</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Gandharva</span>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <LogOut className="mr-2" /> Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be returned to the public landing page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2 md:hidden">
            <SidebarTrigger />
            <span className="font-headline text-xl font-bold">Stagehand</span>
        </div>
        <div className="flex-1"></div>
            <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className='md:hidden'>
                <LogOut />
            </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>
                You will be returned to the public landing page.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </>
  );
}
