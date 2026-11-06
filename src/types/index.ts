export type ExpenseCategory =
  | '食費'
  | 'カフェ'
  | '住まい'
  | '光熱費'
  | '交通'
  | '日用品'
  | '通信費'
  | '趣味・娯楽'
  | '美容・衣服'
  | '医療・保険'
  | 'その他';

export interface UserProfile {
  id: string;
  name: string;
  role: string; // e.g. "家計主 / 管理者", "パートナー", "家族", "子供"
  avatarColor: string; // Hex color code
  monthlyBudget?: number;
  memo?: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  memo?: string;
  userId?: string;
}

export interface IncomeItem {
  id: string;
  source: string;
  amount: number;
  date: string; // YYYY-MM-DD
  memo?: string;
  userId?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  userId?: string;
}

export interface ScheduleItem {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  category?: string;
  userId?: string;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  fee: number;
  cycle: 'monthly' | 'yearly';
  category?: string;
  userId?: string;
}

export interface WishItem {
  id: string;
  name: string;
  price: number;
  saved?: boolean;
  userId?: string;
}

export interface AppSettings {
  familySize: string; // '1' | '2' | '3' | '4'
  hasPet: boolean;
  targetSavings: number;
  monthlyBudget: number;
  userName: string;
  currentUserId: string; // 'all' or specific user ID
  users: UserProfile[];
}

export type NavTab = 'dashboard' | 'kakeibo' | 'todo' | 'calendar';

