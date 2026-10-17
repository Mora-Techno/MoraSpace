'use client';

import { ChevronRight, Code2, Leaf, Sparkles, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/atoms';
import { getNavItems, type NavItem } from '@/configs/nav.config';
import { useWorkspaceNavRole } from '@/hooks/useWorkspaceNav';
import { cn } from '@/utils/classname';
import { loadAuthSession } from '@/utils/storage';

function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.url && (pathname === item.url || pathname.startsWith(item.url))) {
    return true;
  }
  return item.children?.some((child) => isItemActive(child, pathname)) ?? false;
}

function SubMenuItem({ item, pathname }: { item: NavItem; pathname: string }) {
  if (!item.url) return null;
  const isActive = pathname === item.url || (item.url !== '/' && pathname.startsWith(item.url));
  const Icon = item.icon;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild
        className={cn(
          'transition-all duration-300',
          isActive && 'bg-primary/15 text-primary font-medium',
        )}
      >
        <Link href={item.url}>
          {Icon ? <Icon className="size-4" /> : null}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

function MenuItem({
  item,
  pathname,
  isCollapsed,
}: {
  item: NavItem;
  pathname: string;
  isCollapsed: boolean;
}) {
  const isActive = isItemActive(item, pathname);
  const Icon = item.icon;

  // Group header (has children, no direct url)
  if (item.children?.length && !item.url) {
    if (isCollapsed) {
      return (
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip={item.title}
            className={cn('transition-all duration-300', isActive && 'bg-primary/15 text-primary')}
          >
            <div className="flex h-10 items-center gap-3 rounded-xl px-3 py-2">
              {Icon ? <Icon className="size-5" /> : <ChevronRight className="size-5" />}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem>
        <div className="flex h-10 items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground">
          {Icon ? <Icon className="size-5" /> : <ChevronRight className="size-5" />}
          <span className="font-medium text-sm">{item.title}</span>
        </div>
        <SidebarMenuSub className="mt-1 space-y-0.5">
          {item.children.map((child) => (
            <SubMenuItem key={child.url ?? child.title} item={child} pathname={pathname} />
          ))}
        </SidebarMenuSub>
      </SidebarMenuItem>
    );
  }

  // Regular link
  if (!item.url) return null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
        <Link
          href={item.url}
          className={cn(
            'flex h-10 items-center gap-3 rounded-xl px-3 py-2 transition-all duration-300',
            isActive
              ? 'bg-primary/15 text-primary font-medium shadow-sm'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          )}
        >
          {Icon ? <Icon className="size-5" /> : null}
          {!isCollapsed && <span className="font-medium">{item.title}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const navRole = useWorkspaceNavRole();
  const navItems = useMemo(() => getNavItems(navRole), [navRole]);

  const session = loadAuthSession();
  const platformRole = session?.platformRole?.toUpperCase();
  const isDeveloperUser = platformRole === 'DEVELOPER' || platformRole === 'SUPER_ADMIN';
  const isDeveloperRoute = pathname.startsWith('/developer');

  return (
    <Sidebar
      collapsible="offcanvas"
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
          <SidebarGroupLabel className="font-serif">
            {isDeveloperRoute ? 'Developer Platform' : 'Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <MenuItem
                  key={item.title}
                  item={item}
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isDeveloperUser && (
          <SidebarGroup className="mt-auto border-t border-border/30 pt-3">
            <SidebarGroupLabel className="font-serif flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
              <Sparkles className="size-3" />
              <span>Layer 1 Platform</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isDeveloperRoute ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={isCollapsed ? 'Workspace' : undefined}>
                      <Link
                        href={
                          session?.role?.toLowerCase() === 'owner'
                            ? '/owner/dashboard'
                            : '/member/dashboard'
                        }
                        className="flex h-10 items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-300"
                      >
                        <User className="size-5" />
                        {!isCollapsed && <span className="font-medium">Kembali ke Workspace</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={isCollapsed ? 'Developer Console' : undefined}
                    >
                      <Link
                        href="/developer/dashboard"
                        className="flex h-10 items-center gap-3 rounded-xl px-3 py-2 text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 transition-all duration-300 font-medium"
                      >
                        <Code2 className="size-5" />
                        {!isCollapsed && <span>Developer Console</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
