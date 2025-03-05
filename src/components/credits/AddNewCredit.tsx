"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { isValid as isValidDate } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Skeleton } from "../ui/skeleton";
import { useGroupController } from "../entity/controllers/group.controller";
import { CreateCreditDto } from "../entity/dto/create-credit.dto";
import { useCourseCalculator } from "@/hooks/use-course-calculator";
import { useCuratorController } from "../entity/controllers/curator.controller";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AddNewCredit() {
  const [isOpen, setIsOpen] = React.useState(false);

  const { groups, isGroupsLoading } = useGroupController();
  const { curators, isCuratorsLoading } = useCuratorController();

  const {
    control,
    setValue,
    watch,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCreditDto>({
    mode: "onChange",
  });

  const selectedGroupName =
    groups?.find((group) => group.id === watch("group_id"))?.name || "";

  const course = useCourseCalculator(selectedGroupName);

  React.useEffect(() => {
    if (course) setValue("course", course);
  }, [course, setValue]);

  const onSubmit: SubmitHandler<CreateCreditDto> = async (
    data: CreateCreditDto
  ) => {
    if (data.holding_date && !isValidDate(new Date(data.holding_date))) {
      toast.error("Дата проведения зачета должна быть корректной");
      return;
    }
    console.log(data);
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Добавить зачет</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить зачет</DialogTitle>
          <DialogDescription>
            Заполните форму для создания нового зачета.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="group_id">Выбрать группу</Label>
            <Controller
              name="group_id"
              control={control}
              rules={{ required: "Выберите группу" }}
              render={({ field }) => (
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
                        groups.map((group) => (
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
              )}
            />
          </div>
          <div className="flex justify-between gap-4">
            <div className="grid gap-2 w-1/2">
              <Label htmlFor="semester">Выбрать семестр</Label>
              <Controller
                name="semester"
                control={control}
                rules={{ required: "Выберите семестр" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Семестр" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Семестр</SelectLabel>
                        {[1, 2, 3, 4].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid gap-2 w-1/2">
              <Label htmlFor="course">Выбрать курс</Label>
              <Controller
                name="course"
                control={control}
                rules={{ required: "Выберите курс" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={String(field.value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Курс" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Курс</SelectLabel>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="discipline">Дисциплина</Label>
            <Input
              id="discipline"
              type="text"
              placeholder="Введите название дисциплины"
              {...register("discipline", {
                required: "Введите название дисциплины",
              })}
            />
            {errors.discipline && (
              <p className="text-red-500 text-sm">
                {errors.discipline.message}
              </p>
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
          <div className="grid gap-2">
            <Label htmlFor="birthdate">Дата проведения зачета</Label>
            <Controller
              name="holding_date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(new Date(field.value), "PPP", { locale: ru })
                      ) : (
                        <span>Выберите дату</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            Сохранить
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
