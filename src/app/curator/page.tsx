"use client";
// import { CuratorSidebar } from "@/components/CuratorSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import StudentsList from "../../components/students/StudentsList";
import { useStudentController } from "@/components/entity/controllers/student.controller";
import { CuratorSidebar } from "@/components/CuratorSidebar";

export default function CuratorPage() {
  const { curatorStudents, isCuratorStudentsLoading } = useStudentController();

  return (
    <SidebarProvider>
      <CuratorSidebar />
      <div className="w-full">
        <StudentsList
          isLoading={isCuratorStudentsLoading}
          data={curatorStudents}
        />
      </div>
    </SidebarProvider>
  );
}
