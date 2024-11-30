import { baseApi } from "@/components/providers/base-api";
import { UpdateCuratorDto } from "../dto/update-curator.dto";
import { Curator } from "../types/curator.interface";

interface CreateCuratorDto {
  first_name: string;
  last_name: string;
  patronymic: string;
  login: string;
  password: string;
}

class CuratorService {
  static async createCurator(dto: CreateCuratorDto) {
    const response = await baseApi.post("/curator", dto, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }

  static async getCurators(): Promise<Curator[]> {
    const response = await baseApi.get("/curator", { withCredentials: true });
    return response.data;
  }

  static async getCuratorById(id: string) {
    const response = await baseApi.get(`/curator/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }

  static async updateCurator(id: string, dto: UpdateCuratorDto) {
    const response = await baseApi.patch(`/curator/${id}`, dto, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }

  static async deleteCurator(id: string) {
    const response = await baseApi.delete(`/curator/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }
}

export default CuratorService;
