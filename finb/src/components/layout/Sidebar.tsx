import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Added useLocation
import { 
  X, LayoutDashboard, Receipt, PieChart, CreditCard, Goal, Settings, LogOut,
  Wallet, CalendarDays // Changed Calendar to CalendarDays for clarity
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleSidebar }) => {
  const location = useLocation(); // For closing sidebar on nav in mobile

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <Receipt size={20} /> },
    { name: 'Budgets', path: '/budgets', icon: <PieChart size={20} /> },
    { name: 'Accounts', path: '/accounts', icon: <CreditCard size={20} /> },
    { name: 'Goals', path: '/goals', icon: <Goal size={20} /> },
    { name: 'Calendar', path: '/calendar', icon: <CalendarDays size={20} /> },
  ];

  const handleNavLinkClick = () => {
    if (open && window.innerWidth < 768) { // md breakpoint
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col overflow-y-auto transition-transform duration-300 transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:translate-x-0 md:static md:h-screen ${
          open ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <NavLink to="/" className="flex items-center" onClick={handleNavLinkClick}>
            <Wallet className="w-7 h-7 text-primary-500" />
            <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
              FINB
            </span>
          </NavLink>
          <button
            className="p-1 text-gray-500 rounded-md hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 md:hidden"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-grow px-2 py-4 space-y-6 overflow-y-auto">
          <div>
            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 tracking-wider">
              Main Menu
            </p>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={handleNavLinkClick}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                        isActive 
                          ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`
                    }
                    end={item.path === '/'} // Ensures Dashboard is only active for '/'
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 tracking-wider">
              Application
            </p>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/settings"
                  onClick={handleNavLinkClick}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <Settings size={20} className="mr-3" />
                  <span>Settings</span>
                </NavLink>
              </li>
              <li>
                <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-150">
                  <LogOut size={20} className="mr-3" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
        <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} FINB App
            </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;