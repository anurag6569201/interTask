export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  savingsGoal: number;
  currentSavings: number;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  lastUpdate: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category;
  accountId: string;
}

export type Category =
  | 'food'
  | 'transportation'
  | 'housing'
  | 'utilities'
  | 'entertainment'
  | 'healthcare'
  | 'shopping'
  | 'travel'
  | 'education'
  | 'salary'
  | 'investment'
  | 'other';

export interface CategoryBudget {
  category: Category;
  budgeted: number;
  spent: number;
}

export interface MonthlyFinancial {
  month: string;
  income: number;
  expenses: number;
}

export interface CategorySpending {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}

export interface Notification {
  id: string;
  type: 'alert' | 'tip';
  message: string;
  date: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export type TimeRange = 'monthly' | 'quarterly' | 'ytd';

export interface FinancialData {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
  monthlyFinancials: MonthlyFinancial[];
  categorySpending: CategorySpending[];
  budgets: CategoryBudget[];
  notifications: Notification[];
}