import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ExamService from "../services/exam.service";
import { Exam } from "../types/exam.interface";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { CreateExamDto } from "../dto/create-exam.dto";
import { toast } from "sonner";

export const useExamController = () => {
  const queryClient = useQueryClient();
  const getExams = useQuery({
    queryKey: ["examList"],
    queryFn: ExamService.getExams,
  });

  const createExam = useMutation<Exam, AxiosError<ApiError>, CreateExamDto>({
    mutationFn: (data) =>
      toast
        .promise(ExamService.createExam(data), {
          loading: "Создание экзамена...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["examList"] });
            return "Экзамен успешно создан";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при создании студента";
          },
        })
        .unwrap(),
  });

  return {
    exams: getExams.data,
    isExamsLoading: getExams.isLoading,
    isCreatingExam: createExam.isPending,
    createExam: createExam.mutateAsync,
  };
};
