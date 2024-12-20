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
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { isValid as isValidDate } from "date-fns";
import { toast } from "sonner";
import { Gender, Student } from "@/components/entity/types/student.interface";
import { useStudentController } from "@/components/entity/controllers/student.controller";
import { Calendar } from "@/components/ui/calendar";

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

export function EditMe({ id, student }: Props) {
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
        <Button variant="outline" className="w-full">
          Заполнить дополнительную информацию
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
            <Label htmlFor="passport">Паспорт серия</Label>
            <Input
              id="passport"
              type="text"
              placeholder="Введите паспортные данные студента"
              {...register("passportSeriya", {
                maxLength: {
                  value: 4,
                  message: "Максимум 4 цифры",
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
            <Label htmlFor="passport">Паспорт номер</Label>
            <Input
              id="passport"
              type="text"
              placeholder="Введите паспортные данные студента"
              {...register("passportNomer", {
                maxLength: {
                  value: 6,
                  message: "Максимум 6 цифр",
                },
              })}
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

          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isUpdatingStudent}
          >
            {isUpdatingStudent ? <Spinner /> : "Заполнить данные"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
