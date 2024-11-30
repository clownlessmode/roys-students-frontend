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
import { useGroupController } from "../entity/controllers/group.controller";
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
import { useCuratorController } from "../entity/controllers/curator.controller";

type FormValues = {
  name: string;
  curator_id: string;
};

export function AddNewGroup() {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onChange" });

  const { createGroup, isCreatingGroup } = useGroupController();
  const { curators, isCuratorsLoading } = useCuratorController();

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    console.log(data.curator_id);
    await createGroup(data);
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Добавить группу</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить новую группу</DialogTitle>
          <DialogDescription>
            Заполните форму для создания новой группы.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              type="text"
              placeholder="Введите название новой группы"
              {...register("name", {
                required: "Введите название новой группы",
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="curator_id">Преподаватель</Label>
            <Controller
              name="curator_id"
              control={control}
              rules={{ required: "Выберите преподавателя" }}
              render={({ field }) => (
                <>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Выберите преподавателя" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Преподаватели</SelectLabel>
                        {isCuratorsLoading ? (
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
                        ) : curators && curators.length > 0 ? (
                          curators.map((curator) => (
                            <SelectItem key={curator.id} value={curator.id}>
                              {curator.last_name} {curator.first_name}{" "}
                              {curator.patronymic}
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
            disabled={!isValid || isCreatingGroup}
          >
            {isCreatingGroup ? <Spinner /> : "Создать группу"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
