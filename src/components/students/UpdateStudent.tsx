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
import { Gender, Student } from "../entity/types/student.interface";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { isValid as isValidDate } from "date-fns";
import { toast } from "sonner";

type FormValues = {
  first_name: string;
  last_name: string;
  patronymic: string;
  group_id: string;
  gender?: Gender | null;
  birthdate?: Date | null;
  snils?: string | null;
  passportSeriya?: string | null;
  passportNomer?: string | null;
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
      snils: student.snils,
      passportSeriya: student.passport ? student.passport.slice(0, 4) : null,
      passportNomer: student.passport ? student.passport.slice(5) : null,
      birthdate: student.birthdate,
      gender: student.gender,
    },
  });

  const { updateStudent, isUpdatingStudent } = useStudentController();
  const { groups, isGroupsLoading } = useGroupController();
  console.log(student);
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    if (data.birthdate && !isValidDate(new Date(data.birthdate))) {
      toast.error("Дата рождения должна быть корректной датой");
      return;
    }
    const payload = {
      ...data,
      birthdate: data.birthdate ? new Date(data.birthdate).toISOString() : null,
      passport: `${data.passportSeriya} ${data.passportNomer}`,
    };

    await updateStudent({ id, data: payload });
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
            <Label htmlFor="snils">СНИЛС</Label>
            <Input
              id="snils"
              type="text"
              placeholder="Введите СНИЛС студента"
              {...register("snils", {
                required: "Поле обязательно для заполнения",
              })}
            />
            {errors.snils && (
              <p className="text-red-500 text-sm">{errors.snils.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="passport">Номер телефона</Label>
            <Input
              id="passport"
              type="text"
              placeholder="Введите телефон студента"
              {...register("passportSeriya", {
                maxLength: {
                  value: 11,
                  message: "Максимум 11 цифр",
                },
              })}
            />
            {errors.passportSeriya && (
              <p className="text-red-500 text-sm">
                {errors.passportSeriya.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="passport">Почта</Label>
            <Input
              id="passport"
              type="email"
              placeholder="Введите почту студента"
              {...register("passportNomer")}
            />
            {errors.passportNomer && (
              <p className="text-red-500 text-sm">
                {errors.passportNomer.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="birthdate">Дата рождения</Label>
            <Controller
              name="birthdate"
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
                      selected={field.value ? new Date(field.value) : undefined} // Обеспечиваем корректную типизацию
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gender">Пол</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "" ? null : value)
                  }
                  value={field.value || Gender.MALE}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите пол" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Gender.MALE}>Мужской</SelectItem>
                    <SelectItem value={Gender.FEMALE}>Женский</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
