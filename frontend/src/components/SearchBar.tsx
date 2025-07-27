import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Product } from '../types/Product';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onProductSelect?: (product: Product) => void;
  suggestions?: Product[];
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onProductSelect,
  suggestions = [],
  placeholder = "Search products...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    onSearch(value);
    setShowSuggestions(value.length > 0 && suggestions.length > 0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleProductSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setQuery(product.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onProductSelect?.(product);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch('');
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions visibility when suggestions change
  useEffect(() => {
    setShowSuggestions(query.length > 0 && suggestions.length > 0);
  }, [suggestions, query]);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(query.length > 0 && suggestions.length > 0)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                   bg-white text-gray-900 placeholder-gray-500
                   sm:text-sm transition-colors duration-200"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((product, index) => (
                <li key={product.id}>
                  <button
                    onClick={() => handleProductSelect(product)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 
                              focus:outline-none transition-colors duration-150 ${
                      selectedIndex === index ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {product.main_image_url && (
                        <img
                          src={product.main_image_url}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {product.category} • ${product.price}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-yellow-500">★</span>
                        <span className="text-xs text-gray-500">{product.rating}</span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
