"use client";
import CreditsList from "@/components/credits/CreditsList";
import { ExamEnum } from "@/components/entity/types/exam.interface";
import { useExamController } from "@/components/entity/controllers/exam.controller";

export default function Page() {
  const { exams, isExamsLoading } = useExamController(ExamEnum.Credit);
  return (
    <div className="w-full">
      <CreditsList data={exams} isLoading={isExamsLoading} />
    </div>
  );
}
