"use client";

import * as React from "react";
import { User2 } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

export function CuratorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const login = localStorage.getItem("login");
  const data = {
    user: {
      name: "Преподаватель",
      email: login || "",
      avatar: login || "",
    },
    projects: [
      {
        name: "Студенты",
        url: "/admin/students",
        icon: User2,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
