import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ExamService from "../services/exam.service";
import { Exam, ExamEnum } from "../types/exam.interface";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { CreateExamDto } from "../dto/create-exam.dto";
import { toast } from "sonner";

export const useExamController = (type?: ExamEnum | undefined) => {
  const queryClient = useQueryClient();
  const getExams = useQuery({
    queryKey: type ? ["examList", type] : ["examList"],
    queryFn: () => ExamService.getExams(type),
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
