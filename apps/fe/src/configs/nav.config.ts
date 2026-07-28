import {
  Calendar,
  CheckSquare,
  FileText,
  Home,
  type LucideIcon,
  Music2,
  Settings,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  mobile?: boolean;
};

type Role = "member" | "owner";

const ALL_NAV_ITEMS: Record<Role, NavItem[]> = {
  member: [
    { title: "Dashboard", url: "/member/dashboard", icon: Home, mobile: true },
    { title: "Todos", url: "/member/todos", icon: CheckSquare, mobile: true },
    { title: "Notes", url: "/member/notes", icon: FileText, mobile: true },
    {
      title: "Calendar",
      url: "/member/calendar",
      icon: Calendar,
      mobile: true,
    },
    { title: "Music", url: "/member/music", icon: Music2, mobile: false },
    {
      title: "Settings",
      url: "/member/settings",
      icon: Settings,
      mobile: true,
    },
  ],
  owner: [
    { title: "Dashboard", url: "/owner/dashboard", icon: Home, mobile: true },
    { title: "Todos", url: "/owner/todos", icon: CheckSquare, mobile: true },
    { title: "Notes", url: "/owner/notes", icon: FileText, mobile: true },
    { title: "Calendar", url: "/owner/calendar", icon: Calendar, mobile: true },
    { title: "Music", url: "/owner/music", icon: Music2, mobile: false },
    { title: "Settings", url: "/owner/settings", icon: Settings, mobile: true },
  ],
};

export function getNavItems(role?: Role | string | null): NavItem[] {
  if (role === "owner") return ALL_NAV_ITEMS.owner;
  return ALL_NAV_ITEMS.member;
}

export function getMobileNavItems(role?: Role | string | null): NavItem[] {
  return getNavItems(role).filter((item) => item.mobile);
}

// Legacy exports for backward compatibility
export const NAV_ITEMS: NavItem[] = ALL_NAV_ITEMS.member;
export const MOBILE_NAV_ITEMS: NavItem[] = ALL_NAV_ITEMS.member.filter(
  (item) => item.mobile,
);
