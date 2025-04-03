"use client";

import React from "react";
import StudentsList from "../../components/students/StudentsList";
import { useStudentController } from "@/components/entity/controllers/student.controller";

export default function CuratorPage() {
  const { curatorStudents, isCuratorStudentsLoading } = useStudentController();

  return (
    <div className="w-full">
      <StudentsList
        isLoading={isCuratorStudentsLoading}
        data={curatorStudents}
      />
    </div>
  );
}
