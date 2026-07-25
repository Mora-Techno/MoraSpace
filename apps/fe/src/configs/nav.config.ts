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

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", url: "/member/dashboard", icon: Home, mobile: true },
  { title: "Todos", url: "/member/todos", icon: CheckSquare, mobile: true },
  { title: "Notes", url: "/member/notes", icon: FileText, mobile: true },
  { title: "Calendar", url: "/member/calendar", icon: Calendar, mobile: true },
  { title: "Music", url: "/member/music", icon: Music2, mobile: false },
  { title: "Settings", url: "/member/settings", icon: Settings, mobile: true },
];

export const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) => item.mobile);
