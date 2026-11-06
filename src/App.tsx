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
  UserProfile,
} from './types';
import {
  INITIAL_EXPENSES,
  INITIAL_INCOMES,
  INITIAL_TODOS,
  INITIAL_SCHEDULES,
  INITIAL_SUBS,
  INITIAL_WISHES,
  INITIAL_SETTINGS,
  INITIAL_USERS,
  getCurrentYearMonthString,
  getPreviousYearMonthString,
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { KakeiboView } from './components/KakeiboView';
import { TodoView } from './components/TodoView';
import { CalendarView } from './components/CalendarView';
import { RecordModal } from './components/RecordModal';
import { UserManagementModal } from './components/UserManagementModal';

const STORAGE_KEY = 'kakeibo_app_data_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    return getCurrentYearMonthString();
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // App Data States with legacy normalization & deleted user pruning
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const curYM = getCurrentYearMonthString();
    const prevYM = getPreviousYearMonthString(curYM);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedUsers = parsed.settings?.users || INITIAL_USERS;
        const validIds = new Set(savedUsers.map((u: any) => u.id));

        if (Array.isArray(parsed.expenses) && parsed.expenses.length > 0) {
          // Attribute user ID to legacy items and discard any items belonging to deleted users
          const normalized = parsed.expenses
            .map((e: ExpenseItem) => {
              if (!e.userId) {
                if (['exp-2', 'exp-4', 'exp-9', 'exp-12'].includes(e.id)) {
                  return { ...e, userId: 'user-2' };
                }
                return { ...e, userId: 'user-1' };
              }
              return e;
            })
            .filter((e: ExpenseItem) => {
              if (e.userId && !validIds.has(e.userId)) {
                return false;
              }
              return true;
            });

          const hasCurrentMonth = normalized.some((e: ExpenseItem) => e.date.startsWith(curYM));
          if (!hasCurrentMonth) {
            const currentDemoExpenses = INITIAL_EXPENSES
              .filter((e) => validIds.has(e.userId))
              .filter((e) => e.date.startsWith(curYM) || e.date.startsWith(prevYM));
            return [...normalized, ...currentDemoExpenses];
          }
          return normalized;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EXPENSES;
  });

  const [incomes, setIncomes] = useState<IncomeItem[]>(() => {
    const curYM = getCurrentYearMonthString();
    const prevYM = getPreviousYearMonthString(curYM);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedUsers = parsed.settings?.users || INITIAL_USERS;
        const validIds = new Set(savedUsers.map((u: any) => u.id));

        if (Array.isArray(parsed.incomes) && parsed.incomes.length > 0) {
          const normalized = parsed.incomes
            .map((i: IncomeItem) => {
              if (!i.userId) {
                return { ...i, userId: 'user-1' };
              }
              return i;
            })
            .filter((i: IncomeItem) => {
              if (i.userId && !validIds.has(i.userId)) {
                return false;
              }
              return true;
            });

          const hasCurrentMonth = normalized.some((i: IncomeItem) => i.date.startsWith(curYM));
          if (!hasCurrentMonth) {
            const currentDemoIncomes = INITIAL_INCOMES
              .filter((i) => validIds.has(i.userId))
              .filter((i) => i.date.startsWith(curYM) || i.date.startsWith(prevYM));
            return [...normalized, ...currentDemoIncomes];
          }
          return normalized;
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
          const loaded: AppSettings = { ...INITIAL_SETTINGS, ...parsed.settings };
          // Ensure users list is populated
          if (!Array.isArray(loaded.users) || loaded.users.length === 0) {
            loaded.users = INITIAL_SETTINGS.users;
          }
          if (!loaded.currentUserId) {
            loaded.currentUserId = 'all';
          }
          return loaded;
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

  // Auto-clean: whenever settings.users updates, immediately purge any orphaned records belonging to removed users
  useEffect(() => {
    const validUserIds = new Set(settings.users.map((u) => u.id));

    setExpenses((prev) => {
      const cleaned = prev.filter((item) => {
        const effectiveUserId =
          item.userId || (['exp-2', 'exp-4', 'exp-9', 'exp-12'].includes(item.id) ? 'user-2' : 'user-1');
        return validUserIds.has(effectiveUserId);
      });
      return cleaned.length !== prev.length ? cleaned : prev;
    });

    setIncomes((prev) => {
      const cleaned = prev.filter((item) => {
        const effectiveUserId = item.userId || 'user-1';
        return validUserIds.has(effectiveUserId);
      });
      return cleaned.length !== prev.length ? cleaned : prev;
    });

    setTodos((prev) => {
      const cleaned = prev.filter((item) => {
        if (item.userId && !validUserIds.has(item.userId)) {
          return false;
        }
        return true;
      });
      return cleaned.length !== prev.length ? cleaned : prev;
    });

    setSchedules((prev) => {
      const cleaned = prev.filter((item) => {
        if (item.userId && !validUserIds.has(item.userId)) {
          return false;
        }
        return true;
      });
      return cleaned.length !== prev.length ? cleaned : prev;
    });

    setSubscriptions((prev) => {
      const cleaned = prev.filter((item) => {
        if (item.userId && !validUserIds.has(item.userId)) {
          return false;
        }
        return true;
      });
      return cleaned.length !== prev.length ? cleaned : prev;
    });

    setWishes((prev) => {
      const cleaned = prev.filter((item) => {
        if (item.userId && !validUserIds.has(item.userId)) {
          return false;
        }
        return true;
      });
      return cleaned.length !== prev.length ? cleaned : prev;
    });
  }, [settings.users]);


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

  // Multi-user management handlers
  const handleSelectUser = (userId: string) => {
    setSettings((prev) => ({
      ...prev,
      currentUserId: userId,
      userName:
        userId === 'all'
          ? prev.userName
          : prev.users.find((u) => u.id === userId)?.name || prev.userName,
    }));
  };

  const handleAddUser = (user: Omit<UserProfile, 'id'>) => {
    const newUser: UserProfile = {
      ...user,
      id: `user-${Date.now()}`,
    };
    setSettings((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUserId: newUser.id,
      userName: newUser.name,
    }));
  };

  const handleUpdateUser = (id: string, updates: Partial<UserProfile>) => {
    setSettings((prev) => {
      const updatedUsers = prev.users.map((u) =>
        u.id === id ? { ...u, ...updates } : u
      );
      const activeName =
        id === prev.currentUserId && updates.name ? updates.name : prev.userName;
      return {
        ...prev,
        users: updatedUsers,
        userName: activeName,
      };
    });
  };

  const handleDeleteUser = (id: string) => {
    if (settings.users.length <= 1) return;
    const remainingUsers = settings.users.filter((u) => u.id !== id);
    const remainingIds = new Set(remainingUsers.map((u) => u.id));

    // 1. Remove user from settings & update active user selection
    setSettings((prev) => {
      const remaining = prev.users.filter((u) => u.id !== id);
      if (remaining.length === 0) return prev;
      const newActiveId = prev.currentUserId === id ? 'all' : prev.currentUserId;
      return {
        ...prev,
        users: remaining,
        currentUserId: newActiveId,
        userName: remaining[0]?.name || prev.userName,
      };
    });

    // 2. Cascade delete all related expenses, incomes, todos, schedules, subs, wishes
    setExpenses((prev) =>
      prev.filter((item) => {
        const effectiveUserId =
          item.userId || (['exp-2', 'exp-4', 'exp-9', 'exp-12'].includes(item.id) ? 'user-2' : 'user-1');
        return effectiveUserId !== id && remainingIds.has(effectiveUserId);
      })
    );

    setIncomes((prev) =>
      prev.filter((item) => {
        const effectiveUserId = item.userId || 'user-1';
        return effectiveUserId !== id && remainingIds.has(effectiveUserId);
      })
    );

    setTodos((prev) =>
      prev.filter((item) => {
        if (item.userId) return item.userId !== id && remainingIds.has(item.userId);
        return true;
      })
    );

    setSchedules((prev) =>
      prev.filter((item) => {
        if (item.userId) return item.userId !== id && remainingIds.has(item.userId);
        return true;
      })
    );

    setSubscriptions((prev) =>
      prev.filter((item) => {
        if (item.userId) return item.userId !== id && remainingIds.has(item.userId);
        return true;
      })
    );

    setWishes((prev) =>
      prev.filter((item) => {
        if (item.userId) return item.userId !== id && remainingIds.has(item.userId);
        return true;
      })
    );
  };


  const uncompletedTodoCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f3f7f4] flex flex-col md:flex-row text-[#1f2924]">
      {/* 1. Desktop Left Sidebar Navigation - Fixed & Sticky */}
      <div className="hidden md:block shrink-0 h-screen sticky top-0 z-30">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          openRecordModal={() => setIsRecordModalOpen(true)}
          todoCount={uncompletedTodoCount}
          settings={settings}
          onSelectUser={handleSelectUser}
          onOpenUserModal={() => setIsUserModalOpen(true)}
          currentMonth={currentMonth}
        />
      </div>

      {/* 2. Mobile Top Bar with Drawer Toggle - Sticky at Top */}
      <div className="md:hidden shrink-0 bg-white/95 backdrop-blur-md border-b border-[#e1eae1] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1c4e3f] flex items-center justify-center text-white shadow-xs">
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
            className="p-2 rounded-xl bg-[#1c4e3f] text-white shadow-xs cursor-pointer active:scale-95 transition-transform"
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
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex animate-in fade-in duration-200">
          <div className="w-64 bg-white h-full flex flex-col justify-between shadow-2xl">
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
              settings={settings}
              onSelectUser={(userId) => {
                handleSelectUser(userId);
                setMobileMenuOpen(false);
              }}
              onOpenUserModal={() => {
                setIsUserModalOpen(true);
                setMobileMenuOpen(false);
              }}
              currentMonth={currentMonth}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* 3. Main Content View Area - Scrollable Independently */}
      <main className="flex-1 min-w-0 h-full pb-24 md:pb-8 overflow-y-auto">
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
            onOpenUserModal={() => setIsUserModalOpen(true)}
            onSelectUser={handleSelectUser}
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
            onOpenUserModal={() => setIsUserModalOpen(true)}
            onSelectUser={handleSelectUser}
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

      {/* 4. Bottom Tab Navigation Bar (Visible on mobile screens, pinned persistently) */}
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
        users={settings.users}
        defaultUserId={settings.currentUserId}
      />

      {/* 6. User Management Modal */}
      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        users={settings.users}
        currentUserId={settings.currentUserId}
        onSelectUser={handleSelectUser}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}
