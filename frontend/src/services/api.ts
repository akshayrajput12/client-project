import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  User,
  LoginRequest,
  LoginResponse,
  CartItem,
  AddToCartRequest,
  UpdateCartRequest
} from '../types/Product';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || `HTTP error! status: ${response.status}`);

        // Don't log auth errors to console as they're expected when not logged in
        if (response.status === 401 && url.includes('/auth/me')) {
          throw error;
        }

        throw error;
      }
      
      return await response.json();
    } catch (error) {
      // Don't log auth errors to console as they're expected when not logged in
      if (!(url.includes('/auth/me') && error instanceof Error && error.message.includes('401'))) {
        console.error('API request failed:', error);
      }
      throw error;
    }
  }

  // Get all products with optional filters
  async getProducts(filters?: {
    search?: string;
    license?: string;
    rating?: number;
    category?: string;
    featured?: boolean;
  }): Promise<Product[]> {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.license) params.append('license', filters.license);
    if (filters?.rating) params.append('rating', filters.rating.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';

    return this.request<Product[]>(endpoint);
  }

  // Get product by ID
  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  // Create new product
  async createProduct(product: CreateProductRequest): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  // Update product
  async updateProduct(id: number, product: UpdateProductRequest): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  // Delete product
  async deleteProduct(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/health');
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { email: string; password: string; is_admin?: boolean }): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<{ user: Omit<User, 'password'> }> {
    return this.request<{ user: Omit<User, 'password'> }>('/auth/me');
  }

  // Cart methods
  async getCart(): Promise<CartItem[]> {
    return this.request<CartItem[]>('/cart');
  }

  async addToCart(item: AddToCartRequest): Promise<{ message: string; quantity?: number; cartItemId?: number }> {
    return this.request<{ message: string; quantity?: number; cartItemId?: number }>('/cart/add', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateCartItem(id: number, update: UpdateCartRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    });
  }

  async removeFromCart(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/cart/${id}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/cart', {
      method: 'DELETE',
    });
  }

  async getCartSummary(): Promise<{ total_items: number; total_quantity: number; total_price: number }> {
    return this.request<{ total_items: number; total_quantity: number; total_price: number }>('/cart/summary');
  }

  // Admin methods
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/admin/users');
  }
}

export const apiService = new ApiService();
