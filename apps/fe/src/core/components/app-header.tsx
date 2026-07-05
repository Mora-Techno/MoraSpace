import { Leaf } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/atoms/navigation-menu";
import { navigationMenuConfig } from "@/configs/app.config";
import { cn } from "@/utils/classname";
import { User } from "lucide-react";
import Image from "next/image";
// import UserDropdown from './user.dropdown';
import LanguageDropdown from "./language.dropdown";
import NotificationDropdown from "./notification.dropdown";
import ThemeToggle from "./theme-toggle";
interface AppHeaderProps {
  state: {
    isScrolled: boolean;
    setIsScrolled: React.Dispatch<React.SetStateAction<boolean>>;
    pathname: string;
  };
}

export default function AppHeader({ state }: AppHeaderProps) {
  const { isScrolled, pathname, setIsScrolled } = state;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const style = `group inline-flex h-9 w-max items-center justify-center rounded-md  px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 `;
  const styleLogin = `group inline-flex h-9 w-max p-2 items-center justify-center rounded-md   text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 `;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b p-4 backdrop-blur-md transition-all duration-200 md:p-6",
        isScrolled
          ? "border-white/10 bg-background/90 shadow-lg shadow-black/20"
          : "border-transparent bg-background/70",
      )}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          {/* Company Logo */}
          <Link href="/home" className="flex items-center gap-2">
            <Image
              alt="company logo"
              src={"/images/logo.png"}
              height={36}
              width={36}
              className="rounded-full"
            />
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            {navigationMenuConfig?.items?.map((item) => (
              <NavigationMenuItem key={item.title}>
                <Link
                  href={item.href}
                  className={`${style} ${pathname === item.href ? "bg-accent" : "bg-background"}`}
                >
                  {item.title}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageDropdown />
          <NotificationDropdown />
          <Link href={"/login"} className={styleLogin}>
            <User />
          </Link>
          {/* <UserDropdown /> */}
        </div>
      </div>
    </nav>
  );
}
