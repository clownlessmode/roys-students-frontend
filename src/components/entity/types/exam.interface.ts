import { Curator } from "./curator.interface";
import { Group } from "./group.interface";

export interface Exam {
  id: string;
  semester: number;
  course: number;
  discipline: string;
  holding_date: string;
  group: Group;
  curator: Curator;
}
