import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StudentService from "../services/student.service";
import { Student } from "../types/student.interface";
import { ApiError } from "next/dist/server/api-utils";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { UpdateStudentDto } from "../dto/update-student.dto";
import { CreateStudentDto } from "../dto/create-student.dto";

export const useStudentController = () => {
  const queryClient = useQueryClient();
  const getStudents = useQuery({
    queryKey: ["studentList"],
    queryFn: StudentService.getStudents,
  });

  const useStudentsByGroupId = (groupId: string) =>
    useQuery({
      queryKey: ["studentListByGroupId", groupId],
      queryFn: () => StudentService.getStudentsByGroupId(groupId),
    });

  const getStudentsByCurator = useQuery({
    queryKey: ["studentCuratorList"],
    queryFn: StudentService.getStudentsByCurator,
  });

  const getMe = useQuery({
    queryKey: ["studentMe"],
    queryFn: StudentService.getMe,
  });
  const createStudent = useMutation<
    Student,
    AxiosError<ApiError>,
    CreateStudentDto
  >({
    mutationFn: (data) =>
      toast
        .promise(StudentService.createStudent(data), {
          loading: "Создание студента...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["studentList"] });
            return "Студент успешно создан";
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

  const updateStudent = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentDto }) =>
      toast
        .promise(StudentService.updateStudent(id, data), {
          loading: "Обновление данных студента...",
          success: () => {
            queryClient.invalidateQueries({
              queryKey: ["studentList", "studentMe"],
            });
            return "Данные студента успешно обновлены";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при обновлении данных студента";
          },
        })
        .unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentList", "studentMe"] });
    },
  });

  const deleteStudent = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      toast
        .promise(StudentService.deleteStudent(id), {
          loading: "Удаление студента...",
          success: () => {
            queryClient.invalidateQueries({ queryKey: ["studentList"] });
            return "Студент успешно удалён";
          },
          error: (err) => {
            if (err.response?.data) {
              return `Произошла ошибка: ${err.response.data.message}`;
            }
            return "Ошибка при удалении студента";
          },
        })
        .unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentList"] });
    },
  });
  return {
    curatorStudents: getStudentsByCurator.data,
    isCuratorStudentsLoading: getStudentsByCurator.isLoading,
    me: getMe.data,
    isMeLoading: getMe.isLoading,
    students: getStudents.data,
    isStudentsLoading: getStudents.isLoading,
    createStudent: createStudent.mutateAsync,
    updateStudent: updateStudent.mutateAsync,
    deleteStudent: deleteStudent.mutateAsync,
    isCreatingStudent: createStudent.isPending,
    isUpdatingStudent: updateStudent.isPending,
    isDeletingStudent: deleteStudent.isPending,
    useStudentsByGroupId,
  };
};
