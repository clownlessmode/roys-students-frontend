"use client";

import { useStudentController } from "@/components/entity/controllers/student.controller";
import LoadingScreen from "@/components/LoadingScreen";
import StudentProfile from "./form";

export default function Page() {
  const { me, isMeLoading } = useStudentController();

  return (
    <main className="flex justify-center items-center h-screen w-full">
      {isMeLoading ? (
        <LoadingScreen />
      ) : me ? (
        <StudentProfile student={me} />
      ) : (
        <p>Данные о студенте недоступны</p>
      )}
    </main>
  );
}
