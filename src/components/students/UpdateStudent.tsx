"use client";

import * as React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import Spinner from "../ui/Spinner";
import { useStudentController } from "../entity/controllers/student.controller";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { Group } from "../entity/types/group.interface";
import { useGroupController } from "../entity/controllers/group.controller";
import { Student } from "../entity/types/student.interface";

type FormValues = {
  first_name: string;
  last_name: string;
  patronymic: string;
  group_id: string;
};

interface Props {
  student: Student;
  id: string;
}

export function UpdateStudent({ id, student }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      first_name: student.first_name,
      last_name: student.last_name,
      patronymic: student.patronymic,
      group_id: student.group.id,
    },
  });

  const { updateStudent, isUpdatingStudent } = useStudentController();
  const { groups, isGroupsLoading } = useGroupController();
  console.log(student)
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await updateStudent({ id, data });
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          Изменить студента
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Изменить данные студента</DialogTitle>
          <DialogDescription>
            Измените форму для обновления данных аккаунта студента.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="last_name">Фамилия</Label>
            <Input
              id="last_name"
              type="text"
              placeholder="Введите фамилию нового студента"
              {...register("last_name", {
                required: "Введите фамилию студента",
              })}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="first_name">Имя</Label>
            <Input
              id="first_name"
              type="text"
              placeholder="Введите имя нового студента"
              {...register("first_name", {
                required: "Введите имя студента",
              })}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="patronymic">Отчество</Label>
            <Input
              id="patronymic"
              type="text"
              placeholder="Введите отчество нового студента"
              {...register("patronymic", {
                required: "Введите отчество студента",
              })}
            />
            {errors.patronymic && (
              <p className="text-red-500 text-sm">
                {errors.patronymic.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="group_id">Группа</Label>
            <Controller
              name="group_id"
              control={control}
              rules={{ required: "Выберите группу" }}
              render={({ field }) => (
                <>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Выберите группу" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Группа</SelectLabel>
                        {isGroupsLoading ? (
                          Array(7)
                            .fill(0)
                            .map((_, index) => (
                              <div
                                key={`loading-${index}`}
                                className="flex items-center gap-2 py-2"
                              >
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="w-32 h-4" />
                              </div>
                            ))
                        ) : groups && groups.length > 0 ? (
                          groups.map((group: Group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            Данные не найдены
                          </div>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isUpdatingStudent}
          >
            {isUpdatingStudent ? <Spinner /> : "Обновить cтудента"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
