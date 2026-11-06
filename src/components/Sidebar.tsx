import React, { useState } from 'react';
import {
  Home,
  Wallet,
  CheckSquare,
  Calendar,
  PlusCircle,
  Sparkles,
  ChevronDown,
  Users,
  Settings,
  Check,
} from 'lucide-react';
import { NavTab, AppSettings } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  openRecordModal: () => void;
  todoCount: number;
  settings: AppSettings;
  onSelectUser: (userId: string) => void;
  onOpenUserModal: () => void;
  currentMonth: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  openRecordModal,
  todoCount,
  settings,
  onSelectUser,
  onOpenUserModal,
  currentMonth,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const monthNum = parseInt(currentMonth.split('-')[1], 10);

  const activeUser =
    settings.users.find((u) => u.id === settings.currentUserId) ||
    settings.users[0] || {
      id: 'default',
      name: settings.userName || 'ユーザー',
      role: '家計主',
      avatarColor: '#1c4e3f',
    };

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'ホーム',
      sublabel: `${monthNum}月の家計`,
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
    <aside className="w-64 shrink-0 bg-[#ffffff] border-r border-[#e3ebe2] flex flex-col h-full select-none relative">
      {/* Brand Header */}
      <div className="p-6 pb-5 border-b border-[#edf3ec] shrink-0">
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
      <div className="px-4 pt-4 shrink-0">
        <button
          onClick={openRecordModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1c4e3f] hover:bg-[#163e32] text-white font-semibold text-sm transition-all shadow-sm shadow-[#1c4e3f]/20 active:scale-[0.98] cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>収支を記録する</span>
        </button>
      </div>

      {/* Main Navigation Links (scrolls internally if needed) */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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

      {/* Health status summary card */}
      <div className="p-4 mx-3 mb-3 rounded-xl bg-[#f4f8f4] border border-[#e2ede4] shrink-0">
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

      {/* User Footer Profile & Quick Switcher Dropdown */}
      <div className="p-3 border-t border-[#edf3ec] bg-[#ffffff] shrink-0 relative">
        {/* User quick menu popover */}
        {showUserDropdown && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-2xl shadow-xl border border-[#dbe6dc] p-2 space-y-1.5 z-50 animate-in fade-in slide-in-from-bottom-2">
            <div className="px-2 py-1 text-[11px] font-bold text-[#627f6e] flex items-center justify-between">
              <span>ユーザー切替</span>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onOpenUserModal();
                }}
                className="text-[#1c4e3f] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <Settings className="w-3 h-3" />
                <span>管理</span>
              </button>
            </div>

            {/* All users option */}
            <button
              onClick={() => {
                onSelectUser('all');
                setShowUserDropdown(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                settings.currentUserId === 'all'
                  ? 'bg-[#eaf4ec] text-[#1c4e3f] font-bold'
                  : 'hover:bg-[#f5f8f5] text-[#334d3e]'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#2d5f4f] text-white text-[10px] flex items-center justify-center font-bold">
                  全
                </div>
                <span>家計全体（全員）</span>
              </div>
              {settings.currentUserId === 'all' && (
                <Check className="w-3.5 h-3.5 text-[#1c4e3f]" />
              )}
            </button>

            {/* Individual users */}
            {settings.users.map((u) => {
              const isSelected = settings.currentUserId === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u.id);
                    setShowUserDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#eaf4ec] text-[#1c4e3f] font-bold'
                      : 'hover:bg-[#f5f8f5] text-[#334d3e]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-6 h-6 rounded-lg text-white text-[10px] flex items-center justify-center font-bold shrink-0"
                      style={{ backgroundColor: u.avatarColor || '#1c4e3f' }}
                    >
                      {u.name.slice(0, 1)}
                    </div>
                    <div className="truncate">
                      <div className="truncate">{u.name}</div>
                      {u.role && (
                        <div className="text-[10px] text-[#71887a]">{u.role}</div>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#1c4e3f] shrink-0" />
                  )}
                </button>
              );
            })}

            <div className="pt-1 border-t border-[#edf4ee]">
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onOpenUserModal();
                }}
                className="w-full py-1.5 px-2 text-center text-xs font-semibold text-[#1c4e3f] hover:bg-[#edf5ee] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>ユーザー・名前の追加設定</span>
              </button>
            </div>
          </div>
        )}

        {/* User Card Bar */}
        <div className="flex items-center justify-between p-1 rounded-xl hover:bg-[#f5f8f5] transition-colors">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer"
            title="ユーザーを切替または設定"
          >
            <div
              className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs"
              style={{
                backgroundColor:
                  settings.currentUserId === 'all'
                    ? '#1c4e3f'
                    : activeUser.avatarColor || '#1c4e3f',
              }}
            >
              {settings.currentUserId === 'all'
                ? '全'
                : activeUser.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#1c2e23] truncate flex items-center gap-1">
                <span className="truncate">
                  {settings.currentUserId === 'all'
                    ? '家計全体'
                    : activeUser.name}
                </span>
                <ChevronDown className="w-3 h-3 text-[#799081] shrink-0" />
              </div>
              <div className="text-[10px] text-[#52705e] truncate">
                {settings.currentUserId === 'all'
                  ? `${settings.users.length}名の合算`
                  : activeUser.role || 'メンバー'}
              </div>
            </div>
          </button>

          <button
            onClick={onOpenUserModal}
            title="ユーザー設定を開く"
            className="p-1.5 rounded-lg text-[#6d8475] hover:text-[#1c4e3f] hover:bg-[#edf4ee] transition-colors cursor-pointer shrink-0"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
