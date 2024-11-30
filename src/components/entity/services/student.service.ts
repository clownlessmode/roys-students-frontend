import { baseApi } from "@/components/providers/base-api";
import { UpdateStudentDto } from "../dto/update-student.dto";
import { CreateStudentDto } from "../dto/create-student.dto";

class StudentService {
  static async createStudent(dto: CreateStudentDto) {
    const response = await baseApi.post("/student", dto, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }

  static async getStudents() {
    const response = await baseApi.get("/student", { withCredentials: true });
    return response.data;
  }

  static async getStudentsByCurator() {
    const response = await baseApi.get("/student/bycurator/curator", {
      withCredentials: true,
    });
    return response.data;
  }

  static async getMe() {
    const response = await baseApi.get("/student/me", {
      withCredentials: true,
    });
    return response.data;
  }

  static async getStudentById(id: string) {
    const response = await baseApi.get(`/student/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }

  static async updateStudent(id: string, dto: UpdateStudentDto) {
    const response = await baseApi.patch(`/student/${id}`, dto, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }

  static async deleteStudent(id: string) {
    const response = await baseApi.delete(`/student/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }
}

export default StudentService;
