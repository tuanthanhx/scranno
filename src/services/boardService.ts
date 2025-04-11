import { ApiService } from '@/services/apiService';
import type { ApiResponse, ServerBoard, Board } from '@/types';

export class BoardService extends ApiService {
  async getBoards(): Promise<ApiResponse<ServerBoard[]>> {
    return this.get<ServerBoard[]>('/boards');
  }

  async getBoard(id: string): Promise<ApiResponse<ServerBoard>> {
    return this.get<ServerBoard>(`/boards/${id}`);
  }

  async createBoard(boardData: Partial<Board>): Promise<ApiResponse<Partial<ServerBoard>>> {
    const formData = new FormData();
    formData.append('board', JSON.stringify(boardData));
    if (boardData.screens && boardData.screens.length > 0) {
      boardData.screens.forEach((screen) => {
        if (screen.file) {
          formData.append(`files[${screen.id}]`, screen.file);
        }
      });
    }
    return this.postForm<ServerBoard>('/boards', formData);
  }

  async updateBoard(id: string, boardData: Partial<Board>): Promise<ApiResponse<ServerBoard>> {
    return this.put<ServerBoard>(`/boards/${id}`, boardData);
  }

  async deleteBoard(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/boards/${id}`);
  }
}
