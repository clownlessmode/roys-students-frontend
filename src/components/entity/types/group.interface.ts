import { Curator } from "./curator.interface";
import { DefaultEntity } from "./default.entity";
import { Student } from "./student.interface";

export interface Group extends DefaultEntity {
  name: string;
  curator: Curator;
  students: Student[];
}
