import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mark } from "../types/mark.interface";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { CreateMarkDto } from "../dto/create-mark.dto";
import { toast } from "sonner";
import MarkService from "../services/mark.service";

export const useMarkController = () => {
  const queryClient = useQueryClient();

  const createMark = useMutation<Mark, AxiosError<ApiError>, CreateMarkDto>({
    mutationFn: (data) =>
      toast
        .promise(MarkService.create(data), {
          loading: "Выставление оценки...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["markList"] });
            return "Оценка успешно выставлена";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при создании оценки";
          },
        })
        .unwrap(),
  });

  return {
    createMark: createMark.mutateAsync,
    isCreatingMark: createMark.isPending,
  };
};
