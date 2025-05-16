import React from 'react';
import { CreditCard, Wallet, TrendingUp, Plus, ExternalLink, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { mockFinancialData, formatCurrency } from '../data/mockData';

const Accounts: React.FC = () => {
  const totalBalance = mockFinancialData.accounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlyChange = 2345.67; // Mock monthly change
  const isPositiveChange = monthlyChange > 0;

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          Accounts Overview
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
          Manage your financial accounts and track balances.
        </p>
      </div>

      {/* Total Balance Card */}
      <div className="p-4 md:p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="grid gap-4 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Total Net Worth
            </h2>
            <div className="mt-2 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalBalance)}
            </div>
            <div className="flex items-center mt-2">
              <span className={`flex items-center text-sm font-medium ${
                isPositiveChange ? 'text-success-500' : 'text-error-500'
              }`}>
                {isPositiveChange ? <ArrowUpRight size={18} className="mr-0.5" /> : <ArrowDownRight size={18} className="mr-0.5" />}
                {formatCurrency(Math.abs(monthlyChange))}
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 md:text-sm">
                this month (mock)
              </span>
            </div>
          </div>
          
          <div className="flex justify-start md:justify-end">
            <button className="flex items-center px-3 py-2 text-xs text-white bg-primary-500 rounded-md hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 md:text-sm md:px-4">
              <Plus size={16} className="mr-2" />
              <span>Add Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockFinancialData.accounts.map((account) => {
          let AccountIcon, iconBgColor, iconTextColor;
          switch (account.type) {
            case 'checking':
              AccountIcon = Wallet;
              iconBgColor = 'bg-blue-100 dark:bg-blue-900/30';
              iconTextColor = 'text-blue-600 dark:text-blue-400';
              break;
            case 'savings':
              AccountIcon = CreditCard; // Or use a piggy bank icon if available
              iconBgColor = 'bg-green-100 dark:bg-green-900/30';
              iconTextColor = 'text-green-600 dark:text-green-400';
              break;
            case 'investment':
              AccountIcon = TrendingUp;
              iconBgColor = 'bg-purple-100 dark:bg-purple-900/30';
              iconTextColor = 'text-purple-600 dark:text-purple-400';
              break;
            default: // credit or other
              AccountIcon = CreditCard; 
              iconBgColor = 'bg-red-100 dark:bg-red-900/30';
              iconTextColor = 'text-red-600 dark:text-red-400';
          }

          return (
            <div key={account.id} className="p-4 md:p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${iconBgColor} ${iconTextColor}`}>
                    <AccountIcon size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                      {account.name}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize dark:text-gray-400">
                      {account.type} Account
                    </p>
                  </div>
                </div>
                <button className="p-1.5 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-500" title="View on bank site (mock)">
                  <ExternalLink size={16} />
                </button>
              </div>

              <div className="mb-4">
                <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(account.balance)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Updated: {new Date(account.lastUpdate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex space-x-2 text-xs md:text-sm">
                <button className="flex-1 px-3 py-2 text-white bg-primary-500 rounded-md hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700">
                  Details
                </button>
                <button className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                  Transfer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Accounts;