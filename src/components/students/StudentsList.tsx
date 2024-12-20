"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { UpdateStudent } from "./UpdateStudent";
import { AddNewStudent } from "./AddNewStudent";
import DeleteStudent from "./DeleteStudent";
import { Student } from "../entity/types/student.interface";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import ExportToExcel from "./ExportToExcel";

interface Props {
  data: Student[];
  isLoading: boolean;
}

export default function StudentsList({ data, isLoading }: Props) {
  const [students, setStudents] = useState<Student[]>([]); // Изначально пустой массив
  const [searchQuery, setSearchQuery] = useState<string>(""); // Состояние для поиска

  useEffect(() => {
    setStudents(data || []); // Обновление состояния при изменении data
  }, [data]);

  // Фильтрация студентов по запросу поиска
  const filteredStudents = students.filter(
    (student) =>
      student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.login.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof data)[0] | null;
    direction: "asc" | "desc" | string;
  }>({
    key: null, // Поле для сортировки, изначально null
    direction: "asc", // Направление сортировки
  });

  const handleSort = (key: keyof (typeof data)[0]) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredStudents].sort((a, b) => {
      const aValue = a[key] ?? ""; // Если значение null или undefined, используйте пустую строку
      const bValue = b[key] ?? "";

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setStudents(sortedData);
  };

  return (
    <div className="w-full p-6 bg-background">
      <div className="space-y-4">
        <div className="flex flex-row items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">Список студентов</h1>
            <p className="text-muted-foreground">
              Управляйте всеми студентами в системе.
            </p>
          </div>
          <div className="relative flex items-center">
            <Input
              className="w-[500px]"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Обновление состояния поиска
            />
            <Search className="absolute right-4 top-1.5 opacity-15" />
          </div>
          <div className="flex flex-row gap-2 ml-2">
            <ExportToExcel data={data} fileName="Список студентов" />
            <AddNewStudent />
          </div>
        </div>

        <div className="border rounded-lg">
          <Table className="rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead onClick={() => handleSort("group")}>
                  Группа
                </TableHead>
                <TableHead>Cтатус</TableHead>
                <TableHead onClick={() => handleSort("last_name")}>
                  Фамилия
                </TableHead>
                <TableHead onClick={() => handleSort("first_name")}>
                  Имя
                </TableHead>
                <TableHead onClick={() => handleSort("patronymic")}>
                  Отчество
                </TableHead>
                <TableHead onClick={() => handleSort("snils")}>СНИЛС</TableHead>
                <TableHead onClick={() => handleSort("passport")}>
                  Пасспорт (cерия)
                </TableHead>
                <TableHead onClick={() => handleSort("passport")}>
                  Пасспорт (номер)
                </TableHead>
                <TableHead onClick={() => handleSort("gender")}>Пол</TableHead>
                <TableHead onClick={() => handleSort("birthdate")}>
                  Дата рождения
                </TableHead>

                <TableHead onClick={() => handleSort("login")}>Логин</TableHead>
                <TableHead onClick={() => handleSort("password")}>
                  Пароль
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(13)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      {Array(12)
                        .fill(0)
                        .map((_, index) => {
                          return (
                            <TableCell key={index}>
                              <Skeleton
                                className={`${
                                  index !== 13 ? "h-[18px]" : "h-[32px]"
                                }`}
                              />
                            </TableCell>
                          );
                        })}
                    </TableRow>
                  ))
              ) : filteredStudents && filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.group.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={student.password ? "default" : "destructive"}
                      >
                        {student.password
                          ? "Зарегистрирован"
                          : "Нет зарегистрирован"}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.last_name}</TableCell>
                    <TableCell>{student.first_name}</TableCell>
                    <TableCell>{student.patronymic}</TableCell>
                    <TableCell>
                      {student.snils ? student.snils : "Нет данных"}
                    </TableCell>
                    <TableCell>
                      {student.passport
                        ? student.passport.slice(0, 4)
                        : "Нет данных"}
                    </TableCell>
                    <TableCell>
                      {student.passport
                        ? student.passport.slice(5)
                        : "Нет данных"}
                    </TableCell>
                    <TableCell>
                      {student.gender ? student.gender : "Нет данных"}
                    </TableCell>
                    <TableCell>
                      {student.birthdate
                        ? `${format(new Date(student.birthdate), "PPP", {
                            locale: ru,
                          })}`
                        : "Нет данных"}
                    </TableCell>
                    <TableCell>{student.login}</TableCell>
                    <TableCell>
                      {student.password ? student.password : "Нет пароля"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <UpdateStudent student={student} id={student.id} />
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <DeleteStudent id={student.id} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center font-semibold py-4"
                  >
                    Данные не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
