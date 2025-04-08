import { ApiService } from '@/services/apiService';
import type { ApiResponse, Product } from '@/types';

export class ProductService extends ApiService {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    return this.get<Product[]>('/products');
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return this.get<Product>(`/products/${id}`);
  }

  async createProduct(productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.post<Product>('/products', productData);
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.put<Product>(`/products/${id}`, productData);
  }

  async deleteProduct(id: number): Promise<ApiResponse<null>> {
    return this.delete<null>(`/products/${id}`);
  }
}
