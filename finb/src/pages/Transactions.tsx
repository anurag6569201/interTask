import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Download, Calendar as CalendarIconLucide } from 'lucide-react'; // Renamed Calendar import
import { Transaction, Category } from '../types';
import { mockFinancialData, formatCurrency, formatDate, getCategoryColor, getCategoryIcon } from '../data/mockData';
import * as LucideIcons from 'lucide-react';

const Transactions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const ITEMS_PER_PAGE = 10;
  
  const filteredTransactions = mockFinancialData.transactions.filter(transaction => {
    const matchesQuery = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || transaction.category === selectedCategory;
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    return matchesQuery && matchesCategory && matchesType;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ensure sorted
  
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
  
  const categories = Array.from(new Set(mockFinancialData.transactions.map(t => t.category))).sort();
  
  const getIconByName = (name: string) => {
    const IconComponent = (LucideIcons as any)[name];
    return IconComponent ? <IconComponent size={16} /> : <LucideIcons.Circle size={16} />;
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
            View and manage all your transactions
          </p>
        </div>
        
        <div className="flex mt-4 space-x-2 md:mt-0">
          <button className="flex items-center px-3 py-2 text-xs text-gray-700 bg-white rounded-md shadow dark:bg-gray-800 dark:text-gray-300 md:text-sm md:px-4">
            <CalendarIconLucide size={16} className="mr-2" />
            <span>Select Date Range</span>
          </button>
          <button className="flex items-center px-3 py-2 text-xs text-white bg-primary-500 rounded-md shadow hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 md:text-sm md:px-4">
            <Download size={16} className="mr-2" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      <div className="p-4 md:p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-col mb-4 space-y-3 md:space-y-0 md:flex-row md:justify-between md:items-center">
          <div className="relative w-full md:w-auto md:flex-grow md:max-w-xs">
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full px-3 py-2 pl-10 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute w-5 h-5 text-gray-400 top-2.5 left-3" />
          </div>
          
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2">
            <button
              className="flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-300"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
            </button>
            
            <div className="flex text-sm border border-gray-300 rounded-md dark:border-gray-600 overflow-hidden">
              {['all', 'income', 'expense'].map((type) => (
                 <button
                    key={type}
                    className={`px-3 py-2 flex-1 sm:flex-none ${
                      selectedType === type
                        ? type === 'all' ? 'bg-primary-500 text-white'
                          : type === 'income' ? 'bg-success-500 text-white'
                          : 'bg-error-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } transition-colors duration-150 capitalize`}
                    onClick={() => setSelectedType(type as 'all' | 'income' | 'expense')}
                  >
                    {type}
                  </button>
              ))}
            </div>
          </div>
        </div>
        
        {showFilters && (
          <div className="p-3 mb-4 bg-gray-50 rounded-md dark:bg-gray-700">
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Category</h4>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 text-xs rounded-full ${
                  selectedCategory === ''
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-300 ring-1 ring-primary-500'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 text-xs rounded-full capitalize flex items-center transition-all duration-150 ${
                    selectedCategory === category
                      ? 'ring-1 ring-offset-1 dark:ring-offset-gray-700' // Active style handled by style prop
                      : 'hover:opacity-80'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    backgroundColor: selectedCategory === category 
                      ? getCategoryColor(category)
                      : `${getCategoryColor(category)}2A`, // 2A for ~16% opacity
                    color: selectedCategory === category 
                      ? '#FFFFFF' // White text for active, assuming dark category colors
                      : getCategoryColor(category),
                    ringColor: selectedCategory === category ? getCategoryColor(category) : 'transparent'
                  }}
                >
                  <span className="mr-1">{getIconByName(getCategoryIcon(category))}</span>
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 min-w-[200px] md:min-w-0">Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Account</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => {
                  const account = mockFinancialData.accounts.find(acc => acc.id === transaction.accountId);
                  return (
                    <tr 
                      key={transaction.id} 
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${
                        transaction.type === 'income' 
                          ? 'bg-success-50/50 dark:bg-success-900/20' 
                          : ''
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 mr-3 text-white rounded-full" style={{ backgroundColor: getCategoryColor(transaction.category) }}>
                            {getIconByName(getCategoryIcon(transaction.category))}
                          </div>
                          <span className="font-medium text-gray-800 dark:text-white truncate">
                            {transaction.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium capitalize rounded-full" style={{ 
                          backgroundColor: `${getCategoryColor(transaction.category)}2A`, // ~16% opacity
                          color: getCategoryColor(transaction.category)
                        }}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-600 dark:text-gray-400">
                          {account?.name || 'N/A'}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-medium whitespace-nowrap ${
                        transaction.type === 'income' 
                          ? 'text-success-600 dark:text-success-400' 
                          : 'text-error-600 dark:text-error-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                className="p-2 text-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400"
                onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} />
              </button>
              
              {/* Dynamic Page numbers - simplified for brevity here */}
              {Array.from({ length: totalPages > 5 ? (currentPage < 4 ? 3 : (totalPages - currentPage < 2 ? 3 : 1)) : totalPages }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                      pageNum = i + 1;
                  } else {
                      if (currentPage < 4) pageNum = i + 1;
                      else if (totalPages - currentPage < 2) pageNum = totalPages - 2 + i;
                      else pageNum = currentPage -1 + i;
                  }
                  if(pageNum > totalPages || pageNum < 1) return null;

                  return (
                    <button
                      key={`page-${pageNum}`}
                      className={`w-8 h-8 text-sm rounded-md transition-colors duration-150 ${
                        currentPage === pageNum
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && totalPages > 3 && <span className="px-2 self-center">...</span>}

                {totalPages > 5 && currentPage < totalPages -1 && (
                     <button
                      className={`w-8 h-8 text-sm rounded-md transition-colors duration-150 ${
                        currentPage === totalPages
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                )}
              
              <button
                className="p-2 text-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400"
                onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;