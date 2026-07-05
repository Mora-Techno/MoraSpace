"use client";

import { Leaf } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/atoms";
import { NAV_ITEMS } from "@/configs/nav.config";
import { cn } from "@/utils/classname";

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50 bg-sidebar/90 backdrop-blur-md"
    >
      <SidebarHeader className="flex h-20 items-center justify-center border-b border-border/40 p-4">
        {isCollapsed ? (
          <Leaf className="size-6 text-primary" />
        ) : (
          <div className="flex items-center gap-2">
            <Leaf className="size-6 text-primary" />
            <span className="font-serif text-xl font-semibold">MoraSpace</span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-serif">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/" && pathname.startsWith(item.url));
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <Link
                        href={item.url}
                        className={cn(
                          "flex h-10 items-center gap-3 rounded-xl px-3 py-2 transition-all duration-300",
                          isActive
                            ? "bg-primary/15 text-primary font-medium shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        <Icon className="size-5" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
