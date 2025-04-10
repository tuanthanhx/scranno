import { ApiService } from '@/services/apiService';
import type { ApiResponse, Board } from '@/types';

export class BoardService extends ApiService {
  async getBoards(): Promise<ApiResponse<Board[]>> {
    return this.get<Board[]>('/api/v1/boards');
  }

  async getBoard(id: string): Promise<ApiResponse<Board>> {
    return this.get<Board>(`/api/v1/boards/${id}`);
  }

  async createBoard(boardData: Partial<Board>): Promise<ApiResponse<Partial<Board>>> {
    const formData = new FormData();
    formData.append('board', JSON.stringify(boardData));
    if (boardData.screens && boardData.screens.length > 0) {
      boardData.screens.forEach((screen) => {
        if (screen.file) {
          formData.append(`files[${screen.id}]`, screen.file);
        }
      });
    }
    return this.postForm<Board>('/api/v1/boards', formData);
  }

  async updateBoard(id: string, boardData: Partial<Board>): Promise<ApiResponse<Board>> {
    return this.put<Board>(`/api/v1/boards/${id}`, boardData);
  }

  async deleteBoard(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/api/v1/boards/${id}`);
  }
}
