import { baseApi } from "@/components/providers/base-api";
import { UpdateGroupDto } from "../dto/update-group.dto";
import { Group } from "../types/group.interface";
import { CreateGroupDto } from "../dto/create-group.dto";

class GroupService {
  static async createGroup(dto: CreateGroupDto) {
    const response = await baseApi.post("/group", dto, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }

  static async getGroups(): Promise<Group[]> {
    const response = await baseApi.get("/group", { withCredentials: true });
    return response.data;
  }

  static async getGroupById(id: string) {
    const response = await baseApi.get(`/group/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }

  static async updateGroup(id: string, dto: UpdateGroupDto) {
    const response = await baseApi.patch(`/group/${id}`, dto, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }

  static async findGroupsByCurator(id: string, dto: UpdateGroupDto) {
    const response = await baseApi.patch(`/group/by/${id}`, dto, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }

  static async deleteGroup(id: string) {
    const response = await baseApi.delete(`/group/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }
}

export default GroupService;
