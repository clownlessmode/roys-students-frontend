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

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import Spinner from "../ui/Spinner";
import { useExamController } from "../entity/controllers/exam.controller";
import { Input } from "../ui/input";

interface Props {
  examId: string;
}

interface ScoreFormDto {
  link: string;
}

export function AddLinkExam({ examId }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { addLink, isAddingLink } = useExamController();

  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<ScoreFormDto>({
    mode: "onChange",
    defaultValues: {
      link: "",
    },
  });

  const onSubmit: SubmitHandler<ScoreFormDto> = async (data) => {
    await addLink({ id: examId, data: { link: data.link } });
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          Добавить ссылку на билеты
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавление ссылки на билеты</DialogTitle>
          <DialogDescription>
            Заполните форму для добавления ссылки на билеты данного экзамена.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="link">Ссылка</Label>
            <Controller
              name="link"
              control={control}
              rules={{ required: "Выберите студента" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="link"
                  type="text"
                  placeholder="Введите ссылку на билеты"
                />
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isAddingLink}
          >
            {isAddingLink ? <Spinner /> : "Добавить ссылку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
