import React from "react";
interface Props {
  id: string;
}
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import Spinner from "../ui/Spinner";
import { useStudentController } from "../entity/controllers/student.controller";
export default function DeleteStudent({ id }: Props) {
  const { deleteStudent, isDeletingStudent } = useStudentController();

  const onSubmit = async () => {
    await deleteStudent({ id });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          Удалить
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие не может быть отменено. Это навсегда удалит запись
            студента с наших серверов.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit} disabled={isDeletingStudent}>
            {isDeletingStudent ? <Spinner /> : "Удалить студента"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
