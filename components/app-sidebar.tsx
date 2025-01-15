"use client";
import React, { useState } from "react";
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
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
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

const applicationItems = [
  {
    title: "Dreams",
    icon: BookOpen,
    url: "/dreams",
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
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();
  const [SelectedTab, setSelectedTab] = useState("Dreams");
  return (
    <Sidebar
      className="w-64 bg-[#0a1929] border-r border-blue-900/20 flex flex-col"
      collapsible="icon"
    >
      <SidebarContent>
        {/* Logo */}
        <Link href="/">
          <div className="flex flex-col items-center space-x-2">
            <div className="rounded-full overflow-hidden ">
              <img
                src="/logo.png"
                className="h-full w-full transition-transform scale-125"
                alt="ReplayDreams Logo"
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
                <a
                  href={item.url}
                  key={index}
                  onClick={() => setSelectedTab(item.title)}
                >
                  <SidebarMenuItem className="px-0">
                    <SidebarMenuButton
                      asChild
                      variant="default"
                      className={`w-full justify-start text-blue-100 hover:bg-blue-900/40 ${
                        SelectedTab === item.title ? "bg-blue-900/40" : ""
                      }`}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.title}
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </a>
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
              {optionItems.map((item) => (
                <Link
                  href={item.url}
                  onClick={() => setSelectedTab(item.title)}
                  key={item.title}
                >
                  <SidebarMenuItem className="px-0">
                    <SidebarMenuButton
                      asChild
                      variant="default"
                      className={`w-full justify-start text-blue-100 hover:bg-blue-900/40 ${
                        SelectedTab === item.title ? "bg-blue-900/40" : ""
                      }`}
                    >
                      <Button variant="ghost" className="w-full justify-start">
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

        {/* Pro Access Card */}
        {/*
          <div className="mt-8">
            <div className="bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Star className="w-8 h-8 text-blue-400" />
                <h3 className="text-lg font-semibold text-white ml-2">
                  Pro Access
                </h3>
              </div>
              <p className="text-sm text-blue-200 mb-3">
                Unlock unlimited dream visualizations and advanced features.
              </p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                Upgrade
              </Button>
            </div>
          </div>
          */}

        {/* Avatar Section at bottom */}
        <SidebarFooter className="mt-auto">
          <div className="pt-2 border-t border-blue-900/20 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="justify-start hover:bg-blue-900/40 px-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ">
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
                className="w-56 ml-auto"
                align="end"
                side="right"
                sideOffset={8}
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
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
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
