"use client";

import * as React from "react";
import { BookCheck, BookMarkedIcon, User2 } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function CuratorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [login, setLogin] = React.useState<string | null>(null);
  const [role, setRole] = React.useState<string | null>(null);
  const router = useRouter();
  // Используем useEffect для получения логина из localStorage только на клиенте
  React.useEffect(() => {
    const storedLogin = localStorage.getItem("login");
    const storedRole = localStorage.getItem("role");

    setLogin(storedLogin);
    setRole(storedRole);
    if (storedRole !== "curator") {
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
        name: "Студенты",
        url: "/curator/students",
        icon: User2,
      },
      {
        name: "Экзамены",
        url: "/curator/exams",
        icon: BookCheck,
      },
      {
        name: "Зачеты",
        url: "/curator/credits",
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
