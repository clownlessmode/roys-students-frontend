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
import { AddNewCurator } from "./AddNewCurator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { UpdateCurator } from "./UpdateCurator";
import DeleteCurator from "./DeleteCurator";
import { Curator } from "../entity/types/curator.interface";
import { Input } from "../ui/input";

interface Props {
  data: Curator[];
  isLoading: boolean;
}

export default function CuratorsList({ data, isLoading }: Props) {
  const [curators, setCurators] = useState<Curator[]>([]); // Изначально пустой массив
  const [searchQuery, setSearchQuery] = useState<string>(""); // Состояние для поиска

  useEffect(() => {
    setCurators(data || []); // Обновление состояния при изменении data
  }, [data]);

  // Фильтрация студентов по запросу поиска
  const filteredCurators = curators.filter(
    (curator) =>
      curator.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curator.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curator.login.toLowerCase().includes(searchQuery.toLowerCase())
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

    const sortedData = [...curators].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setCurators(sortedData);
  };

  return (
    <div className="w-full p-6 bg-background">
      <div className="space-y-4">
        <div className="flex flex-row items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">Список преподавателей</h1>
            <p className="text-muted-foreground">
              Управляйте всеми преподавателями в системе.
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
          <AddNewCurator />
        </div>

        <div className="border rounded-lg">
          <Table className="rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead onClick={() => handleSort("first_name")}>
                  Имя
                </TableHead>
                <TableHead onClick={() => handleSort("last_name")}>
                  Фамилия
                </TableHead>
                <TableHead onClick={() => handleSort("patronymic")}>
                  Отчество
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
                Array(7)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      {Array(7)
                        .fill(0)
                        .map((_, index) => {
                          return (
                            <TableCell key={index}>
                              <Skeleton
                                className={`${
                                  index !== 6 ? "h-[18px]" : "h-[32px]"
                                }`}
                              />
                            </TableCell>
                          );
                        })}
                    </TableRow>
                  ))
              ) : filteredCurators && filteredCurators.length > 0 ? (
                filteredCurators.map((curator, index) => (
                  <TableRow key={curator.id}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>{curator.first_name}</TableCell>
                    <TableCell>{curator.last_name}</TableCell>
                    <TableCell>{curator.patronymic}</TableCell>
                    <TableCell>{curator.login}</TableCell>
                    <TableCell>{curator.password}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <UpdateCurator curator={curator} id={curator.id} />
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <DeleteCurator id={curator.id} />
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
