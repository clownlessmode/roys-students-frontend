// src/admin/components/XApiForm.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAdminController } from "./entity/controllers/admin.controller";
import Spinner from "./ui/Spinner";

type FormValues = {
  login: string;
  password: string;
  xApiKey: string;
};

export function XApiForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onChange" });

  const { createAdmin, isCreatingAdmin } = useAdminController();

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await createAdmin({
      login: data.login,
      password: data.password,
      key: data.xApiKey,
    });
    reset();
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-10">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Администрирование</CardTitle>
          <CardDescription>
            Введите данные для создания аккаунта администратора
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              {/* Логин */}
              <div className="grid gap-2">
                <Label htmlFor="login">Логин</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Введите логин нового администратора"
                  {...register("login", { required: "Введите логин" })}
                />
                {errors.login && (
                  <p className="text-red-500 text-sm">{errors.login.message}</p>
                )}
              </div>

              {/* Пароль */}
              <div className="grid gap-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль нового администратора"
                  {...register("password", { required: "Введите пароль" })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* API Key */}
              <div className="grid gap-2">
                <Label htmlFor="xApiKey">Ключ супер-администратора</Label>
                <Input
                  id="xApiKey"
                  type="password"
                  placeholder="Введите x-api-key"
                  {...register("xApiKey", { required: "Введите x-api-key" })}
                />
                {errors.xApiKey && (
                  <p className="text-red-500 text-sm">
                    {errors.xApiKey.message}
                  </p>
                )}
              </div>

              {/* Кнопка отправки */}
              <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isCreatingAdmin}
              >
                {isCreatingAdmin ? <Spinner /> : "Создать администратора"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm opacity-80">
        Вы не администратор?{" "}
        <Link href="/login" className="underline">
          Вернуться назад
        </Link>
      </div>
    </div>
  );
}
