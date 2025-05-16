import React from 'react';
import { Bell, Lightbulb, X, Info } from 'lucide-react'; // Added Info for general
import { Notification } from '../../types';

interface NotificationCardProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  maxItems?: number;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notifications,
  onDismiss,
  maxItems = 5
}) => {
  const getNotificationIcon = (type: 'alert' | 'tip', priority: 'low'|'medium'|'high') => {
    if (type === 'alert') {
        if (priority === 'high') return <Bell size={18} className="text-error-500" />;
        if (priority === 'medium') return <Bell size={18} className="text-warning-500" />;
        return <Bell size={18} className="text-primary-500" />;
    }
    if (type === 'tip') {
        return <Lightbulb size={18} className="text-success-500" />;
    }
    return <Info size={18} className="text-gray-500" />;
  };
  
  const getPriorityStyling = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return {
          borderColor: 'border-l-error-500',
          bgColor: 'bg-error-50 dark:bg-error-900/20',
          iconContainerBg: 'bg-error-100 dark:bg-error-500/30'
        };
      case 'medium':
        return {
          borderColor: 'border-l-warning-500',
          bgColor: 'bg-warning-50 dark:bg-warning-900/20',
          iconContainerBg: 'bg-warning-100 dark:bg-warning-500/30'
        };
      case 'low':
      default:
        return {
          borderColor: 'border-l-primary-500', // or success for tips
          bgColor: 'bg-primary-50 dark:bg-primary-900/20',
          iconContainerBg: 'bg-primary-100 dark:bg-primary-500/30'
        };
    }
  };
  
  const displayedNotifications = notifications.slice(0, maxItems);

  return (
    <div className="p-4 md:p-5 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h3 className="mb-3 md:mb-4 text-lg font-medium text-gray-800 dark:text-white">Notifications & Tips</h3>
      
      {displayedNotifications.length > 0 ? (
        <div className="space-y-3">
          {displayedNotifications.map((notification) => {
            const {borderColor, bgColor, iconContainerBg} = getPriorityStyling(notification.priority);
            return (
              <div 
                key={notification.id}
                className={`relative flex items-start p-3 border-l-4 rounded-md ${borderColor} ${bgColor} transition-all hover:shadow-md`}
              >
                <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 mr-3 rounded-full ${iconContainerBg}`}>
                  {getNotificationIcon(notification.type, notification.priority)}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(notification.date).toLocaleDateString()} - {new Date(notification.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                
                {!notification.read && (
                    <button 
                    className="absolute p-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600 top-1.5 right-1.5 dark:hover:bg-gray-700"
                    onClick={() => onDismiss(notification.id)}
                    aria-label="Dismiss notification"
                    >
                    <X size={16} />
                    </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          No new notifications at this time.
        </div>
      )}
      {notifications.length > maxItems && (
         <p className="mt-3 text-xs text-center text-primary-600 dark:text-primary-400">
            +{notifications.length - maxItems} more notifications
        </p>
      )}
    </div>
  );
};

export default NotificationCard;