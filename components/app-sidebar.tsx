"use client";
import React, { useEffect, useState } from "react";
import {
  Moon,
  BookOpen,
  History,
  CreditCard,
  Settings,
  HelpCircle,
  Star,
  LogOut,
  User,
  Users,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "next-auth/react";
import Logo from "@/app/dreams/Logo";

import { usePathname } from "next/navigation";
import { set } from "mongoose";

const applicationItems = [
  {
    title: "Dreams",
    icon: BookOpen,
    url: "/dreams",
  },
  {
    title: "Community",
    icon: Users,
    url: "/dreams/community",
  },
  {
    title: "Gallery",
    icon: PackageOpen,
    url: "/dreams/gallery",
  },
  {
    title: "Billing",
    icon: CreditCard,
    url: "/dreams/billing",
  },
];

const optionItems = [
  {
    title: "Settings",
    icon: Settings,
    url: "/dreams/settings",
  },
  {
    title: "Support",
    icon: HelpCircle,
    url: "/dreams/support",
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [currentPath, setCurrentPath] = useState("");
  const {
    state,

    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();
  const menuState = localStorage.getItem("menuState");

  useEffect(() => {
    setCurrentPath(pathname);
    console.log(`Current path is ${pathname}`);
  }, [pathname]);

  useEffect(() => {
    const savedMenuState = localStorage.getItem("menuState");
    if (savedMenuState === "collapsed") {
      setOpen(false);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("menuState", state);
  }, [state]);
  document.addEventListener("DOMContentLoaded", () => {
    if (menuState === "collapsed") {
      setOpen(false);
    }
  });

  const handleNavigation = (url: string) => {
    setCurrentPath(url);
    localStorage.setItem("currentPath", url);
  };

  document.addEventListener("DOMContentLoaded", () =>
    setCurrentPath(window.location.pathname)
  );
  return (
    <Sidebar
      className="w-64 bg-[#0a1929] border-r border-blue-900/20 flex flex-col z-50  "
      collapsible="icon"
    >
      <SidebarContent className="overflow-x-hidden">
        {/* Logo */}
        <Link href="/">
          <div className="flex flex-col items-center space-x-2">
            <div className="rounded-full overflow-hidden">
              <Image
                src="/logo.png"
                className="h-full w-full transition-transform scale-125"
                width={150}
                height={150}
                alt="ReplayDreams Logo"
                priority
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHSIeHyMdHSUkISEhJCQkISEkJCYmJiYmJiYoKCoqKCgrKysrKysrKysrKyv/2wBDAR"
              />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <Logo test="false" />
            </div>
          </div>
        </Link>

        {/* Application Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm text-gray-400 px-3 py-2">
            APPLICATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {applicationItems.map((item, index) => (
                <Link
                  href={item.url}
                  key={index}
                  onClick={() => handleNavigation(item.url)}
                >
                  <SidebarMenuItem className="px-0">
                    <SidebarMenuButton
                      asChild
                      variant="default"
                      className={`w-full justify-start text-blue-100  ${
                        currentPath === item.url
                          ? "bg-blue-900/40"
                          : "hover:bg-blue-900/20"
                      }`}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start hover:bg-blue-900/40 active:bg-blue-900/40 focus:bg-blue-900/40 ${
                          currentPath === item.url ? "bg-blue-900/40" : ""
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.title}
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Options Group */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-sm text-gray-400 px-3 py-2">
            OPTIONS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {optionItems.map((item, index) => (
                <Link
                  href={item.url}
                  key={index}
                  onClick={() => handleNavigation(item.url)}
                >
                  <SidebarMenuItem className="px-0">
                    <SidebarMenuButton
                      asChild
                      variant="default"
                      className={`w-full justify-start text-blue-100 ${
                        currentPath === item.url
                          ? "bg-blue-900/40"
                          : "hover:bg-blue-900/20"
                      }`}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start hover:bg-blue-900/40 active:bg-blue-900/40 focus:bg-blue-900/40 ${
                          currentPath === item.url ? "bg-blue-900/40" : ""
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.title}
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Avatar Section at bottom */}
      <SidebarFooter className="mt-auto overflow-hidden">
        <div className="pt-2  border-t border-blue-900/20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`justify-start hover:bg-blue-900/40 ${
                  state === "collapsed" ? "w-10" : "w-full"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    className={`h-8 w-8 transition-transform duration-300 ${
                      state === "collapsed" ? "-translate-x-4" : ""
                    }`}
                  >
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="text-blue-100">
                      {session?.user?.name || "User"}
                    </span>
                    <span className="text-blue-400 text-xs">
                      {session?.user?.email}
                    </span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-40 ml-auto bg-[#0f1420]/95 border border-[#2a3040] backdrop-blur-sm"
              align="end"
              side="right"
              sideOffset={8}
            >
              <DropdownMenuLabel className="text-[#b4c6db] font-serif">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#2a3040]" />
              <DropdownMenuGroup>
                <Link
                  href={`/dreams/profile/${session?.user?.name
                    ?.toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  <DropdownMenuItem className="focus:bg-[#1a2030] text-[#a9c5dd] hover:text-[#fff] cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dreams/settings">
                  <DropdownMenuItem className="focus:bg-[#1a2030] text-[#a9c5dd] hover:text-[#fff] cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-[#2a3040]" />
              <DropdownMenuItem
                className="focus:bg-[#1a2030] text-[#a9c5dd] hover:text-[#fff] cursor-pointer"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
