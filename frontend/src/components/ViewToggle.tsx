import React from 'react';
import { 
  Squares2X2Icon, 
  ListBulletIcon 
} from '@heroicons/react/24/outline';
import { 
  Squares2X2Icon as Squares2X2IconSolid, 
  ListBulletIcon as ListBulletIconSolid 
} from '@heroicons/react/24/solid';

export type ViewType = 'grid' | 'list';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ 
  currentView, 
  onViewChange, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center bg-gray-100 rounded-lg p-1 ${className}`}>
      <button
        onClick={() => onViewChange('grid')}
        className={`
          flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${currentView === 'grid'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }
        `}
        title="Grid View"
      >
        {currentView === 'grid' ? (
          <Squares2X2IconSolid className="w-5 h-5" />
        ) : (
          <Squares2X2Icon className="w-5 h-5" />
        )}
        <span className="ml-2 hidden sm:inline">Grid</span>
      </button>
      
      <button
        onClick={() => onViewChange('list')}
        className={`
          flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${currentView === 'list'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }
        `}
        title="List View"
      >
        {currentView === 'list' ? (
          <ListBulletIconSolid className="w-5 h-5" />
        ) : (
          <ListBulletIcon className="w-5 h-5" />
        )}
        <span className="ml-2 hidden sm:inline">List</span>
      </button>
    </div>
  );
};

export default ViewToggle;
