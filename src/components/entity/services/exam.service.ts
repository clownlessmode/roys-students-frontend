import { baseApi } from "@/components/providers/base-api";
import { CreateExamDto } from "../dto/create-exam.dto";
import { ExamEnum } from "../types/exam.interface";

class ExamService {
  static async getExams(type?: ExamEnum | undefined) {
    const response = await baseApi.get(
      type ? `/exams?type=${type}` : "/exams",
      {
        withCredentials: true,
      }
    );
    return response.data;
  }

  static async createExam(dto: CreateExamDto) {
    const response = await baseApi.post("/exams", dto, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }

  static async addLink(id: string, dto: { link: string }) {
    const response = await baseApi.patch(`/exams/${id}/link`, dto, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }
  static async deleteExamen(id: string) {
    const response = await baseApi.delete(`/exams/${id}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }
}

export default ExamService;
