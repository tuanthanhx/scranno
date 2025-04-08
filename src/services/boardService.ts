import { ApiService } from '@/services/apiService';
import { delay } from '@/utils/utils';
import type { ApiResponse, Board } from '@/types';

export class BoardService extends ApiService {
  async getBoards(): Promise<ApiResponse<Board[]>> {
    return this.get<Board[]>('/boards');
  }

  async getBoard(id: string): Promise<ApiResponse<Board>> {
    // return this.get<Board>(`/boards/${id}`);
    const mockData: Board = {
      id,
      name: 'Shop 3000',
      screens: [
        {
          id: 'screen_001',
          title: 'Home Page',
          index: 0,
          imageUrl: 'https://placehold.co/1920x1080',
          width: 1920,
          height: 1080,
          addingRectangle: false,
          status: 'active',
          selections: [
            {
              id: 'sel_001',
              number: 1,
              x: 100,
              y: 50,
              width: 300,
              height: 200,
              msg: 'Center the "Submit" button in the login form. It’s off to the left now.',
              reactions: ['👍', '👀'],
              color: '#FF0000',
            },
            {
              id: 'sel_002',
              number: 2,
              x: 500,
              y: 400,
              width: 250,
              height: 150,
              msg: 'Fix the product description text. It cuts off after 2 lines.',
              reactions: ['❤️', '✨'],
              color: '#00FF00',
            },
            {
              id: 'sel_003',
              number: 3,
              x: 1000,
              y: 500,
              width: 100,
              height: 100,
              msg: 'Make the "Add to Cart" button work. It doesn’t respond when clicked',
              color: '#0000FF',
            },
          ],
        },
        {
          id: 'screen_002',
          title: 'Product Page',
          index: 1,
          imageUrl: 'https://placehold.co/1920x1080',
          width: 1920,
          height: 1080,
          addingRectangle: false,
          status: 'active',
          selections: [
            {
              id: 'sel_004',
              number: 1,
              x: 100,
              y: 50,
              width: 300,
              height: 200,
              msg: 'Adjust the mobile layout. The navigation menu overlaps the content below 768px.',
              reactions: ['👍', '👀'],
              color: '#FF0000',
            },
            {
              id: 'sel_005',
              number: 2,
              x: 500,
              y: 400,
              width: 250,
              height: 150,
              msg: 'Change the "Forgot Password" link color to blue (#007BFF) to match other links.',
              reactions: ['❤️', '✨'],
              color: '#00FF00',
            },
            {
              id: 'sel_006',
              number: 3,
              x: 1000,
              y: 500,
              width: 100,
              height: 100,
              msg: 'Optimize carousel images on the homepage. They take over 3 seconds to load.',
              color: '#0000FF',
            },
          ],
        },
      ],
    };

    await delay(1000);

    return Promise.resolve({
      data: mockData,
      status: 200,
      message: 'success',
    });
  }

  async createBoard(boardData: Partial<Board>): Promise<ApiResponse<Board>> {
    return this.post<Board>('/boards', boardData);
  }

  async updateBoard(id: string, boardData: Partial<Board>): Promise<ApiResponse<Board>> {
    return this.put<Board>(`/boards/${id}`, boardData);
  }

  async deleteBoard(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/boards/${id}`);
  }
}
