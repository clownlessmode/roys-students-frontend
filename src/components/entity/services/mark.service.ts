import { baseApi } from "@/components/providers/base-api";
import { CreateMarkDto } from "../dto/create-mark.dto";

class MarkService {
  static async create(dto: CreateMarkDto) {
    const response = await baseApi.post("/mark", dto, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }
}

export default MarkService;
