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
import { AddNewGroup } from "./AddNewGroup";
import DeleteGroup from "./DeleteGroup";
import { Group } from "../entity/types/group.interface";
import { UpdateGroup } from "./UpdateGroup";
import { Input } from "../ui/input";

interface Props {
  data: Group[];
  isLoading: boolean;
}

export default function GroupsList({ data, isLoading }: Props) {
  const [groups, setGroups] = useState<Group[]>([]); // Изначально пустой массив
  const [searchQuery, setSearchQuery] = useState<string>(""); // Состояние для поиска

  useEffect(() => {
    setGroups(data || []); // Обновление состояния при изменении data
  }, [data]);

  // Фильтрация студентов по запросу поиска
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.curator.first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      group.curator.last_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      group.curator.patronymic.toLowerCase().includes(searchQuery.toLowerCase())
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

    const sortedData = [...groups].sort((a, b) => {
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

    setGroups(sortedData);
  };

  return (
    <div className="w-full p-6 bg-background">
      <div className="space-y-4">
        <div className="flex flex-row items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">Список групп</h1>
            <p className="text-muted-foreground">
              Управляйте всеми группами в системе.
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
          <AddNewGroup />
        </div>

        <div className="border rounded-lg">
          <Table className="rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead onClick={() => handleSort("name")}>
                  Название
                </TableHead>
                <TableHead onClick={() => handleSort("curator")}>
                  Преподаватель
                </TableHead>
                <TableHead onClick={() => handleSort("students")}>
                  Кол-во студентов
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
              ) : filteredGroups && filteredGroups.length > 0 ? (
                filteredGroups.map((group, index) => (
                  <TableRow key={group.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>
                      {group.curator.last_name} {group.curator.first_name}{" "}
                      {group.curator.patronymic}
                    </TableCell>
                    <TableCell>
                      {group.students ? group.students.length : 0}
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
                            <UpdateGroup group={group} id={group.id} />
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <DeleteGroup id={group.id} />
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
