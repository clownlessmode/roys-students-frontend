"use client";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useStudentController } from "../entity/controllers/student.controller";
import { useMarkController } from "../entity/controllers/mark.controller";
import Spinner from "../ui/Spinner";
import { Student } from "../entity/types/student.interface";

interface Props {
  groupId: string;
  examId: string;
}

export function AddMark({ groupId, examId }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { useStudentsByGroupId } = useStudentController();
  const { data: students } = useStudentsByGroupId(groupId);
  const { createMark, isCreatingMark } = useMarkController();

  const [marks, setMarks] = React.useState<Record<string, string>>({});

  const handleMarkChange = (studentId: string, value: string) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSubmit = async () => {
    const entries = Object.entries(marks);

    for (const [studentId, mark] of entries) {
      if (mark) {
        await createMark({
          studentId,
          mark,
          examId,
        });
      }
    }

    setMarks({});
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          Выставить оценки
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Выставление оценок</DialogTitle>
          <DialogDescription>
            Выберите оценки для студентов и сохраните одним кликом.
          </DialogDescription>
        </DialogHeader>

        {students?.data ? (
          <div className="max-h-[400px] overflow-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ФИО</TableHead>
                  <TableHead className="w-[150px]">Оценка</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.data.map((student: Student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      {student.last_name} {student.first_name}{" "}
                      {student.patronymic}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={marks[student.id] || ""}
                        onValueChange={(value) =>
                          handleMarkChange(student.id, value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выбрать" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Н/А", "2", "3", "4", "5"].map((mark) => (
                            <SelectItem key={mark} value={mark}>
                              {mark}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isCreatingMark || Object.keys(marks).length === 0}
          className="w-full mt-4"
        >
          {isCreatingMark ? <Spinner /> : "Сохранить оценки"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
