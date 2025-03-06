import { ExamEnum } from "../types/exam.interface";

export interface CreateExamDto {
  type: ExamEnum;
  group_id: string;
  semester: number;
  course: number;
  discipline: string;
  curator_id: string;
  holding_date: Date;
}
