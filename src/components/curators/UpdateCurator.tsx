"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { useCuratorController } from "../entity/controllers/curator.controller";
import Spinner from "../ui/Spinner";

type FormValues = {
  first_name: string;
  last_name: string;
  patronymic: string;
  login: string;
  password: string;
};

interface Props {
  curator: FormValues;
  id: string;
}

export function UpdateCurator({ id, curator }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      first_name: curator.first_name,
      last_name: curator.last_name,
      login: curator.login,
      password: curator.password,
      patronymic: curator.patronymic,
    },
  });

  const { updateCurator, isUpdatingCurator } = useCuratorController();

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await updateCurator({ id, data });
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">Изменить</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Обновление данных преподавателя</DialogTitle>
          <DialogDescription>
            Заполните форму для обновления данных преподавателя {curator.first_name}{" "}
            {curator.last_name} {curator.patronymic}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="last_name">Фамилия</Label>
            <Input
              id="last_name"
              type="text"
              placeholder="Введите фамилию нового преподавателя"
              {...register("last_name", {
                required: "Введите фамилию преподавателя",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="first_name">Имя</Label>
            <Input
              id="first_name"
              type="text"
              placeholder="Введите имя нового преподавателя"
              {...register("first_name", {
                required: "Введите имя преподавателя",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="patronymic">Отчество</Label>
            <Input
              id="patronymic"
              type="text"
              placeholder="Введите отчество нового преподавателя"
              {...register("patronymic", {
                required: "Введите отчество преподавателя",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="login">Логин</Label>
            <Input
              id="login"
              type="text"
              placeholder="Введите логин нового преподавателя"
              {...register("login", {
                required: "Введите логин преподавателя",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="Введите пароль нового преподавателя"
              {...register("password", {
                required: "Введите пароль преподавателя",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isUpdatingCurator}
          >
            {isUpdatingCurator ? <Spinner /> : "Обновить преподавателя"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
