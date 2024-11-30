"use client";

import * as React from "react";
import { Component, GraduationCap, User2 } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [login, setLogin] = React.useState<string | null>(null);

  // Используем useEffect, чтобы выполнить код только на клиенте
  React.useEffect(() => {
    const storedLogin = localStorage.getItem("login");
    setLogin(storedLogin);
  }, []);

  const data = {
    user: {
      name: "Администратор",
      email: login || "",
      avatar: login || "",
    },
    projects: [
      {
        name: "Преподаватели",
        url: "/admin/curators",
        icon: GraduationCap,
      },
      {
        name: "Студенты",
        url: "/admin/students",
        icon: User2,
      },
      {
        name: "Группы",
        url: "/admin/groups",
        icon: Component,
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
