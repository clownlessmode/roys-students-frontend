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
import { useGroupController } from "../entity/controllers/group.controller";
export default function DeleteGroup({ id }: Props) {
  const { deleteGroup, isDeletingGroup } = useGroupController();

  const onSubmit = async () => {
    await deleteGroup({ id });
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
            группы с наших серверов.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit} disabled={isDeletingGroup}>
            {isDeletingGroup ? <Spinner /> : "Удалить группу"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
