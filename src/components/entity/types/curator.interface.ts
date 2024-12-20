import { DefaultEntity } from "./default.entity";
import { Group } from "./group.interface";

export interface Curator extends DefaultEntity {
  first_name: string;
  last_name: string;
  patronymic: string;
  login: string;
  password: string;
  groups: Group[];
}
