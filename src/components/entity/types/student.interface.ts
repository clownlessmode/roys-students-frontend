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
}
