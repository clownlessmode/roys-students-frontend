"use client";

import * as React from "react";
import {
  Component,
  GraduationCap,
  User2,
  BookCheck,
  BookMarkedIcon,
} from "lucide-react";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [login, setLogin] = React.useState<string | null>(null);
  const [role, setRole] = React.useState<string | null>(null);
  const router = useRouter();

  // Используем useEffect, чтобы выполнить код только на клиенте
  React.useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedLogin = localStorage.getItem("login");
    setLogin(storedLogin);
    setRole(storedRole);

    console.log(storedRole);
    if (storedRole !== "admin") {
      router.replace("/login");
    }
  }, []);

  console.log(role);

  const data = {
    user: {
      name: role === "curator" ? "Преподаватель" : "Администратор",
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
      {
        name: "Экзамены",
        url: "/admin/exams",
        icon: BookCheck,
      },
      {
        name: "Зачеты",
        url: "/admin/credits",
        icon: BookMarkedIcon,
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
