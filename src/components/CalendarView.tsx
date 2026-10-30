import React, { useState, useMemo } from 'react';
import { Transaction, Category, TodoItem } from '../types';
import { formatCurrency, getPaymentMethodLabel } from '../utils/formatters';
import {
  JAPANESE_WEEKDAYS,
  getDaysInMonth,
  getFirstDayOfWeek,
  formatDateWithWeekday,
} from '../utils/dateUtils';
import { CategoryIcon } from './CategoryIcon';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
} from 'lucide-react';

interface CalendarViewProps {
  currentMonth: string; // YYYY-MM
  transactions: Transaction[];
  categories: Category[];
  todos: TodoItem[];
  onOpenAddModalForDate: (date: string) => void;
  onDeleteTransaction: (id: string) => void;
  onToggleTodo: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentMonth,
  transactions,
  categories,
  todos,
  onOpenAddModalForDate,
  onDeleteTransaction,
  onToggleTodo,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(`${currentMonth}-01`);

  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const [year, month] = currentMonth.split('-').map(Number);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);

  // Group transactions by day
  const dailyData = useMemo(() => {
    const data: { [day: number]: { expense: number; income: number; count: number } } = {};
    transactions.forEach((tx) => {
      const [y, m, d] = tx.date.split('-').map(Number);
      if (y === year && m === month) {
        if (!data[d]) {
          data[d] = { expense: 0, income: 0, count: 0 };
        }
        if (tx.type === 'expense') {
          data[d].expense += tx.amount;
        } else {
          data[d].income += tx.amount;
        }
        data[d].count += 1;
      }
    });
    return data;
  }, [transactions, year, month]);

  // Group todos by day
  const dailyTodos = useMemo(() => {
    const data: { [day: number]: TodoItem[] } = {};
    todos.forEach((todo) => {
      const [y, m, d] = todo.dueDate.split('-').map(Number);
      if (y === year && m === month) {
        if (!data[d]) {
          data[d] = [];
        }
        data[d].push(todo);
      }
    });
    return data;
  }, [todos, year, month]);

  // Selected day items
  const selectedDayTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.date === selectedDate)
      .sort((a, b) => (b.type === 'expense' ? 1 : -1));
  }, [transactions, selectedDate]);

  const selectedDayTodos = useMemo(() => {
    return todos.filter((t) => t.dueDate === selectedDate);
  }, [todos, selectedDate]);

  const selectedDayExpense = selectedDayTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const selectedDayIncome = selectedDayTransactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  // Build grid calendar cells
  const blanks = Array.from({ length: firstDayOfWeek });
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Calendar Grid Section */}
      <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-700" />
              <span>収支カレンダー</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">日ごとの出費・収入・やることの予定</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-300"></span>
              支出
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300"></span>
              収入
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              タスク
            </span>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs py-2 border-b border-stone-200">
          {JAPANESE_WEEKDAYS.map((day, idx) => (
            <div
              key={day}
              className={`${
                idx === 0 ? 'text-rose-600' : idx === 6 ? 'text-blue-600' : 'text-stone-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 pt-2">
          {blanks.map((_, idx) => (
            <div key={`blank-${idx}`} className="h-20 sm:h-24 bg-stone-50/40 rounded-xl" />
          ))}

          {dayNumbers.map((day) => {
            const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            const dayOfWeek = new Date(year, month - 1, day).getDay();
            const dayInfo = dailyData[day];
            const tasks = dailyTodos[day];

            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;

            return (
              <button
                key={`day-${day}`}
                onClick={() => setSelectedDate(dateStr)}
                className={`h-20 sm:h-24 p-1.5 rounded-xl border text-left flex flex-col justify-between transition relative overflow-hidden group ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-600/20'
                    : 'border-stone-200/80 bg-white hover:border-emerald-300 hover:bg-stone-50/70'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : isSunday
                        ? 'text-rose-600'
                        : isSaturday
                        ? 'text-blue-600'
                        : 'text-stone-700'
                    }`}
                  >
                    {day}
                  </span>

                  {tasks && tasks.length > 0 && (
                    <span
                      className="w-2 h-2 rounded-full bg-amber-500"
                      title={`${tasks.length}件のやること`}
                    />
                  )}
                </div>

                {/* Badges for income/expense */}
                <div className="space-y-0.5 w-full">
                  {dayInfo?.income > 0 && (
                    <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50/90 rounded px-1 truncate">
                      +{formatCurrency(dayInfo.income)}
                    </div>
                  )}
                  {dayInfo?.expense > 0 && (
                    <div className="text-[10px] sm:text-[11px] font-semibold text-rose-600 bg-rose-50/90 rounded px-1 truncate">
                      -{formatCurrency(dayInfo.expense)}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Sidebar */}
      <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                選択日の明細
              </span>
              <h3 className="text-base font-bold text-stone-900 mt-0.5">
                {formatDateWithWeekday(selectedDate)}
              </h3>
            </div>
            <button
              onClick={() => onOpenAddModalForDate(selectedDate)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/70 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              この日に追加
            </button>
          </div>

          {/* Daily total summary */}
          <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-stone-50 rounded-xl text-xs">
            <div>
              <span className="text-stone-500">支出合計</span>
              <div className="text-sm font-bold text-stone-900">
                {selectedDayExpense > 0 ? formatCurrency(selectedDayExpense) : '¥0'}
              </div>
            </div>
            <div>
              <span className="text-stone-500">収入合計</span>
              <div className="text-sm font-bold text-emerald-700">
                {selectedDayIncome > 0 ? formatCurrency(selectedDayIncome) : '¥0'}
              </div>
            </div>
          </div>

          {/* Day's Todos */}
          {selectedDayTodos.length > 0 && (
            <div className="mb-4">
              <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                本日期日のやること ({selectedDayTodos.length})
              </span>
              <div className="space-y-1.5">
                {selectedDayTodos.map((todo) => (
                  <div
                    key={todo.id}
                    onClick={() => onToggleTodo(todo.id)}
                    className="flex items-start gap-2 p-2 rounded-lg border border-amber-100 bg-amber-50/50 cursor-pointer hover:bg-amber-50 transition"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs">
                      <p
                        className={`font-medium ${
                          todo.completed ? 'line-through text-stone-400' : 'text-stone-800'
                        }`}
                      >
                        {todo.title}
                      </p>
                      {todo.amount && (
                        <span className="text-[11px] font-semibold text-emerald-700">
                          {formatCurrency(todo.amount)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions list on this day */}
          <div>
            <span className="text-xs font-bold text-stone-600 mb-2 block">
              記録された収支 ({selectedDayTransactions.length})
            </span>

            {selectedDayTransactions.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs border border-dashed border-stone-200 rounded-xl">
                この日の収支記録はありません。
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {selectedDayTransactions.map((tx) => {
                  const cat = categoryMap.get(tx.categoryId);
                  const isExpense = tx.type === 'expense';

                  return (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded-xl border border-stone-100 hover:border-stone-200 bg-white transition group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: cat?.bgColor || '#f3f4f6',
                            color: cat?.color || '#4b5563',
                          }}
                        >
                          <CategoryIcon name={cat?.icon || 'Tag'} className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-stone-800">
                            {cat?.name || 'その他'}
                          </div>
                          {tx.memo && (
                            <div className="text-[11px] text-stone-500 line-clamp-1">{tx.memo}</div>
                          )}
                          <span className="text-[10px] text-stone-400">
                            {getPaymentMethodLabel(tx.paymentMethod)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold flex items-center justify-end ${
                              isExpense ? 'text-stone-900' : 'text-emerald-700'
                            }`}
                          >
                            {isExpense ? (
                              <ArrowDownRight className="w-3 h-3 text-stone-400" />
                            ) : (
                              <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                            )}
                            {isExpense ? formatCurrency(tx.amount) : `+${formatCurrency(tx.amount)}`}
                          </span>
                        </div>
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 rounded transition"
                          title="削除"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
