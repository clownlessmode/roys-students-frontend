"use client";
import ExamsList from "@/components/exams/ExamsList";
import { useExamController } from "@/components/entity/controllers/exam.controller";

export default function Page() {
  const { exams, isExamsLoading } = useExamController();
  return (
    <div className="w-full">
      <ExamsList data={exams} isLoading={isExamsLoading} />
    </div>
  );
}
