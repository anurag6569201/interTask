import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Sun, Moon, Bell, DollarSign, Save, Info } from 'lucide-react';
import { mockFinancialData } from '../data/mockData';

interface AppLayoutContext {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode } = useOutletContext<AppLayoutContext>();
  
  const [currentUser, setCurrentUser] = useState(mockFinancialData.user);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const handleProfileSave = () => {
    // In a real app, this would call an API
    setCurrentUser(prev => ({ ...prev, name, email }));
    // mockFinancialData.user.name = name; // Not ideal to mutate mockData directly
    // mockFinancialData.user.email = email;
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  };
  
  // Ensure toggleDarkMode is available before using it
  const handleToggleDarkMode = () => {
    if (toggleDarkMode) {
      toggleDarkMode();
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl mb-6">Settings</h1>

      {showSaveConfirmation && (
        <div className="mb-4 p-4 bg-success-100 border border-success-300 text-success-700 rounded-md dark:bg-success-900 dark:text-success-200 dark:border-success-700 flex items-center">
          <Info size={20} className="mr-2" />
          Profile settings saved (mock)!
        </div>
      )}

      {/* Profile Settings */}
      <div className="p-4 md:p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <User size={24} className="mr-2 text-primary-500" /> Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button
            onClick={handleProfileSave}
            className="flex items-center px-4 py-2 text-sm text-white bg-primary-500 rounded-md hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
          >
            <Save size={16} className="mr-2" /> Save Profile
          </button>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="p-4 md:p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          {darkMode ? <Sun size={24} className="mr-2 text-yellow-400" /> : <Moon size={24} className="mr-2 text-primary-500" />}
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          <button
            onClick={handleToggleDarkMode}
            disabled={!toggleDarkMode}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              darkMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="p-4 md:p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <Bell size={24} className="mr-2 text-primary-500" /> Notifications
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                emailNotifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Push Notifications (App)</span>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                pushNotifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Notification preferences are currently a mock-up.
          </p>
        </div>
      </div>
      
      {/* Currency Settings */}
      <div className="p-4 md:p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <DollarSign size={24} className="mr-2 text-primary-500" /> Currency
        </h2>
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="USD">USD - United States Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
          </select>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Currency selection is currently a mock-up and does not affect displayed values.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;