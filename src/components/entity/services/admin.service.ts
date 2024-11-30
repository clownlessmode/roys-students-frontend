// src/admin/services/admin.service.ts
import { baseApi } from "@/components/providers/base-api";
import { DefaultEntity } from "../types/default.entity";
import { CreateAdminDto } from "../dto/create-admin.dto";

class AdminService {
  // Метод для создания администратора
  static async createAdmin(dto: CreateAdminDto): Promise<DefaultEntity> {
    const response = await baseApi.post<DefaultEntity>(
      `/admin`, // Изменено с `/admin/create` на `/admin`
      { login: dto.login, password: dto.password },
      {
        headers: {
          "X-API-Key": dto.key,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  }
}

export default AdminService;
