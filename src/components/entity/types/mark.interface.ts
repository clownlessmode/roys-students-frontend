import { Exam } from "./exam.interface";
import { Student } from "./student.interface";

export interface Mark {
  id: string;
  mark: number;
  exam: Exam;
  student: Student;
}
