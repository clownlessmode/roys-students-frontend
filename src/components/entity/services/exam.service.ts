import { baseApi } from "@/components/providers/base-api";
import { CreateExamDto } from "../dto/create-exam.dto";

class ExamService {
  static async getExams() {
    const response = await baseApi.get("/exams", { withCredentials: true });
    return response.data;
  }

  static async createExam(dto: CreateExamDto) {
    const response = await baseApi.post("/exams", dto, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }
}

export default ExamService;
