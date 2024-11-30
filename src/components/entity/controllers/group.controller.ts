import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GroupService from "../services/group.service";
import { Group } from "../types/group.interface";
import { ApiError } from "next/dist/server/api-utils";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { UpdateGroupDto } from "../dto/update-group.dto";
import { CreateGroupDto } from "../dto/create-group.dto";

export const useGroupController = () => {
  const queryClient = useQueryClient();
  const getGroups = useQuery({
    queryKey: ["groupList"],
    queryFn: GroupService.getGroups,
  });

  const createGroup = useMutation<Group, AxiosError<ApiError>, CreateGroupDto>({
    mutationFn: (data) =>
      toast
        .promise(GroupService.createGroup(data), {
          loading: "Создание группы...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["groupList"] });
            return "Группа успешно создан";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при создании группы";
          },
        })
        .unwrap(),
  });

  const updateGroup = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGroupDto }) =>
      toast
        .promise(GroupService.updateGroup(id, data), {
          loading: "Обновление данных группы...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["groupList"] });
            return "Данные группы успешно обновлены";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при обновлении данных группы";
          },
        })
        .unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupList"] });
    },
  });

  const deleteGroup = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      toast
        .promise(GroupService.deleteGroup(id), {
          loading: "Удаление группы...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["groupList"] });
            return "Группа успешно удалёна";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при удалении группы";
          },
        })
        .unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupList"] });
    },
  });
  return {
    groups: getGroups.data,
    isGroupsLoading: getGroups.isLoading,
    createGroup: createGroup.mutateAsync,
    updateGroup: updateGroup.mutateAsync,
    deleteGroup: deleteGroup.mutateAsync,
    isCreatingGroup: createGroup.isPending,
    isUpdatingGroup: updateGroup.isPending,
    isDeletingGroup: deleteGroup.isPending,
  };
};
