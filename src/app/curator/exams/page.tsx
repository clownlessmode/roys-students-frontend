"use client";
import ExamsList from "@/components/exams/ExamsList";
import { ExamEnum } from "@/components/entity/types/exam.interface";
import { useExamController } from "@/components/entity/controllers/exam.controller";

export default function Page() {
  const { exams, isExamsLoading } = useExamController(ExamEnum.Exam);
  return (
    <div className="w-full">
      <ExamsList data={exams} isLoading={isExamsLoading} />
    </div>
  );
}
