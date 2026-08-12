"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { getMobileNavGroups, type NavItem } from "@/configs/nav.config";
import { loadAuthSession } from "@/utils/storage";
import { cn } from "@/utils/classname";

type MobileLeaf = NavItem & { url: string; icon: LucideIcon };

function isRouteActive(pathname: string, url: string): boolean {
  return pathname === url || (url !== "/" && pathname.startsWith(url));
}

function isGroupActive(pathname: string, item: NavItem): boolean {
  return Boolean(
    item.children?.some(
      (child) => child.url && isRouteActive(pathname, child.url),
    ),
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  const mobileNavItems = useMemo(() => {
    const role = loadAuthSession()?.role;
    return getMobileNavGroups(role?.toLocaleLowerCase());
  }, []);

  const openItem = mobileNavItems.find((item) => item.title === openTitle);
  const subItems = openItem?.children?.filter((child): child is MobileLeaf =>
    Boolean(child.url && child.icon),
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/85 backdrop-blur-lg md:hidden">
      {subItems?.length ? (
        <div className="absolute inset-x-0 bottom-full mb-2 px-3">
          <div className="mx-auto max-w-lg rounded-2xl border border-border/60 bg-background/95 p-3 shadow-xl backdrop-blur-xl">
            <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {openItem?.title}
            </p>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {subItems.map((child) => {
                const Icon = child.icon;
                const isActive = isRouteActive(pathname, child.url);
                return (
                  <Link
                    key={child.url}
                    href={child.url}
                    onClick={() => setOpenTitle(null)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {child.title}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2 pb-safe">
        {mobileNavItems.map((item) => {
          const isGroup = Boolean(item.children?.length);

          if (isGroup) {
            const GroupIcon = item.icon;
            const isOpen = openTitle === item.title;
            const groupActive = isGroupActive(pathname, item);
            return (
              <button
                key={item.title}
                type="button"
                aria-expanded={isOpen}
                aria-label={`${item.title} menu`}
                onClick={() =>
                  setOpenTitle((prev) =>
                    prev === item.title ? null : item.title,
                  )
                }
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[10px] transition-all duration-300",
                  isOpen || groupActive
                    ? "text-primary scale-105"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {GroupIcon ? <GroupIcon className="size-5" /> : null}
                <span className="font-medium">{item.title}</span>
              </button>
            );
          }

          if (!item.url || !item.icon) return null;
          const Icon = item.icon;
          const isActive = isRouteActive(pathname, item.url);

          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[10px] transition-all duration-300",
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("size-5", isActive && "drop-shadow-sm")} />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
