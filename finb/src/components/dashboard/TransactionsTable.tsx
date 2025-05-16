import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Transaction, Category } from '../../types';
import { formatCurrency, formatDate, getCategoryIcon, getCategoryColor } from '../../data/mockData';
import * as LucideIcons from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  
  const ITEMS_PER_PAGE = 5;
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesQuery = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || transaction.category === selectedCategory;
    return matchesQuery && matchesCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ensure sorted
  
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
  
  const categories = Array.from(new Set(transactions.map(t => t.category))).sort();
  
  const getIconByName = (name: string) => {
    const IconComponent = (LucideIcons as any)[name];
    return IconComponent ? <IconComponent size={16} /> : <LucideIcons.Circle size={16} />;
  };
  
  return (
    <div className="p-4 md:p-5 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="flex flex-col mb-4 space-y-3 sm:flex-row sm:justify-between sm:items-center">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Recent Transactions</h3>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-48 px-3 py-2 pl-10 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute w-4 h-4 text-gray-400 top-2.5 left-3" />
          </div>
          
          <button
            className="flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-300"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            <span>Filter</span>
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="p-3 mb-4 bg-gray-50 rounded-md dark:bg-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 text-xs rounded-full ${
                selectedCategory === ''
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-300 ring-1 ring-primary-500'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
            
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 text-xs rounded-full capitalize flex items-center transition-all duration-150 ${
                  selectedCategory === category ? 'ring-1 ring-offset-1 dark:ring-offset-gray-700' : 'hover:opacity-80'
                }`}
                onClick={() => setSelectedCategory(category)}
                style={{
                  backgroundColor: selectedCategory === category ? getCategoryColor(category) : `${getCategoryColor(category)}2A`,
                  color: selectedCategory === category ? '#FFFFFF' : getCategoryColor(category),
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
              <th className="px-4 py-3 min-w-[180px] md:min-w-0">Description</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
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
                  <td className={`px-4 py-3 text-right font-medium whitespace-nowrap ${
                    transaction.type === 'income' 
                      ? 'text-success-600 dark:text-success-400' 
                      : 'text-error-600 dark:text-error-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredTransactions.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length}
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              className="p-2 text-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400"
              onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              className="p-2 text-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400"
              onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;