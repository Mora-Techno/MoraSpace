"use client";

import { Leaf } from "lucide-react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/atoms";
import { AppSidebar } from "@/core/components/app-sidebar";
import { BottomNav } from "@/core/components/bottom-nav";
import LanguageDropdown from "@/core/components/language.dropdown";
import NotificationDropdown from "@/core/components/notification.dropdown";
import ThemeToggle from "@/core/components/theme-toggle";
import { FloatingMusicPlayer } from "@/components/organisms/FloatingMusicPlayer";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import Image from "next/image";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { currentTrack } = useMusicPlayer();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <SidebarInset className="min-h-screen">
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/50 bg-background/75 px-4 backdrop-blur-md md:h-20 md:px-6">
              <SidebarTrigger className="hidden md:inline-flex" />
              <div className="flex items-center gap-2 md:hidden">
                <Leaf className="size-5 text-primary" />
                <span className="font-serif text-lg font-semibold">
                  MoraSpace
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                <LanguageDropdown />
                <NotificationDropdown />
                <Image
                  alt="users"
                  src={"/avatars/2.png"}
                  height={38}
                  width={38}
                  className="rounded-full"
                />
              </div>
            </header>

            <main
              className={
                currentTrack
                  ? "flex-1 overflow-auto pb-32 md:pb-6"
                  : "flex-1 overflow-auto pb-20 md:pb-6"
              }
            >
              <div className="mx-auto w-full max-w-full p-4 md:p-8">
                {children}
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
      <FloatingMusicPlayer />
      <BottomNav />
    </SidebarProvider>
  );
}
