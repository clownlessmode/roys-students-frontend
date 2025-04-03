import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  const requestedPath = req.nextUrl.pathname;
  console.log("ROLE", role);
  console.log("PATH", requestedPath);
  // Исключаем маршруты, которые не требуют проверки
  const publicRoutes = ["/login", "/api/auth", "/"]; // Добавьте другие маршруты, если нужно
  if (publicRoutes.some((route) => requestedPath.startsWith(route))) {
    return NextResponse.next();
  }

  // Маршруты, разрешённые для каждой роли
  const routesForRoles: Record<string, (string | RegExp)[]> = {
    student: ["/student", "/common"],
    curator: ["/curator", "/common", /^\/curator\/.*/],
    admin: ["/admin", "/curator", "/student", "/common", /^\/admin\/.*/],
  };

  // Если роль отсутствует, отправляем на /login
  if (!role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Проверяем доступ к маршруту для роли
  const allowedRoutes = routesForRoles[role] || [];
  const isAllowed = allowedRoutes.some((route) =>
    typeof route === "string"
      ? requestedPath.startsWith(route)
      : route.test(requestedPath)
  );

  // Если маршрут не разрешён, перенаправляем на /login
  if (!isAllowed) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Если маршрут разрешён, продолжаем обработку
  return NextResponse.next();
}

// Указываем пути, на которые мидлвар будет распространяться
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)", // Применяем мидлвар для всех страниц, кроме исключений
};
