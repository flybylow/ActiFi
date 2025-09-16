import React from 'react';
import NavigationLink from './NavigationLink';

interface SidebarNavigationProps {
  className?: string;
}

/**
 * Sidebar Navigation Component
 * Provides navigation links for the ActiFi application
 */
const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  className = '' 
}) => {
  const navigationItems = [
    {
      href: '/portfolio-dashboard.html',
      label: '📊 Portfolio Dashboard',
      description: 'View your complete portfolio analysis'
    },
    {
      href: '/portfolio-dashboard-ink.html',
      label: '🎨 Ink Dashboard',
      description: 'Portfolio dashboard with Ink design system'
    },
    {
      href: '/portfolio-dashboard-direct.html',
      label: '⚡ Direct Dashboard',
      description: 'Simplified portfolio view'
    }
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-sm ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          ActiFi Navigation
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Quick access to portfolio tools
        </p>
      </div>
      
      <nav className="py-2">
        {navigationItems.map((item, index) => (
          <div key={index} className="group">
            <NavigationLink href={item.href}>
              <div className="flex flex-col">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                  {item.description}
                </span>
              </div>
            </NavigationLink>
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span>💡</span>
            <span>Tip: Use these links to access different dashboard views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
