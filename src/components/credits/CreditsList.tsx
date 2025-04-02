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
import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Exam } from "../entity/types/exam.interface";
import { format } from "date-fns";
import { AddMark } from "../exams/AddMark";
import Link from "next/link";
import { AddNewCredit } from "./AddNewCredit";
import DeleteExam from "../exams/DeleteExam";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { AddLinkExam } from "../exams/AddLinkExam";
import { Badge } from "../ui/badge";

interface Props {
  data: Exam[];
  isLoading: boolean;
}

export default function CreditsList({ data, isLoading }: Props) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("Все");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  useEffect(() => {
    setExams(data || []);
  }, [data]);

  const groups = useMemo(() => {
    const uniqueGroups = Array.from(
      new Set((data || []).map((exam) => exam.group.name))
    );
    return ["Все", ...uniqueGroups];
  }, [data]);

  const filteredCredits = exams.filter((exam) => {
    const matchesGroup =
      selectedGroup === "Все" || exam.group.name === selectedGroup;

    const matchesSearch =
      exam.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.curator.first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      exam.curator.last_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      exam.curator.patronymic.toLowerCase().includes(searchQuery.toLowerCase());

    const examDate = new Date(exam.holding_date);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;

    // Убираем время, сравниваем только даты
    const normalizeDate = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const isAfterFromDate =
      !fromDate || normalizeDate(examDate) >= normalizeDate(fromDate);
    const isBeforeToDate =
      !toDate || normalizeDate(examDate) <= normalizeDate(toDate);

    return matchesSearch && matchesGroup && isAfterFromDate && isBeforeToDate;
  });

  return (
    <div className="w-full p-6 bg-background">
      <div className="space-y-4">
        <div className="flex flex-row items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">Зачеты</h1>
            <p className="text-muted-foreground">
              Управляйте зачетами в системе.
            </p>
          </div>
          <div className="flex space-x-2">
            <Input
              className="w-[300px]"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Input
              className="w-[150px]"
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              placeholder="От"
            />
            <Input
              className="w-[150px]"
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              placeholder="До"
            />
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
          </div>
          <AddNewCredit />
        </div>

        <div className="border rounded-lg">
          <Table className="rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Дисциплина</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Преподаватель</TableHead>
                <TableHead>Группа</TableHead>
                <TableHead>Ссылка на билеты</TableHead>
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
                  <TableRow key={exam.id}>
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
                            <Link href={`/admin/exams/${exam.id}`}>
                              <Button variant="link">Просмотр оценок</Button>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <AddLinkExam examId={exam.id} />
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
                    colSpan={5}
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
