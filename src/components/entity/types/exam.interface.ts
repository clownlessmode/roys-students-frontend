import { Curator } from "./curator.interface";
import { Group } from "./group.interface";

export enum ExamEnum {
  Exam = "Exam",
  Credit = "Credit",
}

export interface Exam {
  id: string;
  type: ExamEnum;
  semester: number;
  course: number;
  discipline: string;
  holding_date: string;
  group: Group;
  curator: Curator;
  link: string | null;
}
