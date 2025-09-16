import React from 'react';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Navigation Link Component
 * Simple link component for navigation items
 */
const NavigationLink: React.FC<NavigationLinkProps> = ({ 
  href, 
  children, 
  className = '' 
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 ${className}`}
    >
      {children}
    </a>
  );
};

export default NavigationLink;
