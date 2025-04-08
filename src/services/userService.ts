import { ApiService } from '@/services/apiService';
import type { ApiResponse, User } from '@/types';

export class UserService extends ApiService {
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>('/users');
  }

  async getUser(id: number): Promise<ApiResponse<User>> {
    return this.get<User>(`/users/${id}`);
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.post<User>('/users', userData);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<User>(`/users/${id}`, userData);
  }

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    return this.delete<null>(`/users/${id}`);
  }
}
