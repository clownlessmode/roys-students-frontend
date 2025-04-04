import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { Input } from "../ui/input";
import { format } from "date-fns";
import { Mark } from "../entity/types/mark.interface";
import * as XLSX from "xlsx";
import { Button } from "../ui/button";

interface Props {
  data: Mark[];
  isLoading: boolean;
}

export default function MarkList({ data, isLoading }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const getNestedValue = (
    obj: Mark | null | undefined,
    path: string
  ): unknown => {
    return path.split(".").reduce<unknown>((acc, part) => {
      if (acc === null || acc === undefined) return undefined;
      if (typeof acc === "object" && acc !== null && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  };

  const sortedMarks = [...(data || [])].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = getNestedValue(a, sortConfig.key) || "";
    const bValue = getNestedValue(b, sortConfig.key) || "";

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredMarks = sortedMarks.filter((mark) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (mark.exam?.discipline?.toLowerCase() || "").includes(searchLower) ||
      `${mark.student?.last_name || ""} ${mark.student?.first_name || ""} ${
        mark.student?.patronymic || ""
      }`
        .toLowerCase()
        .includes(searchLower)
    );
  });

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getDisciplineName = () => {
    if (!data || data.length === 0) return "Неизвестная дисциплина";
    return data[0]?.exam?.discipline || "Неизвестная дисциплина";
  };

  const getComponentType = (): string => {
    if (!data || data.length === 0) return "экзамен";
    const examType = data[0]?.exam?.type;
    return examType === "Credit" ? "зачёт" : "экзамен";
  };
  const handleExportToExcel = () => {
    const exportData = filteredMarks.map((mark, index) => ({
      "#": index + 1,
      Дисциплина: mark.exam?.discipline || "",
      "Дата экзамена": mark.exam?.holding_date
        ? format(new Date(mark.exam.holding_date), "dd.MM.yyyy")
        : "",
      Студент: `${mark.student?.last_name || ""} ${
        mark.student?.first_name || ""
      } ${mark.student?.patronymic || ""}`,
      Оценка: mark.mark ?? "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Стили для заголовков
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1E40AF" } }, // Indigo-900
      alignment: { horizontal: "center" },
    };

    // Применение стилей к заголовкам
    const range = XLSX.utils.decode_range(worksheet["!ref"]!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cell_address]) continue;
      worksheet[cell_address].s = headerStyle;
    }

    // Ширина колонок
    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 25 },
      { wch: 20 },
      { wch: 35 },
      { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Оценки");

    XLSX.writeFile(workbook, `Оценки_${getDisciplineName()}.xlsx`);
  };
  return (
    <div className="w-full p-6 bg-background">
      <div className="space-y-4">
        <div className="flex flex-row items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Оценки за {getComponentType()}
            </h1>
            {data && data.length > 0 && (
              <p className="text-muted-foreground">
                Просмотр оценок за {getComponentType()} по дисциплине{" "}
                {getDisciplineName()}.
              </p>
            )}
          </div>
          <div className="relative flex items-center">
            <Input
              className="w-[500px]"
              placeholder="Поиск по студентам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1.5 opacity-15" />
            <Button variant="outline" onClick={handleExportToExcel}>
              Экспорт в Excel
            </Button>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table className="rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead onClick={() => handleSort("exam.discipline")}>
                  Дисциплина
                </TableHead>
                <TableHead onClick={() => handleSort("exam.holding_date")}>
                  Дата экзамена
                </TableHead>
                <TableHead onClick={() => handleSort("student.last_name")}>
                  Студент
                </TableHead>
                <TableHead onClick={() => handleSort("mark")}>Оценка</TableHead>
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
                        .map((_, idx) => (
                          <TableCell key={idx}>
                            <Skeleton
                              className={idx !== 4 ? "h-[18px]" : "h-[32px]"}
                            />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              ) : filteredMarks.length > 0 ? (
                filteredMarks.map((mark, index) => (
                  <TableRow key={mark.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{mark.exam?.discipline || "—"}</TableCell>
                    <TableCell>
                      {mark.exam?.holding_date
                        ? format(new Date(mark.exam.holding_date), "dd.MM.yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {[
                        mark.student?.last_name,
                        mark.student?.first_name,
                        mark.student?.patronymic,
                      ]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </TableCell>
                    <TableCell>{mark.mark ?? "—"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center font-semibold py-4"
                  >
                    Оценки не выставлены
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
