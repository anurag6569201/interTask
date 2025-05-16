import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockFinancialData, formatCurrency } from '../data/mockData';
import { Transaction } from '../types';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    // Sunday is 0, Monday is 1, etc.
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTransactionsForDate = (date: Date): Transaction[] => {
    return mockFinancialData.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getDate() === date.getDate() &&
        transactionDate.getMonth() === date.getMonth() &&
        transactionDate.getFullYear() === date.getFullYear()
      );
    }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getDailySpending = (date: Date): number => {
    return getTransactionsForDate(date)
      .reduce((total, transaction) => 
        total + (transaction.type === 'expense' ? transaction.amount : -transaction.amount), 0 // Show net change or just expenses
      );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate); // 0 for Sunday, 1 for Monday ...
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = new Date();
  today.setHours(0,0,0,0);

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          Spending Calendar
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 md:text-base">
          Track your daily spending patterns and view transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-4 md:p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex space-x-1 md:space-x-2">
              <button
                onClick={previousMonth}
                className="p-1.5 md:p-2 text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                aria-label="Previous month"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 md:p-2 text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                aria-label="Next month"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px md:gap-1 mb-4 text-center text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px md:gap-1 aspect-[7/5]"> {/* Maintain aspect ratio for calendar grid */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="bg-gray-50 dark:bg-gray-700/30 rounded-sm" />
            ))}

            {daysArray.map(day => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              date.setHours(0,0,0,0);
              const isCurrentMonthToday = today.toDateString() === date.toDateString();
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              const dailyNet = getDailySpending(date); // Net amount (income - expense)
              const hasTransactions = getTransactionsForDate(date).length > 0;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    p-1 md:p-2 rounded-md transition-colors duration-150 flex flex-col justify-start items-center aspect-square
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10
                    ${isSelected ? 'bg-primary-100 dark:bg-primary-800/50 ring-2 ring-primary-500' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}
                    ${isCurrentMonthToday ? 'border-2 border-primary-600 dark:border-primary-400' : 'border border-gray-200 dark:border-gray-700'}
                  `}
                >
                  <div className={`text-xs md:text-sm font-medium ${isSelected ? 'text-primary-700 dark:text-primary-200' : 'text-gray-900 dark:text-white'}`}>{day}</div>
                  {hasTransactions && (
                    <div className={`mt-1 text-[10px] md:text-xs font-medium whitespace-nowrap ${
                      dailyNet > 0 ? 'text-success-500' : dailyNet < 0 ? 'text-error-500' : 'text-gray-500'
                    }`}>
                      {dailyNet > 0 ? '+' : ''}{formatCurrency(dailyNet)}
                    </div>
                  )}
                </button>
              );
            })}
             {/* Fill remaining cells to complete the grid structure */}
            {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, index) => (
                <div key={`empty-end-${index}`} className="bg-gray-50 dark:bg-gray-700/30 rounded-sm" />
            ))}
          </div>
        </div>
        
        {/* Selected Day Transactions - On the side for larger screens */}
        <div className="lg:col-span-1">
            <div className="p-4 md:p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 sticky top-20"> {/* Sticky for scrolling */}
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              {selectedDate ? `Transactions for ${selectedDate.toLocaleDateString()}` : 'Select a date to see transactions'}
            </h3>
            {selectedDate && (
              <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {getTransactionsForDate(selectedDate).length > 0 ? (
                  getTransactionsForDate(selectedDate).map(transaction => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700/80"
                    >
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {transaction.category}
                        </p>
                      </div>
                      <span className={`text-sm font-medium ${
                        transaction.type === 'income'
                          ? 'text-success-500'
                          : 'text-error-500'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                    No transactions for this date.
                  </p>
                )}
              </div>
            )}
            {!selectedDate && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                    Click on a day in the calendar to view its transactions.
                </p>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;