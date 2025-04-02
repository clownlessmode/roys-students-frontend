"use client";

import * as React from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
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

export function AddNewCurator() {
  const [isOpen, setIsOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onChange" });

  const { createCurator, isCreatingCurator } = useCuratorController();

  const firstName = useWatch({ control, name: "first_name" });
  const lastName = useWatch({ control, name: "last_name" });
  const patronymic = useWatch({ control, name: "patronymic" });

  // 🔤 Транслитерация русского текста в латиницу
  const transliterate = (text: string): string => {
    const map: Record<string, string> = {
      а: "a",
      б: "b",
      в: "v",
      г: "g",
      д: "d",
      е: "e",
      ё: "e",
      ж: "zh",
      з: "z",
      и: "i",
      й: "y",
      к: "k",
      л: "l",
      м: "m",
      н: "n",
      о: "o",
      п: "p",
      р: "r",
      с: "s",
      т: "t",
      у: "u",
      ф: "f",
      х: "h",
      ц: "ts",
      ч: "ch",
      ш: "sh",
      щ: "sch",
      ъ: "",
      ы: "y",
      ь: "",
      э: "e",
      ю: "yu",
      я: "ya",
    };

    return text
      .split("")
      .map((char) => {
        const lower = char.toLowerCase();
        const isUpper = char === char.toUpperCase();
        const translit = map[lower] || lower;
        return isUpper
          ? translit.charAt(0).toUpperCase() + translit.slice(1)
          : translit;
      })
      .join("");
  };

  // ⚙️ Генерация логина и пароля на основе ФИО
  React.useEffect(() => {
    if (firstName && lastName && patronymic) {
      const trLastName = transliterate(lastName);
      const trFirstName = transliterate(firstName);
      const trPatronymic = transliterate(patronymic);

      const login =
        trLastName.charAt(0).toUpperCase() +
        trLastName.slice(1).toLowerCase() +
        trFirstName.charAt(0).toUpperCase() +
        trPatronymic.charAt(0).toUpperCase();
      setValue("login", login, { shouldValidate: true });

      const shuffled =
        trFirstName.charAt(0).toLowerCase() +
        trPatronymic.charAt(0).toUpperCase() +
        trLastName.slice(0, 3).toLowerCase();

      const randomDigits = Math.floor(100 + Math.random() * 900);
      const password = `${shuffled}@${randomDigits}`;

      setValue("password", password, { shouldValidate: true });
    }
  }, [firstName, lastName, patronymic, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await createCurator(data);
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Добавить преподавателя</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить нового преподавателя</DialogTitle>
          <DialogDescription>
            Заполните форму для создания нового аккаунта преподавателя.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="last_name">Фамилия</Label>
            <Input
              id="last_name"
              type="text"
              placeholder="Введите фамилию"
              {...register("last_name", {
                required: "Введите фамилию преподавателя",
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
              placeholder="Введите имя"
              {...register("first_name", {
                required: "Введите имя преподавателя",
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
              placeholder="Введите отчество"
              {...register("patronymic", {
                required: "Введите отчество преподавателя",
              })}
            />
            {errors.patronymic && (
              <p className="text-red-500 text-sm">
                {errors.patronymic.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="login">Логин</Label>
            <Input
              id="login"
              type="text"
              placeholder="Автоматически сгенерированный логин"
              {...register("login", {
                required: "Введите логин преподавателя",
              })}
            />
            {errors.login && (
              <p className="text-red-500 text-sm">{errors.login.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="text"
              placeholder="Автоматически сгенерированный пароль"
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
            disabled={!isValid || isCreatingCurator}
          >
            {isCreatingCurator ? <Spinner /> : "Создать преподавателя"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
