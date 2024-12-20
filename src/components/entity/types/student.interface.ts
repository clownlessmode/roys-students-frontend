import { DefaultEntity } from "./default.entity";
import { Group } from "./group.interface";
import { Telegram } from "./telegram.interface";

export interface Student extends DefaultEntity {
  login: string;
  password?: string | null;
  first_name: string;
  last_name: string;
  patronymic: string;
  group: Group;
  telegram?: Telegram;
  gender?: Gender | null; // Пол студента (мужской/женский), может быть пустым
  birthdate?: Date | null; // Дата рождения, опционально
  snils?: string | null; // СНИЛС студента, опционально
  passport?: string | null; // Паспортные данные студента, опционально
}

export enum Gender {
  MALE = "муж.",
  FEMALE = "жен.",
}
