import React, { useState, useEffect } from 'react';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types/Product';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductRequest | UpdateProductRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProductForm = ({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    license: '',
    description: '',
    rating: 5,
    price: 0,
    category: '',
    main_image_url: '',
    gallery_images: [''],
    feature_1: '',
    feature_2: '',
    feature_3: '',
    feature_4: '',
    feature_5: '',
    requirements: '',
    version: '',
    file_size: '',
    is_featured: false,
    demo_url: '',
    documentation_url: '',
    support_email: '',
    tags: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        license: product.license || '',
        description: product.description || '',
        rating: product.rating || 5,
        price: product.price || 0,
        category: product.category || '',
        main_image_url: product.main_image_url || '',
        gallery_images: product.gallery_images || [''],
        feature_1: product.feature_1 || '',
        feature_2: product.feature_2 || '',
        feature_3: product.feature_3 || '',
        feature_4: product.feature_4 || '',
        feature_5: product.feature_5 || '',
        requirements: product.requirements || '',
        version: product.version || '',
        file_size: product.file_size || '',
        is_featured: product.is_featured || false,
        demo_url: product.demo_url || '',
        documentation_url: product.documentation_url || '',
        support_email: product.support_email || '',
        tags: product.tags || ''
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.license.trim()) {
      newErrors.license = 'License is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    // Validate email format if support_email is provided
    if (formData.support_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.support_email)) {
      newErrors.support_email = 'Please enter a valid email address';
    }

    // Validate URL format for demo_url and documentation_url
    const urlPattern = /^https?:\/\/.+/;
    if (formData.demo_url && !urlPattern.test(formData.demo_url)) {
      newErrors.demo_url = 'Please enter a valid URL (starting with http:// or https://)';
    }
    if (formData.documentation_url && !urlPattern.test(formData.documentation_url)) {
      newErrors.documentation_url = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: CreateProductRequest | UpdateProductRequest = {
      name: formData.name.trim(),
      license: formData.license.trim(),
      description: formData.description.trim(),
      rating: formData.rating,
      price: formData.price,
      category: formData.category.trim(),
      main_image_url: formData.main_image_url.trim() || undefined,
      gallery_images: formData.gallery_images.filter(img => img.trim()),
      feature_1: formData.feature_1.trim() || undefined,
      feature_2: formData.feature_2.trim() || undefined,
      feature_3: formData.feature_3.trim() || undefined,
      feature_4: formData.feature_4.trim() || undefined,
      feature_5: formData.feature_5.trim() || undefined,
      requirements: formData.requirements.trim() || undefined,
      version: formData.version.trim() || undefined,
      file_size: formData.file_size.trim() || undefined,
      is_featured: formData.is_featured,
      demo_url: formData.demo_url.trim() || undefined,
      documentation_url: formData.documentation_url.trim() || undefined,
      support_email: formData.support_email.trim() || undefined,
      tags: formData.tags.trim() || undefined
    };

    await onSubmit(submitData);
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, '']
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const updateGalleryImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.map((img, i) => i === index ? value : img)
    }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
                disabled={isLoading}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
                disabled={isLoading}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value="">Select a category</option>
                <option value="Support">Support</option>
                <option value="Core">Core</option>
                <option value="In-Dataspace Enablement">In-Dataspace Enablement</option>
                <option value="Inter Dataspace enablement">Inter Dataspace enablement</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {/* License */}
            <div>
              <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                License *
              </label>
              <input
                type="text"
                id="license"
                value={formData.license}
                onChange={(e) => handleChange('license', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.license ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., MIT, Apache 2.0, Commercial"
                disabled={isLoading}
              />
              {errors.license && <p className="mt-1 text-sm text-red-600">{errors.license}</p>}
            </div>

            {/* Rating */}
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                Rating *
              </label>
              <select
                id="rating"
                value={formData.rating}
                onChange={(e) => handleChange('rating', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.rating ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
              {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product description"
                disabled={isLoading}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Product Images</h3>

          {/* Main Image */}
          <div className="mb-6">
            <ImageUpload
              value={formData.main_image_url}
              onChange={(url) => handleChange('main_image_url', url)}
              label="Main Product Image"
              placeholder="Enter image URL or upload from your computer"
              disabled={isLoading}
            />
          </div>

          {/* Gallery Images */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-lg font-semibold text-gray-900">
                Gallery Images
              </label>
              <button
                type="button"
                onClick={addGalleryImage}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                + Add Image
              </button>
            </div>

            <div className="space-y-4">
              {formData.gallery_images.map((image, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Gallery Image {index + 1}</span>
                    {formData.gallery_images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="px-3 py-1 text-red-600 border border-red-300 rounded-md hover:bg-red-50 text-sm font-medium"
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <ImageUpload
                    value={image}
                    onChange={(url) => updateGalleryImage(index, url)}
                    label=""
                    placeholder="Enter image URL or upload from your computer"
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num}>
                <label htmlFor={`feature_${num}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Feature {num}
                </label>
                <input
                  type="text"
                  id={`feature_${num}`}
                  value={formData[`feature_${num}` as keyof typeof formData] as string}
                  onChange={(e) => handleChange(`feature_${num}`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter feature ${num}`}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Technical Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Version */}
            <div>
              <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                Version
              </label>
              <input
                type="text"
                id="version"
                value={formData.version}
                onChange={(e) => handleChange('version', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1.0.0"
                disabled={isLoading}
              />
            </div>

            {/* File Size */}
            <div>
              <label htmlFor="file_size" className="block text-sm font-medium text-gray-700 mb-1">
                File Size
              </label>
              <input
                type="text"
                id="file_size"
                value={formData.file_size}
                onChange={(e) => handleChange('file_size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 15.2 MB"
                disabled={isLoading}
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., react, typescript, ui"
                disabled={isLoading}
              />
            </div>

            {/* Requirements */}
            <div className="md:col-span-3">
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
              <textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleChange('requirements', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., React 18+, Node.js 16+"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Demo URL */}
            <div>
              <label htmlFor="demo_url" className="block text-sm font-medium text-gray-700 mb-1">
                Demo URL
              </label>
              <input
                type="url"
                id="demo_url"
                value={formData.demo_url}
                onChange={(e) => handleChange('demo_url', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.demo_url ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://demo.example.com"
                disabled={isLoading}
              />
              {errors.demo_url && <p className="mt-1 text-sm text-red-600">{errors.demo_url}</p>}
            </div>

            {/* Documentation URL */}
            <div>
              <label htmlFor="documentation_url" className="block text-sm font-medium text-gray-700 mb-1">
                Documentation URL
              </label>
              <input
                type="url"
                id="documentation_url"
                value={formData.documentation_url}
                onChange={(e) => handleChange('documentation_url', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.documentation_url ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://docs.example.com"
                disabled={isLoading}
              />
              {errors.documentation_url && <p className="mt-1 text-sm text-red-600">{errors.documentation_url}</p>}
            </div>

            {/* Support Email */}
            <div>
              <label htmlFor="support_email" className="block text-sm font-medium text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                id="support_email"
                value={formData.support_email}
                onChange={(e) => handleChange('support_email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.support_email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="support@example.com"
                disabled={isLoading}
              />
              {errors.support_email && <p className="mt-1 text-sm text-red-600">{errors.support_email}</p>}
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => handleChange('is_featured', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                Featured Product
              </label>
            </div>
          </div>
        </div>

          </form>
        </div>
      </div>
      
      {/* Fixed Actions Bar */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
