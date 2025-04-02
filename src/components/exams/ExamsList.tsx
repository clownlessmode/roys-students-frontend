"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Search } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { AddNewExam } from "./AddNewExam";
import { Exam } from "../entity/types/exam.interface";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { AddMark } from "./AddMark";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AddLinkExam } from "./AddLinkExam";
import { Badge } from "../ui/badge";
import DeleteExam from "./DeleteExam";

interface Props {
  data: Exam[];
  isLoading: boolean;
}

export default function ExamsList({ data, isLoading }: Props) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("Все");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    setExams(data || []);
  }, [data]);

  // Получаем список уникальных групп
  const groups = useMemo(() => {
    const uniqueGroups = Array.from(
      new Set((data || []).map((exam) => exam.group.name))
    );
    return ["Все", ...uniqueGroups];
  }, [data]);

  // Фильтрация по поиску, группе и датам
  const filteredCredits = exams.filter((exam) => {
    const matchesSearch =
      exam.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.curator.first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      exam.curator.last_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      exam.curator.patronymic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGroup =
      selectedGroup === "Все" || exam.group.name === selectedGroup;

    const examDate = parseISO(exam.holding_date);

    const matchesStartDate = startDate
      ? isAfter(examDate, parseISO(startDate)) ||
        examDate.toDateString() === parseISO(startDate).toDateString()
      : true;

    const matchesEndDate = endDate
      ? isBefore(examDate, parseISO(endDate)) ||
        examDate.toDateString() === parseISO(endDate).toDateString()
      : true;

    return matchesSearch && matchesGroup && matchesStartDate && matchesEndDate;
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof exams)[0] | null;
    direction: "asc" | "desc" | string;
  }>({
    key: null,
    direction: "asc",
  });

  const handleSort = (key: keyof (typeof exams)[0]) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...exams].sort((a, b) => {
      const aValue = a[key] ?? "";
      const bValue = b[key] ?? "";

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setExams(sortedData);
  };

  const getExamRowStyle = (examDate: string) => {
    const today = new Date();
    const examDateTime = new Date(examDate);
    const diffDays = Math.ceil(
      (examDateTime.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 3 && diffDays > 0) {
      return "bg-green-900 hover:bg-green-800";
    } else if (diffDays < 0) {
      return "bg-red-900 hover:bg-red-800";
    }
    return "";
  };

  return (
    <div className="w-full p-6 bg-background">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Экзамены</h1>
            <p className="text-muted-foreground">
              Управляйте экзаменами в системе.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Левая часть: Поиск + Группа + Даты */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Поиск */}
              <div className="relative">
                <Input
                  className="w-[200px] md:w-[250px]"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-2 top-2 h-4 w-4 text-muted-foreground" />
              </div>

              {/* Группа */}
              <Select
                value={selectedGroup}
                onValueChange={(value) => setSelectedGroup(value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Группа" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Дата от */}
              <Input
                type="date"
                className="h-9 w-[140px]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Дата от"
              />

              {/* Дата до */}
              <Input
                type="date"
                className="h-9 w-[140px]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Дата до"
              />
            </div>

            {/* Правая часть: кнопка Добавить экзамен */}
            <div>
              <AddNewExam />
            </div>
          </div>
        </div>

        {/* Таблица */}
        <div className="border rounded-lg">
          <Table className="rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead onClick={() => handleSort("discipline")}>
                  Дисциплина
                </TableHead>
                <TableHead onClick={() => handleSort("holding_date")}>
                  Дата
                </TableHead>
                <TableHead onClick={() => handleSort("curator")}>
                  Преподаватель
                </TableHead>
                <TableHead onClick={() => handleSort("group")}>
                  Группа
                </TableHead>
                <TableHead onClick={() => handleSort("link")}>
                  Ссылка на билеты
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      {Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <TableCell key={index}>
                            <Skeleton
                              className={index !== 4 ? "h-[18px]" : "h-[32px]"}
                            />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              ) : filteredCredits.length > 0 ? (
                filteredCredits.map((exam, index) => (
                  <TableRow
                    key={exam.id}
                    className={getExamRowStyle(exam.holding_date)}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{exam.discipline}</TableCell>
                    <TableCell>
                      {format(new Date(exam.holding_date), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>
                      {exam.curator.last_name} {exam.curator.first_name}{" "}
                      {exam.curator.patronymic}
                    </TableCell>
                    <TableCell>{exam.group.name}</TableCell>
                    <TableCell>
                      {exam.link === null ? (
                        <Badge>Билеты не прикреплены</Badge>
                      ) : (
                        <Link href={exam.link} target="_blank">
                          <Badge>Ссылка на билеты</Badge>
                        </Link>
                      )}
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
                            <AddMark groupId={exam.group.id} examId={exam.id} />
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <AddLinkExam examId={exam.id} />
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/exams/${exam.id}`}>
                              <Button
                                variant="ghost"
                                className="text-center rounded-full w-full"
                              >
                                Просмотр оценок
                              </Button>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <DeleteExam id={exam.id} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center font-semibold py-4"
                  >
                    Экзамены не найдены
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
