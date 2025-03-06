"use client";
import * as React from "react";

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
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useStudentController } from "../entity/controllers/student.controller";
import { Skeleton } from "../ui/skeleton";
import { Student } from "../entity/types/student.interface";
import { useMarkController } from "../entity/controllers/mark.controller";
import Spinner from "../ui/Spinner";

interface Props {
  groupId: string;
  examId: string;
}

interface ScoreFormDto {
  mark: number;
  studentId: string;
  examId: string;
}

export function AddMark({ groupId, examId }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { useStudentsByGroupId } = useStudentController();
  const { data: students } = useStudentsByGroupId(groupId);
  const { createMark, isCreatingMark } = useMarkController();

  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<ScoreFormDto>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ScoreFormDto> = async (data) => {
    await createMark({ ...data, examId: examId });
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          Выставить оценку
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Выставить оценку</DialogTitle>
          <DialogDescription>
            Заполните форму для выставления оценок за экзамен.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="student_id">Выбрать студента</Label>
            <Controller
              name="studentId"
              control={control}
              rules={{ required: "Выберите студента" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Выберите студента" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Студент</SelectLabel>
                      {!students?.data ? (
                        Array(3)
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
                      ) : students.data.length > 0 ? (
                        students.data.map((student: Student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.last_name} {student.first_name}{" "}
                            {student.patronymic}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          Студенты не найдены
                        </div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mark">Оценка</Label>
            <Controller
              name="mark"
              control={control}
              rules={{ required: "Выберите оценку" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Оценка" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Оценка</SelectLabel>
                      {[2, 3, 4, 5].map((num) => (
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
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isCreatingMark}
          >
            {isCreatingMark ? <Spinner /> : "Выставить оценку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
