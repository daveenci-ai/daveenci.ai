
import React from 'react';

interface CCVLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
}

const CCVLogo = ({ size = 'md', variant = 'dark' }: CCVLogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  // Apply filter for light variant (make logo white for dark backgrounds)
  const filterClass = variant === 'light' ? 'brightness-0 invert' : '';

  return (
    <img 
      src="/logo.png" 
      alt="DaVeenci" 
      className={`${sizeClasses[size]} ${filterClass} object-contain`}
      style={{ 
        backgroundColor: 'transparent'
      }}
    />
  );
};

export default CCVLogo;
