"use client";
import { useStudentController } from "@/components/entity/controllers/student.controller";
import StudentsList from "@/components/students/StudentsList";
import React from "react";

export default function Page() {
  const { students, isStudentsLoading } = useStudentController();
  return (
    <div className="w-full">
      <StudentsList isLoading={isStudentsLoading} data={students} />
    </div>
  );
}
