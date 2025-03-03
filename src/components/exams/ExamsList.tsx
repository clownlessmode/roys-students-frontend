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

export default function ExamsList() {
  const [isLoading] = useState(false);
  const [credits, setCredits] = useState([
    {
      id: 1,
      discipline: "Математический анализ",
      date: "2025-02-20",
      teacher: {
        last_name: "Иванов",
        first_name: "Алексей",
        patronymic: "Петрович",
      },
    },
    {
      id: 2,
      discipline: "Физика",
      date: "2025-02-25",
      teacher: {
        last_name: "Петров",
        first_name: "Дмитрий",
        patronymic: "Сергеевич",
      },
    },
    {
      id: 3,
      discipline: "Программирование",
      date: "2025-03-01",
      teacher: {
        last_name: "Сидоров",
        first_name: "Николай",
        patronymic: "Андреевич",
      },
    },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setCredits(credits || []);
  }, [credits]);

  const filteredCredits = credits.filter(
    (credit) =>
      credit.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      credit.teacher.first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      credit.teacher.last_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      credit.teacher.patronymic
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof credits)[0] | null;
    direction: "asc" | "desc" | string;
  }>({
    key: null,
    direction: "asc",
  });

  const handleSort = (key: keyof (typeof credits)[0]) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...credits].sort((a, b) => {
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

    setCredits(sortedData);
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
                <TableHead onClick={() => handleSort("date")}>Дата</TableHead>
                <TableHead onClick={() => handleSort("teacher")}>
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
                filteredCredits.map((credit, index) => (
                  <TableRow key={credit.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{credit.discipline}</TableCell>
                    <TableCell>{credit.date}</TableCell>
                    <TableCell>
                      {credit.teacher.last_name} {credit.teacher.first_name}{" "}
                      {credit.teacher.patronymic}
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
