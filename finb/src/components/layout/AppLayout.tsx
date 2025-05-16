import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom'; // Added useOutletContext
import Sidebar from './Sidebar';
import Header from './Header';
import { mockFinancialData } from '../../data/mockData';

const AppLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) return JSON.parse(savedMode);
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode: boolean) => !prevMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}> {/* Ensure dark class is on html or a high-level div */}
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <Header 
            user={mockFinancialData.user} 
            toggleDarkMode={toggleDarkMode} 
            darkMode={darkMode} 
            toggleSidebar={toggleSidebar}
          />
          
          <main className="relative flex-1 overflow-y-auto focus:outline-none p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            {/* Pass darkMode and toggleDarkMode to all children via context */}
            <Outlet context={{ darkMode, toggleDarkMode }} /> 
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;