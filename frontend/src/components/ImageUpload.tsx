import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label,
  placeholder = "Enter image URL or upload a file",
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB for better performance)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64 data URL for demo purposes
      // In a real application, you would upload to a cloud service like AWS S3, Cloudinary, etc.
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onChange(dataUrl);
        setUploading(false);
      };
      reader.onerror = () => {
        alert('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Upload Method Toggle */}
      <div className="flex space-x-4 mb-3">
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            uploadMethod === 'url'
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
          }`}
          disabled={disabled}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('file')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            uploadMethod === 'file'
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
          }`}
          disabled={disabled}
        >
          Upload File
        </button>
      </div>

      {/* URL Input */}
      {uploadMethod === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
            disabled={disabled}
          />
          {value && (
            <button
              type="button"
              onClick={clearImage}
              className="px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
              disabled={disabled}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={disabled || uploading}
            />
            {value && (
              <button
                type="button"
                onClick={clearImage}
                className="px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                disabled={disabled || uploading}
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
          </p>
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Uploading...</span>
        </div>
      )}

      {/* Image Preview */}
      {value && !uploading && (
        <div className="mt-3">
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-lg border border-gray-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
