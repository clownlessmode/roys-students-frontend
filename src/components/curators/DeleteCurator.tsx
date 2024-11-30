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
import { useCuratorController } from "../entity/controllers/curator.controller";
import Spinner from "../ui/Spinner";
export default function DeleteCurator({ id }: Props) {
  const { deleteCurator, isDeletingCurator } = useCuratorController();

  const onSubmit = async () => {
    await deleteCurator({ id });
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
            преподавателя с наших серверов.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit} disabled={isDeletingCurator}>
            {isDeletingCurator ? <Spinner /> : "Удалить преподавателя"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
