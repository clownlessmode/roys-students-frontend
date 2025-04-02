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

  const addLink = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { link: string } }) =>
      toast
        .promise(ExamService.addLink(id, data), {
          loading: "Добавление ссылки на билеты...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["examList"] });
            return "Ссылка на билеты успешно добавлена";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при добавлении ссылки на билеты";
          },
        })
        .unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examList"] });
    },
  });

  const deleteExamen = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      toast
        .promise(ExamService.deleteExamen(id), {
          loading: "Удаление...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["examList"] });
            return "Успешно удалено";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при удалении";
          },
        })
        .unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examList"] });
    },
  });

  return {
    deleteExam: deleteExamen.mutateAsync,
    isDeleting: deleteExamen.isPending,
    addLink: addLink.mutateAsync,
    isAddingLink: addLink.isPending,
    exams: getExams.data,
    isExamsLoading: getExams.isLoading,
    isCreatingExam: createExam.isPending,
    createExam: createExam.mutateAsync,
  };
};
