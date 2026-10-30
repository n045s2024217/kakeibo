import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  Wallet,
} from 'lucide-react';
import { ExpenseItem, ScheduleItem } from '../types';

interface CalendarViewProps {
  schedules: ScheduleItem[];
  expenses: ExpenseItem[];
  onAddSchedule: (schedule: Omit<ScheduleItem, 'id'>) => void;
  onDeleteSchedule: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  schedules,
  expenses,
  onAddSchedule,
  onDeleteSchedule,
}) => {
  // Calendar current view year and month (default July 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 0-indexed: 6 = July
  const [selectedDate, setSelectedDate] = useState('2026-07-12');
  const [newScheduleText, setNewScheduleText] = useState('');

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Days in month
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  // Calendar cells generation
  const cells: {
    day: number;
    dateStr: string;
    isCurrentMonth: boolean;
  }[] = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek; i > 0; i--) {
    const day = prevMonthDays - i + 1;
    const m = currentMonth === 0 ? 12 : currentMonth;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({ day, dateStr, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
      d
    ).padStart(2, '0')}`;
    cells.push({ day: d, dateStr, isCurrentMonth: true });
  }

  // Next month leading days to complete full grid
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const m = currentMonth === 11 ? 1 : currentMonth + 2;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    cells.push({ day: i, dateStr, isCurrentMonth: false });
  }

  // Schedules and expenses on selected date
  const selectedSchedules = schedules.filter((s) => s.date === selectedDate);
  const selectedExpenses = expenses.filter((e) => e.date === selectedDate);
  const selectedDayTotalExpense = selectedExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleText.trim()) return;

    onAddSchedule({
      date: selectedDate,
      text: newScheduleText.trim(),
    });

    setNewScheduleText('');
  };

  return (
    <div className="max-w-[1180px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2ede3]">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#2e6d50] uppercase">
            SCHEDULE & EXPENSE CALENDAR
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162e22]">
            カレンダー
          </h2>
          <p className="text-xs text-[#6e8576] mt-0.5">
            日々の予定と、支出が発生した日付をワンビューで把握できます
          </p>
        </div>
      </div>

      {/* Calendar Controls & Grid */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#e1eae1] shadow-xs">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={handlePrevMonth}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#dce7dd] hover:bg-[#edf5ee] text-xs font-bold text-[#1c4e3f] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>前月</span>
          </button>

          <h3 className="text-lg sm:text-xl font-bold text-[#162e22]">
            {currentYear}年 {currentMonth + 1}月
          </h3>

          <button
            onClick={handleNextMonth}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#dce7dd] hover:bg-[#edf5ee] text-xs font-bold text-[#1c4e3f] transition-colors cursor-pointer"
          >
            <span>翌月</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-[#6e8576] mb-2 pb-2 border-b border-[#f0f4ef]">
          {weekdays.map((w, index) => (
            <div
              key={w}
              className={
                index === 0
                  ? 'text-[#ba524b]'
                  : index === 6
                  ? 'text-[#3572a5]'
                  : ''
              }
            >
              {w}
            </div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((cell) => {
            const isSelected = cell.dateStr === selectedDate;
            const daySchedules = schedules.filter((s) => s.date === cell.dateStr);
            const dayExpenses = expenses.filter((e) => e.date === cell.dateStr);
            const dayExpenseTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

            return (
              <div
                key={cell.dateStr}
                onClick={() => setSelectedDate(cell.dateStr)}
                className={`min-h-[86px] sm:min-h-[96px] p-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? 'bg-[#fcfdfc] text-[#a4b5aa] border-[#edf3ed]'
                    : isSelected
                    ? 'bg-[#eaf4ec] border-[#1c4e3f] shadow-xs'
                    : 'bg-white border-[#e3ebe2] hover:border-[#b8d4bf] hover:bg-[#fbfdfb]'
                }`}
              >
                {/* Day number */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isSelected
                        ? 'text-[#1c4e3f] font-extrabold'
                        : cell.isCurrentMonth
                        ? 'text-[#162e22]'
                        : 'text-[#9cb0a2]'
                    }`}
                  >
                    {cell.day}
                  </span>

                  {daySchedules.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c4e3f] inline-block" />
                  )}
                </div>

                {/* Day badges */}
                <div className="space-y-1 mt-1">
                  {daySchedules.slice(0, 1).map((s) => (
                    <div
                      key={s.id}
                      className="text-[10px] font-semibold text-[#1c4e3f] bg-[#e1f0e4] px-1.5 py-0.5 rounded truncate"
                    >
                      {s.text}
                    </div>
                  ))}

                  {dayExpenseTotal > 0 && (
                    <div className="text-[10px] font-extrabold text-[#9a423a] bg-[#fae8e6] px-1.5 py-0.5 rounded truncate tabular-nums">
                      ¥{dayExpenseTotal.toLocaleString('ja-JP')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Panel */}
      <div className="bg-white rounded-3xl p-6 border border-[#e1eae1] shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0f4ef]">
          <h3 className="text-base sm:text-lg font-bold text-[#162e22]">
            選択日詳細: <span className="text-[#1c4e3f] font-extrabold">{selectedDate}</span>
          </h3>

          {selectedDayTotalExpense > 0 && (
            <div className="text-xs font-bold text-[#8d3c36]">
              この日の合計支出: ¥{selectedDayTotalExpense.toLocaleString('ja-JP')}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schedules for the day */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#446150] flex items-center gap-1.5">
              <span>📌 この日の予定</span>
              <span className="text-[#789080]">({selectedSchedules.length}件)</span>
            </h4>

            <div className="space-y-2">
              {selectedSchedules.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#f9fbf9] border border-[#e8f0e8] text-xs text-[#789080] text-center">
                  登録された予定はありません。
                </div>
              ) : (
                selectedSchedules.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#f9fbf9] border border-[#e3eee4]"
                  >
                    <span className="text-xs font-bold text-[#162e22]">
                      {s.text}
                    </span>
                    <button
                      onClick={() => onDeleteSchedule(s.id)}
                      className="p-1 text-[#b55852] hover:bg-[#fae8e6] rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add schedule input */}
            <form onSubmit={handleAddSchedule} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newScheduleText}
                onChange={(e) => setNewScheduleText(e.target.value)}
                placeholder="新しい予定を入力..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-xs text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1c4e3f] hover:bg-[#153e32] text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                追加
              </button>
            </form>
          </div>

          {/* Expenses on this day */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#446150] flex items-center gap-1.5">
              <span>💴 この日の支出記録</span>
              <span className="text-[#789080]">({selectedExpenses.length}件)</span>
            </h4>

            <div className="space-y-2">
              {selectedExpenses.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#f9fbf9] border border-[#e8f0e8] text-xs text-[#789080] text-center">
                  この日の支出記録はありません。
                </div>
              ) : (
                selectedExpenses.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#f9fbf9] border border-[#e3eee4]"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#162e22]">
                        {e.title}
                      </div>
                      <div className="text-[10px] text-[#789080]">
                        [{e.category}] {e.time || ''}
                      </div>
                    </div>
                    <div className="text-xs font-extrabold text-[#8d3c36] tabular-nums">
                      −¥{e.amount.toLocaleString('ja-JP')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
