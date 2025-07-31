import React from 'react';

interface DashButtonProps {
  title: string;
  value: string | number;
  icon: string;
  backgroundColor: string;
  textColor?: string;
  valueColor?: string;
  onClick?: () => void;
  className?: string;
  iconOnly?: boolean;
}

const DashButton: React.FC<DashButtonProps> = ({
  title,
  value,
  icon,
  backgroundColor,
  textColor = 'white',
  valueColor = 'white',
  onClick,
  className = '',
  iconOnly = false
}) => {
  if (iconOnly) {
    return (
      <div
        className={`
          flex flex-col items-center justify-center cursor-pointer
          p-2
          transform transition-all duration-300 hover:scale-105
          ${className}
        `}
        onClick={onClick}
        title={title}
      >
        <div className="text-xl text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-1">
          {icon}
        </div>
        {value && (
          <div className="text-xs font-semibold text-gray-700 mb-1">
            {value}
          </div>
        )}
        <div className="text-xs text-gray-500 text-center">
          {title}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg p-3 cursor-pointer
        transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
        ${className}
      `}
      style={{ backgroundColor }}
      onClick={onClick}
    >
      {/* Background Pattern/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      
      {/* Content - Centered Layout for Square Design */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        {/* Icon */}
        <div className="text-xl mb-1">{icon}</div>
        
        {/* Title */}
        <h3 
          className="text-xs font-medium opacity-90 mb-1"
          style={{ color: textColor }}
        >
          {title}
        </h3>
        
        {/* Value */}
        <div 
          className="text-lg font-bold"
          style={{ color: valueColor }}
        >
          {value}
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default DashButton;