import { baseApi } from "@/components/providers/base-api";
import { CreateMarkDto } from "../dto/create-mark.dto";

class MarkService {
  static async getMarkByExamId(examId: string) {
    const response = await baseApi.get(`/mark/exam/${examId}`, {
      withCredentials: true,
    });
    return response.data;
  }

  static async create(dto: CreateMarkDto) {
    const response = await baseApi.post("/mark", dto, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }
}

export default MarkService;
