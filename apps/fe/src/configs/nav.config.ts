import {
  Bell,
  Building2,
  Calendar,
  CheckSquare,
  FileText,
  Home,
  type LucideIcon,
  Music2,
  Settings,
  Users,
} from "lucide-react";

export type NavItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  mobile?: boolean;
  /** Sub-pages (rendered as a nested group inside the sidebar). */
  children?: NavItem[];
};

type Role = "member" | "owner";

/**
 * Fitur khas "member" yang dijadikan sub-laman di dalam area Owner.
 * Endpoint untuk konteks owner belum sepenuhnya diimplementasikan, sehingga
 * fitur ini hanya diakses sebagai sub-halaman (workspace member), bukan
 * laman utama milik owner.
 */
const MEMBER_WORKSPACE_ITEMS: NavItem[] = [
  {
    title: "Todos",
    url: "/owner/member/todos",
    icon: CheckSquare,
    mobile: true,
  },
  {
    title: "Notes",
    url: "/owner/member/notes",
    icon: FileText,
    mobile: true,
  },
  {
    title: "Calendar",
    url: "/owner/member/calendar",
    icon: Calendar,
    mobile: true,
  },
  {
    title: "Music",
    url: "/owner/member/music",
    icon: Music2,
    mobile: true,
  },
  {
    title: "Notifications",
    url: "/owner/member/notifications",
    icon: Bell,
    mobile: true,
  },
];

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
    {
      title: "Company",
      url: "/owner/company",
      icon: Building2,
      mobile: true,
    },
    {
      title: "Workspace Member",
      icon: Users,
      mobile: true,
      children: MEMBER_WORKSPACE_ITEMS,
    },
    { title: "Settings", url: "/owner/settings", icon: Settings, mobile: true },
  ],
};

export function getNavItems(role?: Role | string | null): NavItem[] {
  if (role === "owner") return ALL_NAV_ITEMS.owner;
  return ALL_NAV_ITEMS.member;
}

type MobileNavItem = NavItem & { url: string; icon: LucideIcon };

function isMobileNavItem(item: NavItem): item is MobileNavItem {
  return Boolean(item.mobile && item.url && item.icon);
}

export function getMobileNavItems(
  role?: Role | string | null,
): MobileNavItem[] {
  return getNavItems(role).flatMap((item) => {
    if (item.children?.length) {
      return item.children.filter(isMobileNavItem);
    }
    return isMobileNavItem(item) ? [item] : [];
  });
}

export function getMobileNavGroups(role?: Role | string | null): NavItem[] {
  return getNavItems(role).filter((item) => {
    if (item.children?.length) return item.mobile;
    return isMobileNavItem(item);
  });
}

export const NAV_ITEMS: NavItem[] = ALL_NAV_ITEMS.member;
export const MOBILE_NAV_ITEMS: NavItem[] = ALL_NAV_ITEMS.member.filter(
  (item) => item.mobile && item.url,
);
