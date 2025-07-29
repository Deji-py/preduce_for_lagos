"use client";

import * as React from "react";
import logo from "@/../public/png/logo.png";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.5 14V10C20.5 9.06812 20.5 8.60218 20.3478 8.23463C20.1448 7.74458 19.7554 7.35523 19.2654 7.15224C18.8978 7 18.4319 7 17.5 7C16.5681 7 16.1022 7 15.7346 7.15224C15.2446 7.35523 14.8552 7.74458 14.6522 8.23463C14.5 8.60218 14.5 9.06812 14.5 10V14C14.5 14.9319 14.5 15.3978 14.6522 15.7654C14.8552 16.2554 15.2446 16.6448 15.7346 16.8478C16.1022 17 16.5681 17 17.5 17C18.4319 17 18.8978 17 19.2654 16.8478C19.7554 16.6448 20.1448 16.2554 20.3478 15.7654C20.5 15.3978 20.5 14.9319 20.5 14Z"
            stroke="currentColor"
            stroke-width="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 18V10C10.5 9.06812 10.5 8.60218 10.3478 8.23463C10.1448 7.74458 9.75542 7.35523 9.26537 7.15224C8.89782 7 8.43188 7 7.5 7C6.56812 7 6.10218 7 5.73463 7.15224C5.24458 7.35523 4.85523 7.74458 4.65224 8.23463C4.5 8.60218 4.5 9.06812 4.5 10V18C4.5 18.9319 4.5 19.3978 4.65224 19.7654C4.85523 20.2554 5.24458 20.6448 5.73463 20.8478C6.10218 21 6.56812 21 7.5 21C8.43188 21 8.89782 21 9.26537 20.8478C9.75542 20.6448 10.1448 20.2554 10.3478 19.7654C10.5 19.3978 10.5 18.9319 10.5 18Z"
            stroke="currentColor"
            stroke-width="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21.5 3H3.5"
            stroke="currentColor"
            stroke-width="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "My Form",
      url: "/dashboard/my-form",
      icon: (
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 16H14.5"
            stroke="currentColor"
            stroke-width="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.228 3H8C6.75736 3 5.75 4.00736 5.75 5.25V18.75C5.75 19.9926 6.75736 21 8 21H17C18.2426 21 19.25 19.9926 19.25 18.75V12M10.228 3C11.4706 3 12.5 4.00736 12.5 5.25V7.5C12.5 8.74264 13.5074 9.75 14.75 9.75H17C18.2426 9.75 19.25 10.7574 19.25 12M10.228 3C13.9179 3 19.25 8.3597 19.25 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            {open && (
              <div className="w-24 pt-4 h-auto mb-4">
                {/* Center logo on mobile */}
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="stepperImg"
                  className="w-full"
                  width={96}
                  height={96}
                />
              </div>
            )}
            <SidebarMenuButton
              variant="outline"
              className="h-11 flex flex-col justify-center bg-transparent active:bg-transparent hover:bg-transparent items-center w-11"
            >
              <SidebarTrigger className="hover:bg-transparent" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="h-11">
            <Link href={"/dashboard/account"}>
              <SidebarMenuButton className="h-11" tooltip={"Account Settings"}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 19H18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 19H3"
                    stroke="currentColor"
                    stroke-width="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.75 17V21"
                    stroke="currentColor"
                    stroke-width="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H11"
                    stroke="currentColor"
                    stroke-width="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 12H3"
                    stroke="currentColor"
                    stroke-width="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.75 10V14"
                    stroke="currentColor"
                    stroke-width="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 5H18"
                    stroke="currentColor"
                    stroke-width="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 5H3"
                    stroke="currentColor"
                    stroke-width="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.75 3V7"
                    stroke="currentColor"
                    stroke-width="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium">Account Settings</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
