// src/auth/hooks/useAuthController.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LoginDto } from "../dto/login.dto";
import AuthService from "../services/auth.service";
import { toast } from "sonner";

interface ApiError {
  message: string[];
  error: string;
  statusCode: number;
}

export const useAuthController = () => {
  const queryClient = useQueryClient();
  const login = useMutation<
    { access_token: string; role: string },
    AxiosError<ApiError>,
    LoginDto
  >({
    mutationFn: (data) =>
      toast
        .promise(AuthService.login(data), {
          loading: "Аутентификация...",
          success: () => "Успешный вход",
          error: () => {
            return "Неверный логин и/или пароль";
          },
        })
        .unwrap(), // Используем unwrap() для получения оригинального промиса
    onSuccess: (data) => {
      // Сохранение токена в локальное хранилище или другом месте
      localStorage.setItem("access_token", data.access_token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      console.log("Успешный вход");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Ошибка аутентификации:", error.message);
    },
  });

  return {
    login: login.mutateAsync,
    isLoggingIn: login.isPending,
    isErrorLoggingIn: login.isError,
    errorLoggingIn: login.error,
  };
};
