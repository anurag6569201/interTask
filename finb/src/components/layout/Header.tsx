import React, { useState, useEffect, useRef } from 'react';
import { Menu, Moon, Sun, Bell, XCircle } from 'lucide-react'; // Added XCircle
import { User, Notification } from '../../types';
import { mockFinancialData, formatCurrency } from '../../data/mockData'; // Added formatCurrency

interface HeaderProps {
  user: User;
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, darkMode, toggleDarkMode, toggleSidebar }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockFinancialData.notifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const savingsPercentage = user.savingsGoal > 0 ? Math.min(Math.round((user.currentSavings / user.savingsGoal) * 100), 100) : 0;
  
  const handleDismissNotification = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent closing dropdown when dismissing
    setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n)); // Mark as read
    // Or filter out: setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center">
        <button
          className="p-1 mr-2 text-gray-500 rounded-md hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 md:hidden"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
        
        {/* Header title can be dynamic based on route, or removed if sidebar has app name */}
        {/* <h1 className="text-lg font-semibold text-gray-800 dark:text-white md:text-xl">Dashboard</h1> */}
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="hidden md:flex md:flex-col md:items-end">
          <div className="flex items-center mb-0.5">
            <h2 className="mr-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              Savings Goal: {formatCurrency(user.currentSavings)} / {formatCurrency(user.savingsGoal)}
            </h2>
            <span className={`text-xs font-bold ${savingsPercentage > 75 ? 'text-success-500' : savingsPercentage > 40 ? 'text-warning-500' : 'text-error-500'}`}>
              ({savingsPercentage}%)
            </span>
          </div>
          <div className="w-40 h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-success-500 transition-all duration-500 ease-out" 
              style={{ width: `${savingsPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <button 
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="relative" ref={notificationRef}>
          <button 
            className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-[8px]">
                {/* {unreadCount > 9 ? '9+' : unreadCount} Can show count if needed */}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-xl dark:bg-gray-800 border dark:border-gray-700 origin-top-right">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Notifications ({unreadCount})</h3>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {notifications.length > 0 ? (
                  notifications.sort((a,b) => (a.read ? 1 : -1) || (new Date(b.date).getTime() - new Date(a.date).getTime())).map(notification => ( // Unread first, then by date
                    <div 
                      key={notification.id}
                      className={`p-3 border-b border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                          {notification.message}
                        </p>
                        <button
                          className="ml-2 text-gray-400 hover:text-error-500 dark:hover:text-error-400 flex-shrink-0"
                          onClick={(e) => handleDismissNotification(notification.id, e)}
                          aria-label="Dismiss notification"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(notification.date).toLocaleDateString()} - {new Date(notification.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No new notifications
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
                        className="text-xs text-primary-600 hover:underline dark:text-primary-400"
                    >
                        Mark all as read
                    </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
          <div className="relative flex-shrink-0">
            <img
              className="object-cover w-9 h-9 rounded-full ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-primary-500"
              src={user.avatar}
              alt={user.name}
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;