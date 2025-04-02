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

import { Label } from "../ui/label";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Skeleton } from "../ui/skeleton";
import { useGroupController } from "../entity/controllers/group.controller";
import { useCourseCalculator } from "@/hooks/use-course-calculator";
import { useCuratorController } from "../entity/controllers/curator.controller";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useExamController } from "../entity/controllers/exam.controller";
import { CreateExamDto } from "../entity/dto/create-exam.dto";
import Spinner from "../ui/Spinner";
import { ExamEnum } from "../entity/types/exam.interface";
const disciplines = [
  "ОУД.01 Русский язык",
  "ОУД.01 Литература",
  "ОУД.02 Иностранный язык",
  "ОУД.03 Математика",
  "ОУД.04 История",
  "ОУД.05 Физическая культура",
  "ОУД.06 Основы безопасности жизнедеятельности",
  "ОУД.18 Астрономия",
  "ОГСЭ.01 Основы философии",
  "ОГСЭ.02 История",
  "ОГСЭ.03 Иностранный язык в профессиональной деятельности",
  "ОГСЭ.04 Физическая культура",
  "ОГСЭ.05 Психология общения",
  "ПМ.01 Разработка модулей программного обеспечения для компьютерных систем",
  "МДК.01.01 Разработка программных модулей",
  "МДК.01.02 Поддержка и тестировнаие программных модулей",
  "МДК.01.03 Разработка мобильных приложений",
  "МДК.01.04 Системное программирование",
  "УП.01 Учебная практика",
  "ПП.01 Производственная практика",
  "ПМ.02 Осуществление интеграции программных модулей",
  "МДК.02.01 Технология разработки программного обеспечения",
  "МДК.02.02 Инструментальные средства разработки программного обеспечения",
  "МДК.02.03 Математическое моделирование",
  "УП.02 Учебная практика",
  "ПП.02 Производственная практика",
  "ПМ.04 Сопровождение и обслуживание программного обеспечения компьютерных систем",
  "МДК.04.01 Внедрение и поддержка компьютерных систем",
  "МДК.04.02 Обеспечение качества функционирования компьютерных систем",
  "УП.04 Учебная практика",
  "ПП.04.02 Производственная практика",
  "ПМ 11 Разработка, администрирование и защита баз данных",
  "МДК.11.01 Технология разработки и защиты баз данных",
  "УП .11 Учебная практика",
  "ПП.11 Производственная практика",
  "ПМ 12 Разработчик Python",
  "МДК.12.01 Python для автоматизации ИТ-инфраструктуры",
  "УП .12 Учебная практика",
  "ПП.12 Производственная практика",
];
export function AddNewExam() {
  const [isOpen, setIsOpen] = React.useState(false);

  const { groups, isGroupsLoading } = useGroupController();
  const { curators, isCuratorsLoading } = useCuratorController();

  const {
    control,
    setValue,
    watch,

    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateExamDto>({
    mode: "onChange",
  });

  const selectedGroupName =
    groups?.find((group) => group.id === watch("group_id"))?.name || "";

  const course = useCourseCalculator(selectedGroupName);
  const { createExam, isCreatingExam } = useExamController();

  React.useEffect(() => {
    if (course) setValue("course", course);
  }, [course, setValue]);

  const onSubmit: SubmitHandler<CreateExamDto> = async (
    data: CreateExamDto
  ) => {
    if (data.holding_date && !isValidDate(new Date(data.holding_date))) {
      toast.error("Дата проведения экзамена должна быть корректной");
      return;
    }
    await createExam({ ...data, type: ExamEnum.Exam });
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Добавить экзамен</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить экзамен</DialogTitle>
          <DialogDescription>
            Заполните форму для создания нового экзамена.
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
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
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
            <Controller
              name="discipline"
              control={control}
              rules={{ required: "Введите название дисциплины" }}
              render={({ field }) => (
                <div>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full max-w-[375px] truncate">
                      <SelectValue placeholder="Выберите дисциплину" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplines.map((discipline, idx) => (
                        <SelectItem key={idx} value={discipline}>
                          {discipline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.discipline && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.discipline.message}
                    </p>
                  )}
                </div>
              )}
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
            <Label htmlFor="holding_date">Дата проведения экзамена</Label>
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isCreatingExam}
          >
            {isCreatingExam ? <Spinner /> : "Создать экзамен"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
