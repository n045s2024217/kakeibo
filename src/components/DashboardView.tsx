import React from 'react';
import {
  Home,
  User,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Utensils,
  Coffee,
  Train,
  ShoppingBag,
  Lightbulb,
  CheckSquare,
  Calendar,
  Wallet,
  Building,
  Plus,
} from 'lucide-react';
import { ExpenseItem, IncomeItem, NavTab, AppSettings } from '../types';

interface DashboardViewProps {
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  currentMonth: string; // e.g. "2026-07"
  onChangeMonth: (delta: number) => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenRecordModal: () => void;
  onOpenAllTransactions: () => void;
  settings?: AppSettings;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  incomes,
  expenses,
  currentMonth,
  onChangeMonth,
  onNavigateTab,
  onOpenRecordModal,
  onOpenAllTransactions,
  settings,
}) => {
  // Extract month display text e.g. "7月の家計"
  const [yearStr, monthStr] = currentMonth.split('-');
  const yearNum = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);
  const monthTitle = `${monthNum}月の家計`;

  // Calculate previous month string (e.g. 2026-07 -> 2026-06, 2026-01 -> 2025-12)
  const prevDate = new Date(yearNum, monthNum - 2, 1);
  const prevYear = prevDate.getFullYear();
  const prevMonthNum = prevDate.getMonth() + 1;
  const prevMonthStr = `${prevYear}-${String(prevMonthNum).padStart(2, '0')}`;

  // Calculate current month's totals
  const currentMonthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const currentMonthIncomes = incomes.filter((i) => i.date.startsWith(currentMonth));

  const totalIncome = currentMonthIncomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = currentMonthExpenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpense;

  // Calculate previous month's totals
  const prevMonthExpenses = expenses.filter((e) => e.date.startsWith(prevMonthStr));
  const prevMonthIncomes = incomes.filter((i) => i.date.startsWith(prevMonthStr));

  const prevTotalIncome = prevMonthIncomes.reduce((sum, item) => sum + item.amount, 0);
  const prevTotalExpense = prevMonthExpenses.reduce((sum, item) => sum + item.amount, 0);
  const prevBalance = prevTotalIncome - prevTotalExpense;

  const hasPrevData = prevMonthExpenses.length > 0 || prevMonthIncomes.length > 0;

  // Month-over-month differences
  const balanceDiff = balance - prevBalance;
  const incomeDiff = totalIncome - prevTotalIncome;

  // Format month-over-month difference text
  const formatDiffText = (diff: number, hasData: boolean) => {
    if (!hasData) return '前月データなし';
    if (diff > 0) return `先月より +¥${diff.toLocaleString('ja-JP')}`;
    if (diff < 0) return `先月より -¥${Math.abs(diff).toLocaleString('ja-JP')}`;
    return '先月と同額 (±¥0)';
  };

  // Budget calculations
  const monthlyBudget = settings?.monthlyBudget || 290000;
  const budgetRatio = monthlyBudget > 0 ? Math.round((totalExpense / monthlyBudget) * 100) : 0;
  const expenseRatio = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
  // Circular ring progress (calculated from budget health)
  const ringProgress = Math.min(Math.max(0, Math.round(100 - budgetRatio)), 100);

  // Category Breakdown for the current month
  const categoryMap: Record<string, number> = {};
  currentMonthExpenses.forEach((item) => {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
  });

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Top 3 categories as in the image
  const top3Categories = categoryBreakdown.slice(0, 3);

  // Recent 5 expenses
  const recentExpenses = [...currentMonthExpenses]
    .sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date);
      if (dateCmp !== 0) return dateCmp;
      return (b.time || '').localeCompare(a.time || '');
    })
    .slice(0, 5);

  // Icon mapping for recent expenses
  const getExpenseIconInfo = (category: string) => {
    switch (category) {
      case '食費':
        return {
          icon: Utensils,
          bg: 'bg-[#d8edd9]',
          text: 'text-[#2a7a4f]',
        };
      case 'カフェ':
        return {
          icon: Coffee,
          bg: 'bg-[#fae6db]',
          text: 'text-[#b96839]',
        };
      case '交通':
        return {
          icon: Train,
          bg: 'bg-[#d4ecec]',
          text: 'text-[#297b7b]',
        };
      case '日用品':
        return {
          icon: ShoppingBag,
          bg: 'bg-[#f7dedc]',
          text: 'text-[#b85a54]',
        };
      case '光熱費':
        return {
          icon: Lightbulb,
          bg: 'bg-[#d7f1e7]',
          text: 'text-[#218161]',
        };
      case '住まい':
        return {
          icon: Building,
          bg: 'bg-[#d8eedf]',
          text: 'text-[#26724a]',
        };
      default:
        return {
          icon: Wallet,
          bg: 'bg-[#e2ede4]',
          text: 'text-[#356f4d]',
        };
    }
  };

  // Format date helper for recent expenses e.g. "7月12日 14:32"
  const formatRecentDate = (dateStr: string, timeStr?: string) => {
    const parts = dateStr.split('-');
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const timePart = timeStr ? ` ${timeStr}` : '';
    return `${m}月${d}日${timePart}`;
  };

  return (
    <div className="max-w-[1180px] mx-auto p-4 sm:p-6 lg:p-8 space-y-7">
      {/* 1. Header (Brand, Tagline, User Avatar, Month Flow Title, Prev/Next Arrows) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#1c4e3f] flex items-center justify-center text-white shadow-sm shadow-[#1c4e3f]/25">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#162e22]">
                家計
              </h1>
              <p className="text-xs text-[#6a8072] font-medium">
                暮らしに、見通しを。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenRecordModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#dce6dc] hover:bg-[#f2f7f2] text-xs font-semibold text-[#1c4e3f] shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>記録する</span>
            </button>
            <div className="w-10 h-10 rounded-full border border-[#d6e5d8] bg-white flex items-center justify-center text-[#1c4e3f] shadow-xs">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* MONTHLY FLOW and Large Month Header with Arrows */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] text-[#4a6b58] uppercase">
              MONTHLY FLOW
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#152e22] tracking-tight mt-0.5">
              {monthTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeMonth(-1)}
              title="前月へ"
              className="w-8 h-8 rounded-full border border-[#d5e3d7] bg-white hover:bg-[#edf5ee] flex items-center justify-center text-[#355242] transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeMonth(1)}
              title="翌月へ"
              className="w-8 h-8 rounded-full border border-[#d5e3d7] bg-white hover:bg-[#edf5ee] flex items-center justify-center text-[#355242] transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Main Stats Cards Grid: Left Green Balance Card + Right Stacked Income/Expense Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Large Forest Green Balance Card */}
        <div className="lg:col-span-7 bg-[#1c4e3f] rounded-3xl p-6 sm:p-7 text-white relative overflow-hidden flex flex-col justify-between shadow-lg shadow-[#1c4e3f]/15">
          {/* Subtle Organic Wave Watermark Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-72 pointer-events-none opacity-20 overflow-hidden">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <circle cx="160" cy="100" r="40" />
              <circle cx="160" cy="100" r="70" />
              <circle cx="160" cy="100" r="100" />
              <circle cx="160" cy="100" r="130" />
              <circle cx="160" cy="100" r="160" />
            </svg>
          </div>

          {/* Top content */}
          <div className="relative z-10">
            <div className="text-xs sm:text-sm font-medium text-[#d1e5d9]">
              今月の残高
            </div>
            <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums">
                ¥{balance.toLocaleString('ja-JP')}
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#d1e5d9]">
                円
              </span>
            </div>
            <div className="text-xs text-[#bedcc9] mt-2 flex items-center gap-1.5 flex-wrap">
              <span>{formatDiffText(balanceDiff, hasPrevData)}</span>
              <span className="opacity-60">/</span>
              <span>{balance >= 0 ? '今月の収支は順調です' : '支出が超過傾向です'}</span>
            </div>
          </div>

          {/* Bottom Split Row: Income, Expense, and Circle Meter */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/15 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6 sm:gap-10">
              {/* Income */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#c2dfcd] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#5cd19a] inline-block" />
                  <span>収入</span>
                </div>
                <div className="text-lg sm:text-xl font-bold tracking-tight tabular-nums mt-0.5">
                  ¥{totalIncome.toLocaleString('ja-JP')}
                </div>
                <div className="text-[11px] text-[#9fc7ad] mt-0.5">
                  {formatDiffText(incomeDiff, hasPrevData)}
                </div>
              </div>

              {/* Expense */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#c2dfcd] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#bedcc9] inline-block" />
                  <span>支出</span>
                </div>
                <div className="text-lg sm:text-xl font-bold tracking-tight tabular-nums mt-0.5">
                  ¥{totalExpense.toLocaleString('ja-JP')}
                </div>
                <div className="text-[11px] text-[#9fc7ad] mt-0.5">
                  予算の {budgetRatio}%
                </div>
              </div>
            </div>

            {/* Circular Gauge 68% */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 sm:w-18 sm:h-18 transform -rotate-90">
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  stroke="#57ca96"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray="175.9"
                  strokeDashoffset={175.9 * (1 - ringProgress / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  {ringProgress}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Stacked Income and Expense Cards */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          {/* Top Card: 今月の収入 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e1eae1] shadow-xs hover:border-[#bcd6c1] transition-all flex flex-col justify-between flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2a7b60] inline-block" />
                <span className="text-xs sm:text-sm font-semibold text-[#486353]">
                  今月の収入
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#2a7b60]" />
            </div>

            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#162e22] tracking-tight tabular-nums">
                ¥{totalIncome.toLocaleString('ja-JP')}
              </div>
              <div className="text-xs text-[#758a7d] mt-1 font-medium">
                {formatDiffText(incomeDiff, hasPrevData)}
              </div>
            </div>
          </div>

          {/* Bottom Card: 今月の支出 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e1eae1] shadow-xs hover:border-[#bcd6c1] transition-all flex flex-col justify-between flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#407a5d] inline-block" />
                <span className="text-xs sm:text-sm font-semibold text-[#486353]">
                  今月の支出
                </span>
              </div>
            </div>

            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#162e22] tracking-tight tabular-nums">
                ¥{totalExpense.toLocaleString('ja-JP')}
              </div>
              <div className="text-xs text-[#758a7d] mt-1 font-medium">
                予算の {budgetRatio}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#ebf2ec] h-2 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetRatio > 100
                    ? 'bg-rose-500'
                    : budgetRatio > 85
                    ? 'bg-amber-500'
                    : 'bg-[#247c5d]'
                }`}
                style={{ width: `${Math.min(budgetRatio, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: "最近の支出" (Left) and "支出の内訳" (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: 最近の支出 */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#e1eae1] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f4ef]">
            <h3 className="text-base sm:text-lg font-bold text-[#162e22]">
              最近の支出
            </h3>
            <button
              onClick={onOpenAllTransactions}
              className="text-xs font-semibold text-[#1c4e3f] hover:text-[#11352a] hover:underline cursor-pointer"
            >
              すべて見る
            </button>
          </div>

          <div className="divide-y divide-[#f2f6f2]">
            {recentExpenses.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#7b9182]">
                今月の支出記録はまだありません。
              </div>
            ) : (
              recentExpenses.map((item) => {
                const iconInfo = getExpenseIconInfo(item.category);
                const IconComponent = iconInfo.icon;

                return (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between group hover:bg-[#fbfdfb] rounded-xl px-1.5 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconInfo.bg} ${iconInfo.text}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 truncate">
                        <div className="text-sm font-bold text-[#1f372a] truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-[#7b9182] mt-0.5">
                          {formatRecentDate(item.date, item.time)}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm sm:text-base font-extrabold text-[#1a3325] tabular-nums shrink-0 ml-3">
                      − ¥{item.amount.toLocaleString('ja-JP')}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: 支出の内訳 */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#e1eae1] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f4ef]">
            <h3 className="text-base sm:text-lg font-bold text-[#162e22]">
              支出の内訳
            </h3>
            <span className="text-xs font-semibold text-[#256f4d]">
              上位3項目
            </span>
          </div>

          <div className="space-y-3.5 pt-3">
            {top3Categories.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#7b9182]">
                内訳データがありません。
              </div>
            ) : (
              top3Categories.map((cat) => {
                const iconInfo = getExpenseIconInfo(cat.category);
                const IconComponent = iconInfo.icon;

                return (
                  <div
                    key={cat.category}
                    className="p-3.5 rounded-2xl bg-[#f9fbf9] border border-[#e8f0e8] hover:border-[#cde0d0] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#d8eedf] text-[#226842] flex items-center justify-center">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-[#1b3427]">
                          {cat.category}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-[#162e22] tabular-nums">
                          ¥{cat.amount.toLocaleString('ja-JP')}
                        </div>
                        <div className="text-[11px] text-[#789080] font-medium">
                          {cat.percentage}%
                        </div>
                      </div>
                    </div>

                    {/* Progress pill bar */}
                    <div className="w-full bg-[#e4ede5] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2a7b60] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}

            <button
              onClick={() => onNavigateTab('kakeibo')}
              className="w-full mt-2 py-2 text-center text-xs font-semibold text-[#205e41] hover:text-[#133d2a] hover:underline cursor-pointer block"
            >
              家計簿ですべての内訳を見る →
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: "よく使う機能" (Mint Container with 3 Action Cards) */}
      <div className="bg-[#e9f2eb] rounded-3xl p-6 border border-[#d6e5d8]">
        <div className="flex items-baseline gap-2.5 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-[#162e22]">
            よく使う機能
          </h3>
          <span className="text-xs text-[#5a7765]">
            あなたの生活をもっと便利に
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: やることリスト */}
          <button
            onClick={() => onNavigateTab('todo')}
            className="group bg-white rounded-2xl p-5 border border-[#dce8de] hover:border-[#1c4e3f] hover:shadow-sm text-left transition-all cursor-pointer flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#dcf1e3] text-[#247c5d] flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#162e22] group-hover:text-[#1c4e3f] transition-colors">
                  やることリスト
                </h4>
                <p className="text-xs text-[#6e8576] mt-1 leading-relaxed">
                  やることを整理して、やり忘れを防ぎましょう
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <span className="text-xs font-bold text-[#1c4e3f] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </button>

          {/* Card 2: カレンダー */}
          <button
            onClick={() => onNavigateTab('calendar')}
            className="group bg-white rounded-2xl p-5 border border-[#dce8de] hover:border-[#1c4e3f] hover:shadow-sm text-left transition-all cursor-pointer flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#dcf1e3] text-[#247c5d] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#162e22] group-hover:text-[#1c4e3f] transition-colors">
                  カレンダー
                </h4>
                <p className="text-xs text-[#6e8576] mt-1 leading-relaxed">
                  予定や支出をまとめて管理できます
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <span className="text-xs font-bold text-[#1c4e3f] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </button>

          {/* Card 3: 家計簿 */}
          <button
            onClick={() => onNavigateTab('kakeibo')}
            className="group bg-white rounded-2xl p-5 border border-[#dce8de] hover:border-[#1c4e3f] hover:shadow-sm text-left transition-all cursor-pointer flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#dcf1e3] text-[#247c5d] flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#162e22] group-hover:text-[#1c4e3f] transition-colors">
                  家計簿
                </h4>
                <p className="text-xs text-[#6e8576] mt-1 leading-relaxed">
                  収入・支出を記録して家計を見える化しましょう
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <span className="text-xs font-bold text-[#1c4e3f] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
