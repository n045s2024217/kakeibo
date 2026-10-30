import React from 'react';
import {
  Home,
  Wallet,
  CheckSquare,
  Calendar,
  PlusCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  openRecordModal: () => void;
  todoCount: number;
  userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  openRecordModal,
  todoCount,
  userName,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'ホーム',
      sublabel: '7月の家計',
      icon: Home,
    },
    {
      id: 'kakeibo' as NavTab,
      label: '家計簿',
      sublabel: '収支・内訳・診断',
      icon: Wallet,
    },
    {
      id: 'todo' as NavTab,
      label: 'やることリスト',
      sublabel: 'タスク・買い物',
      icon: CheckSquare,
      badge: todoCount > 0 ? todoCount : undefined,
    },
    {
      id: 'calendar' as NavTab,
      label: 'カレンダー',
      sublabel: '予定と日別支出',
      icon: Calendar,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#ffffff] border-r border-[#e3ebe2] flex flex-col min-h-screen select-none">
      {/* Brand Header */}
      <div className="p-6 pb-5 border-b border-[#edf3ec]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1c4e3f] flex items-center justify-center text-white shadow-sm shadow-[#1c4e3f]/20">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#162e22] leading-tight">
              家計
            </h1>
            <p className="text-xs text-[#6e8275] font-medium tracking-tight">
              暮らしに、見通しを。
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="px-4 pt-4">
        <button
          onClick={openRecordModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1c4e3f] hover:bg-[#163e32] text-white font-semibold text-sm transition-all shadow-sm shadow-[#1c4e3f]/20 active:scale-[0.98] cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>収支を記録する</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-[#7e9185] uppercase">
          メインメニュー
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#eaf3ec] text-[#1c4e3f] font-bold shadow-xs'
                  : 'text-[#445b4e] hover:bg-[#f4f8f4] hover:text-[#1c4e3f] font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-[#1c4e3f] text-white shadow-xs'
                      : 'bg-[#edf4ee] text-[#557161]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-sm tracking-tight">{item.label}</div>
                  <div className="text-[11px] text-[#788e80] font-normal leading-tight">
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-[#1c4e3f] rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Health status summary card in sidebar */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-[#f4f8f4] border border-[#e2ede4]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1c4e3f] mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#2a7b60]" />
          <span>今月のコンディション</span>
        </div>
        <p className="text-xs text-[#526b5c] leading-relaxed">
          先月より支出ペースが抑制されており、計画通りの推移です。
        </p>
        <div className="mt-2.5 pt-2 border-t border-[#e2ede4] flex items-center justify-between text-[11px] text-[#698273]">
          <span>貯蓄目標達成率</span>
          <span className="font-bold text-[#1c4e3f]">100%</span>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#edf3ec] bg-[#ffffff]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#edf4ee] border border-[#d6e5d8] flex items-center justify-center text-[#1c4e3f] font-bold text-sm">
              {userName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#1c2e23] truncate">
                {userName}
              </div>
              <div className="text-[10px] text-[#2a7b60] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2a7b60] inline-block" />
                オンライン
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('kakeibo')}
            title="家計簿を開く"
            className="p-1.5 rounded-lg text-[#6d8475] hover:text-[#1c4e3f] hover:bg-[#edf4ee] transition-colors cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
