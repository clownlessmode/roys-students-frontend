import { baseApi } from "@/components/providers/base-api";
import { LoginDto } from "../dto/login.dto";

class AuthService {
  // Метод для логина
  static async login(
    dto: LoginDto
  ): Promise<{ access_token: string; role: string }> {
    const response = await baseApi.post<{ access_token: string; role: string }>(
      `/auth/login`,
      {
        login: dto.login,
        password: dto.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  }
}

export default AuthService;
