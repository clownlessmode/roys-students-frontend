import { DefaultEntity } from "./default.entity";

export interface Curator extends DefaultEntity {
  first_name: string;
  last_name: string;
  patronymic: string;
  login: string;
  password: string;
}
