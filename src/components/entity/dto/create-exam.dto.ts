export interface CreateExamDto {
  group_id: string;
  semester: number;
  course: number;
  discipline: string;
  curator_id: string;
  holding_date: Date;
}
