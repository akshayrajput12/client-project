import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  license: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().min(1).max(255).required(),
  main_image_url: Joi.string().uri().optional().allow(''),
  gallery_images: Joi.array().items(Joi.string().uri()).optional(),
  feature_1: Joi.string().max(255).optional().allow(''),
  feature_2: Joi.string().max(255).optional().allow(''),
  feature_3: Joi.string().max(255).optional().allow(''),
  feature_4: Joi.string().max(255).optional().allow(''),
  feature_5: Joi.string().max(255).optional().allow(''),
  requirements: Joi.string().optional().allow(''),
  version: Joi.string().max(50).optional().allow(''),
  file_size: Joi.string().max(50).optional().allow(''),
  is_featured: Joi.boolean().optional(),
  demo_url: Joi.string().uri().max(500).optional().allow(''),
  documentation_url: Joi.string().uri().max(500).optional().allow(''),
  support_email: Joi.string().email().max(255).optional().allow(''),
  tags: Joi.string().max(500).optional().allow(''),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  license: Joi.string().min(1).max(255).optional(),
  description: Joi.string().min(1).optional(),
  rating: Joi.number().integer().min(1).max(5).optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string().min(1).max(255).optional(),
  main_image_url: Joi.string().uri().optional().allow(''),
  gallery_images: Joi.array().items(Joi.string().uri()).optional(),
  feature_1: Joi.string().max(255).optional().allow(''),
  feature_2: Joi.string().max(255).optional().allow(''),
  feature_3: Joi.string().max(255).optional().allow(''),
  feature_4: Joi.string().max(255).optional().allow(''),
  feature_5: Joi.string().max(255).optional().allow(''),
  requirements: Joi.string().optional().allow(''),
  version: Joi.string().max(50).optional().allow(''),
  file_size: Joi.string().max(50).optional().allow(''),
  is_featured: Joi.boolean().optional(),
  demo_url: Joi.string().uri().max(500).optional().allow(''),
  documentation_url: Joi.string().uri().max(500).optional().allow(''),
  support_email: Joi.string().email().max(255).optional().allow(''),
  tags: Joi.string().max(500).optional().allow(''),
});

export const productIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

// User validation schemas
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required()
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  is_admin: Joi.boolean().optional()
});

// Cart validation schemas
export const addToCartSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).required()
});

export const updateCartSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required()
});

export const validateCreateProduct = (data: any) => {
  return createProductSchema.validate(data);
};

export const validateUpdateProduct = (data: any) => {
  return updateProductSchema.validate(data);
};
