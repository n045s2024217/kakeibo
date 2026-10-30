/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Home,
  Wallet,
  Calendar,
  CheckSquare,
  Plus,
} from 'lucide-react';
import {
  ExpenseItem,
  IncomeItem,
  TodoItem,
  ScheduleItem,
  SubscriptionItem,
  WishItem,
  AppSettings,
  NavTab,
} from './types';
import {
  INITIAL_EXPENSES,
  INITIAL_INCOMES,
  INITIAL_TODOS,
  INITIAL_SCHEDULES,
  INITIAL_SUBS,
  INITIAL_WISHES,
  INITIAL_SETTINGS,
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { KakeiboView } from './components/KakeiboView';
import { TodoView } from './components/TodoView';
import { CalendarView } from './components/CalendarView';
import { RecordModal } from './components/RecordModal';

const STORAGE_KEY = 'kakeibo_app_data_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [currentMonth, setCurrentMonth] = useState('2026-07');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // App Data States
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.expenses) && parsed.expenses.length > 0) {
          const hasJune = parsed.expenses.some((e: ExpenseItem) => e.date.startsWith('2026-06'));
          if (!hasJune) {
            const juneExpenses = INITIAL_EXPENSES.filter((e) => e.date.startsWith('2026-06'));
            return [...parsed.expenses, ...juneExpenses];
          }
          return parsed.expenses;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EXPENSES;
  });

  const [incomes, setIncomes] = useState<IncomeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.incomes) && parsed.incomes.length > 0) {
          const hasJune = parsed.incomes.some((i: IncomeItem) => i.date.startsWith('2026-06'));
          if (!hasJune) {
            const juneIncomes = INITIAL_INCOMES.filter((i) => i.date.startsWith('2026-06'));
            return [...parsed.incomes, ...juneIncomes];
          }
          return parsed.incomes;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INCOMES;
  });

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.todos) && parsed.todos.length > 0) {
          return parsed.todos;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TODOS;
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.schedules) && parsed.schedules.length > 0) {
          return parsed.schedules;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SCHEDULES;
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.subscriptions)) {
          return parsed.subscriptions;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SUBS;
  });

  const [wishes, setWishes] = useState<WishItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.wishes)) {
          return parsed.wishes;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WISHES;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings) {
          return { ...INITIAL_SETTINGS, ...parsed.settings };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SETTINGS;
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    try {
      const payload = {
        expenses,
        incomes,
        todos,
        schedules,
        subscriptions,
        wishes,
        settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [expenses, incomes, todos, schedules, subscriptions, wishes, settings]);

  // Handlers for month navigation (e.g. 2026-06 <-> 2026-07 <-> 2026-08)
  const handleChangeMonth = (delta: number) => {
    const [yearStr, monthStr] = currentMonth.split('-');
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) + delta;

    if (month < 1) {
      month = 12;
      year -= 1;
    } else if (month > 12) {
      month = 1;
      year += 1;
    }

    setCurrentMonth(`${year}-${String(month).padStart(2, '0')}`);
  };

  // Add Expense
  const handleAddExpense = (item: Omit<ExpenseItem, 'id'>) => {
    const newItem: ExpenseItem = {
      ...item,
      id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setExpenses((prev) => [newItem, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Add Income
  const handleAddIncome = (item: Omit<IncomeItem, 'id'>) => {
    const newItem: IncomeItem = {
      ...item,
      id: `inc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setIncomes((prev) => [newItem, ...prev]);
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  // Todo Handlers
  const handleAddTodo = (todo: Omit<TodoItem, 'id' | 'createdAt'>) => {
    const newTodo: TodoItem = {
      ...todo,
      id: `todo-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Schedule Handlers
  const handleAddSchedule = (schedule: Omit<ScheduleItem, 'id'>) => {
    const newSch: ScheduleItem = {
      ...schedule,
      id: `sch-${Date.now()}`,
    };
    setSchedules((prev) => [...prev, newSch]);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  // Subscriptions & Wishes Handlers
  const handleAddSub = (sub: Omit<SubscriptionItem, 'id'>) => {
    setSubscriptions((prev) => [...prev, { ...sub, id: `sub-${Date.now()}` }]);
  };

  const handleDeleteSub = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddWish = (wish: Omit<WishItem, 'id'>) => {
    setWishes((prev) => [...prev, { ...wish, id: `wish-${Date.now()}` }]);
  };

  const handleDeleteWish = (id: string) => {
    setWishes((prev) => prev.filter((w) => w.id !== id));
  };

  // Reset and Reload Sample Handlers
  const handleResetData = () => {
    setExpenses([]);
    setIncomes([]);
    setTodos([]);
    setSchedules([]);
    setSubscriptions([]);
    setWishes([]);
  };

  const handleLoadSampleData = () => {
    setExpenses(INITIAL_EXPENSES);
    setIncomes(INITIAL_INCOMES);
    setTodos(INITIAL_TODOS);
    setSchedules(INITIAL_SCHEDULES);
    setSubscriptions(INITIAL_SUBS);
    setWishes(INITIAL_WISHES);
    setSettings(INITIAL_SETTINGS);
  };

  const uncompletedTodoCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#f3f7f4] flex flex-col md:flex-row text-[#1f2924]">
      {/* 1. Desktop Left Sidebar Navigation */}
      <div className="hidden md:block">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          openRecordModal={() => setIsRecordModalOpen(true)}
          todoCount={uncompletedTodoCount}
          userName={settings.userName}
        />
      </div>

      {/* 2. Mobile Top Bar with Drawer Toggle */}
      <div className="md:hidden bg-white border-b border-[#e1eae1] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1c4e3f] flex items-center justify-center text-white">
            <Home className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-[#162e22]">家計</span>
            <span className="text-[10px] text-[#6e8576] ml-1.5 font-medium">
              暮らしに、見通しを。
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="p-2 rounded-xl bg-[#1c4e3f] text-white shadow-xs cursor-pointer"
            title="記録する"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-[#dce7dd] text-[#1c4e3f] hover:bg-[#f2f7f2] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex">
          <div className="w-64 bg-white h-full flex flex-col justify-between p-4 shadow-2xl">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setMobileMenuOpen(false);
              }}
              openRecordModal={() => {
                setIsRecordModalOpen(true);
                setMobileMenuOpen(false);
              }}
              todoCount={uncompletedTodoCount}
              userName={settings.userName}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* 3. Main Content View Area */}
      <main className="flex-1 min-w-0 pb-20 md:pb-8 overflow-y-auto">
        {currentTab === 'dashboard' && (
          <DashboardView
            incomes={incomes}
            expenses={expenses}
            currentMonth={currentMonth}
            onChangeMonth={handleChangeMonth}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenRecordModal={() => setIsRecordModalOpen(true)}
            onOpenAllTransactions={() => setCurrentTab('kakeibo')}
            settings={settings}
          />
        )}

        {currentTab === 'kakeibo' && (
          <KakeiboView
            incomes={incomes}
            expenses={expenses}
            subscriptions={subscriptions}
            wishes={wishes}
            settings={settings}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddIncome={handleAddIncome}
            onDeleteIncome={handleDeleteIncome}
            onAddSub={handleAddSub}
            onDeleteSub={handleDeleteSub}
            onAddWish={handleAddWish}
            onDeleteWish={handleDeleteWish}
            onUpdateSettings={(newSettings) =>
              setSettings((prev) => ({ ...prev, ...newSettings }))
            }
            onResetData={handleResetData}
            onLoadSampleData={handleLoadSampleData}
          />
        )}

        {currentTab === 'todo' && (
          <TodoView
            todos={todos}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarView
            schedules={schedules}
            expenses={expenses}
            onAddSchedule={handleAddSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        )}
      </main>

      {/* 4. Bottom Tab Navigation Bar (Visible on mobile screens, matches the bottom navigation bar in the reference image) */}
      <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#d6e5d8] shadow-lg shadow-[#1c4e3f]/10 flex items-center gap-7">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            currentTab === 'dashboard'
              ? 'text-[#1c4e3f] font-bold'
              : 'text-[#6e8576]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">ホーム</span>
        </button>

        <button
          onClick={() => setCurrentTab('calendar')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            currentTab === 'calendar'
              ? 'text-[#1c4e3f] font-bold'
              : 'text-[#6e8576]'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">カレンダー</span>
        </button>

        <button
          onClick={() => setCurrentTab('kakeibo')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            currentTab === 'kakeibo'
              ? 'text-[#1c4e3f] font-bold'
              : 'text-[#6e8576]'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">家計簿</span>
        </button>
      </div>

      {/* 5. Quick Record Modal */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onAddExpense={handleAddExpense}
        onAddIncome={handleAddIncome}
      />
    </div>
  );
}
