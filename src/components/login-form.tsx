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
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthController } from "./entity/controllers/auth.controller";
import Spinner from "./ui/Spinner";

type FormValues = {
  login: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onChange" });

  const { login, isLoggingIn } = useAuthController();

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const res = await login({
      login: data.login,
      password: data.password,
    });
    console.log(res);
    localStorage.setItem("access_token", res.access_token);
    localStorage.setItem("login", data.login);
    localStorage.setItem("role", res.role);
    document.cookie = `role=${res.role}; path=/; secure; samesite=lax`;

    const prefix = res.role === "admin" ? "/curators" : "";
    console.log(prefix);

    router.push(`/${res.role}${prefix}`);
    console.log('pushed');

    reset();
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const login = params.get("login") || "";
    const password = params.get("password") || "";

    if (login) setValue("login", login);
    if (password) setValue("password", password);

    // Automatically trigger validation and submit if valid
    if (login && password) {
      trigger().then((isValid) => {
        if (isValid) {
          handleSubmit(onSubmit)();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, trigger]);

  return (
    <div className="flex flex-col justify-between h-screen py-10">
      <div className="not-sr-only" />
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Авторизация</CardTitle>
          <CardDescription>
            Введите свои данные для входа в аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="login">Логин</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Введите логин"
                  {...register("login", { required: "Введите логин" })}
                />
                {errors.login && (
                  <p className="text-red-500 text-sm">{errors.login.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Пароль</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  {...register("password", { required: "Введите пароль" })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isLoggingIn}
              >
                {isLoggingIn ? <Spinner /> : "Войти"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Нет аккаунта?{" "}
              <Link href="https://t.me/roystudentsbot" className="underline">
                Создать
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm opacity-20">
        Вы администратор?{" "}
        <Link href="/login/x-api" className="underline">
          Войти в панель
        </Link>
      </div>
    </div>
  );
}
