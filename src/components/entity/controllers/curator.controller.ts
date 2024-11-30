import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CuratorService from "../services/curator.service";
import { Curator } from "../types/curator.interface";
import { CreateCuratorDto } from "../../../../../backend/src/curator/dto/create-curator.dto";
import { ApiError } from "next/dist/server/api-utils";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { UpdateCuratorDto } from "../dto/update-curator.dto";

export const useCuratorController = () => {
  const queryClient = useQueryClient();
  const getCurators = useQuery({
    queryKey: ["curatorList"],
    queryFn: CuratorService.getCurators,
  });

  const createCurator = useMutation<
    Curator,
    AxiosError<ApiError>,
    CreateCuratorDto
  >({
    mutationFn: (data) =>
      toast
        .promise(CuratorService.createCurator(data), {
          loading: "Создание преподавателя...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["curatorList"] });
            return "Преподаватель успешно создан";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при создании преподавателя";
          },
        })
        .unwrap(),
  });

  const updateCurator = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCuratorDto }) =>
      toast
        .promise(CuratorService.updateCurator(id, data), {
          loading: "Обновление данных преподавателя...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["curatorList"] });
            return "Данные преподавателя успешно обновлены";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при обновлении данных преподавателя";
          },
        })
        .unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curatorList"] });
    },
  });

  const deleteCurator = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      toast
        .promise(CuratorService.deleteCurator(id), {
          loading: "Удаление преподавателя...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["curatorList"] });
            return "Преподаватель успешно удалён";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при удалении преподавателя";
          },
        })
        .unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curatorList"] });
    },
  });
  return {
    curators: getCurators.data,
    isCuratorsLoading: getCurators.isLoading,
    //     getCuratorById,
    createCurator: createCurator.mutateAsync,
    updateCurator: updateCurator.mutateAsync,
    deleteCurator: deleteCurator.mutateAsync,
    isCreatingCurator: createCurator.isPending,
    isUpdatingCurator: updateCurator.isPending,
    isDeletingCurator: deleteCurator.isPending,
  };
};
