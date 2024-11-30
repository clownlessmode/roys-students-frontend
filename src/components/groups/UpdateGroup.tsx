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

import Spinner from "../ui/Spinner";
import { useGroupController } from "../entity/controllers/group.controller";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCuratorController } from "../entity/controllers/curator.controller";
import { Skeleton } from "../ui/skeleton";
import { Group } from "../entity/types/group.interface";

type FormValues = {
  curator_id: string;
  name: string;
};

interface Props {
  group: Group;
  id: string;
}

export function UpdateGroup({ id, group }: Props) {
  const { updateGroup, isUpdatingGroup } = useGroupController();
  const { curators, isCuratorsLoading } = useCuratorController();
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
      curator_id: group.curator.id,
      name: group.name,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await updateGroup({ id, data });
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          Изменить
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Обновление данных группы</DialogTitle>
          <DialogDescription>
            Заполните форму для обновления данных группы {group.name}.
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
                        <SelectLabel>Преподаватель</SelectLabel>
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
            disabled={!isValid || isUpdatingGroup}
          >
            {isUpdatingGroup ? <Spinner /> : "Обновить преподавателя"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
