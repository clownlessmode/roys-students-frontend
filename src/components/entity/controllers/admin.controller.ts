// src/admin/hooks/useAdminController.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CreateAdminDto } from "../dto/create-admin.dto";
import AdminService from "../services/admin.service";
import { DefaultEntity } from "../types/default.entity";
import { toast } from "sonner";

interface ApiError {
  message: string[];
  error: string;
  statusCode: number;
}

export const useAdminController = () => {
  const queryClient = useQueryClient();
  const createAdmin = useMutation<
    DefaultEntity,
    AxiosError<ApiError>,
    CreateAdminDto
  >({
    mutationFn: (data) =>
      toast
        .promise(AdminService.createAdmin(data), {
          loading: "Создание администратора...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["adminList"] });
            return "Администратор успешно создан";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при создании администратора";
          },
        })
        .unwrap(), // Используем unwrap() для получения оригинального промиса
  });

  return {
    createAdmin: createAdmin.mutateAsync,
    isCreatingAdmin: createAdmin.isPending,
  };
};
