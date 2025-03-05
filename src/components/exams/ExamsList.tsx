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
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { AddNewExam } from "./AddNewExam";
import { Exam } from "../entity/types/exam.interface";
import { format } from "date-fns";

interface Props {
  data: Exam[];
  isLoading: boolean;
}

export default function ExamsList({ data, isLoading }: Props) {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    setExams(data || []);
  }, [data]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCredits = exams.filter(
    (exam) =>
      exam.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.curator.first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      exam.curator.last_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      exam.curator.patronymic.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex flex-row items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">Экзамены</h1>
            <p className="text-muted-foreground">
              Управляйте экзаменами в системе.
            </p>
          </div>
          <div className="relative flex items-center">
            <Input
              className="w-[500px]"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1.5 opacity-15" />
          </div>
          <AddNewExam />
        </div>

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
                filteredCredits.map((exams, index) => (
                  <TableRow
                    key={exams.id}
                    className={getExamRowStyle(exams.holding_date)}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{exams.discipline}</TableCell>
                    <TableCell>
                      {format(new Date(exams.holding_date), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>
                      {exams.curator.last_name} {exams.curator.first_name}{" "}
                      {exams.curator.patronymic}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Выставить оценки</DropdownMenuItem>
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
