export interface Product {
  id: number;
  name: string;
  license: string;
  description: string;
  rating: number; // 1-5 stars
  price: number;
  category: string;
  main_image_url?: string;
  gallery_images?: string[];
  feature_1?: string;
  feature_2?: string;
  feature_3?: string;
  feature_4?: string;
  feature_5?: string;
  requirements?: string; // System requirements
  version?: string;
  file_size?: string;
  download_count?: number;
  is_featured?: boolean;
  demo_url?: string;
  documentation_url?: string;
  support_email?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  license: string;
  description: string;
  rating: number;
  price: number;
  category: string;
  main_image_url?: string;
  gallery_images?: string[];
  feature_1?: string;
  feature_2?: string;
  feature_3?: string;
  feature_4?: string;
  feature_5?: string;
  requirements?: string;
  version?: string;
  file_size?: string;
  is_featured?: boolean;
  demo_url?: string;
  documentation_url?: string;
  support_email?: string;
  tags?: string;
}

export interface UpdateProductRequest {
  name?: string;
  license?: string;
  description?: string;
  rating?: number;
  price?: number;
  category?: string;
  main_image_url?: string;
  gallery_images?: string[];
  feature_1?: string;
  feature_2?: string;
  feature_3?: string;
  feature_4?: string;
  feature_5?: string;
  requirements?: string;
  version?: string;
  file_size?: string;
  is_featured?: boolean;
  demo_url?: string;
  documentation_url?: string;
  support_email?: string;
  tags?: string;
}

// User and Authentication types
export interface User {
  id: number;
  email: string;
  password: string; // In real app, this would be hashed
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'password'>;
  message: string;
}

// Cart types
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product?: Product; // Populated when fetching cart
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

// Category type
export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
