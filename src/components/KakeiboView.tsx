import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  CreditCard,
  ShoppingBag,
  Sliders,
  Camera,
  Check,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  ExpenseItem,
  IncomeItem,
  SubscriptionItem,
  WishItem,
  AppSettings,
  ExpenseCategory,
} from '../types';

interface KakeiboViewProps {
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  subscriptions: SubscriptionItem[];
  wishes: WishItem[];
  settings: AppSettings;
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onAddIncome: (income: Omit<IncomeItem, 'id'>) => void;
  onDeleteIncome: (id: string) => void;
  onAddSub: (sub: Omit<SubscriptionItem, 'id'>) => void;
  onDeleteSub: (id: string) => void;
  onAddWish: (wish: Omit<WishItem, 'id'>) => void;
  onDeleteWish: (id: string) => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onResetData: () => void;
  onLoadSampleData: () => void;
}

const CATEGORIES: ExpenseCategory[] = [
  '食費',
  'カフェ',
  '住まい',
  '光熱費',
  '交通',
  '日用品',
  '通信費',
  '趣味・娯楽',
  '美容・衣服',
  '医療・保険',
  'その他',
];

export const KakeiboView: React.FC<KakeiboViewProps> = ({
  incomes,
  expenses,
  subscriptions,
  wishes,
  settings,
  onAddExpense,
  onDeleteExpense,
  onAddIncome,
  onDeleteIncome,
  onAddSub,
  onDeleteSub,
  onAddWish,
  onDeleteWish,
  onUpdateSettings,
  onResetData,
  onLoadSampleData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'ledger' | 'subs' | 'wish' | 'ai' | 'receipt' | 'settings'
  >('ledger');

  // Form states for adding items
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('食費');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [incomeSource, setIncomeSource] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Timeframe filter state
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('month');
  const [viewMode, setViewMode] = useState<'bar' | 'pie'>('bar');

  // Subscriptions form state
  const [subName, setSubName] = useState('');
  const [subFee, setSubFee] = useState('');

  // Wish form state
  const [wishName, setWishName] = useState('');
  const [wishPrice, setWishPrice] = useState('');

  // Receipt Scanner Simulation
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState<string | null>(null);

  // Filter expenses by timeframe
  const currentMonthPrefix = expenseDate.slice(0, 7);
  const filteredExpenses = expenses.filter((e) => {
    if (timeframe === 'all') return true;
    if (timeframe === 'month') return e.date.startsWith(currentMonthPrefix);
    if (timeframe === 'week') {
      const d = new Date(e.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - d.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    return true;
  });

  const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes
    .filter((i) => (timeframe === 'month' ? i.date.startsWith(currentMonthPrefix) : true))
    .reduce((sum, i) => sum + i.amount, 0);

  // Breakdown calculation
  const categoryTotals: Record<string, number> = {};
  filteredExpenses.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
  });

  const categoryList = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  // Handle Expense Submit
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(expenseAmount, 10);
    if (!expenseTitle.trim() || isNaN(amountNum) || amountNum <= 0) return;

    onAddExpense({
      title: expenseTitle.trim(),
      category: expenseCategory,
      amount: amountNum,
      date: expenseDate,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false }),
    });

    setExpenseTitle('');
    setExpenseAmount('');
  };

  // Handle Income Submit
  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(incomeAmount, 10);
    if (!incomeSource.trim() || isNaN(amountNum) || amountNum <= 0) return;

    onAddIncome({
      source: incomeSource.trim(),
      amount: amountNum,
      date: incomeDate,
    });

    setIncomeSource('');
    setIncomeAmount('');
  };

  // Handle Receipt Scan simulation
  const handleScanReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setScanning(true);
    setScanSuccess(null);

    setTimeout(() => {
      const sampleItems = [
        { title: 'スーパー食料品（スキャン）', category: '食費' as ExpenseCategory, amount: 2480 },
        { title: 'ドラッグストア消耗品（スキャン）', category: '日用品' as ExpenseCategory, amount: 1650 },
        { title: 'カフェ利用（スキャン）', category: 'カフェ' as ExpenseCategory, amount: 720 },
      ];
      const picked = sampleItems[Math.floor(Math.random() * sampleItems.length)];
      onAddExpense({
        title: picked.title,
        category: picked.category,
        amount: picked.amount,
        date: expenseDate,
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false }),
      });
      setScanning(false);
      setScanSuccess(`「${picked.title}」 ¥${picked.amount.toLocaleString()} を自動登録しました`);
    }, 1200);
  };

  // Sub total calculation
  const totalSubMonthly = subscriptions.reduce((sum, s) => sum + s.fee, 0);

  // Highest expense category for AI diagnosis
  const highestCategory = categoryList[0] || ['なし', 0];
  const highestRatio = totalExpense > 0 ? Math.round((highestCategory[1] / totalExpense) * 100) : 0;

  return (
    <div className="max-w-[1180px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2ede3]">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#2e6d50] uppercase">
            HOUSEHOLD LEDGER
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162e22]">
            家計簿
          </h2>
          <p className="text-xs text-[#6e8576] mt-0.5">
            日々の収支入力、内訳分析、サブスク・物欲コントロール、AI診断
          </p>
        </div>

        {/* Quick balance badge */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-[#dce7dd] shadow-xs text-right">
            <div className="text-[10px] text-[#789080] font-medium">
              今月の収支差額
            </div>
            <div className="text-base font-extrabold text-[#1c4e3f] tabular-nums">
              ¥{(totalIncome - totalExpense).toLocaleString('ja-JP')}
            </div>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-1.5 rounded-2xl border border-[#e1eae1]">
        {[
          { id: 'ledger', label: '収支・内訳', icon: BarChart3 },
          { id: 'receipt', label: '📸 レシートスキャン', icon: Camera },
          { id: 'subs', label: '💳 サブスク管理', icon: CreditCard },
          { id: 'wish', label: '🛍️ 物欲コントロール', icon: ShoppingBag },
          { id: 'ai', label: '🩺 AI家計診断', icon: Sparkles },
          { id: 'settings', label: '⚙️ 設定・管理', icon: Sliders },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#1c4e3f] text-white shadow-xs'
                  : 'text-[#4e6859] hover:bg-[#f1f6f2] hover:text-[#1c4e3f]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Ledger (Input & Breakdown) */}
      {activeSubTab === 'ledger' && (
        <div className="space-y-6">
          {/* Quick Input Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Record Expense Form */}
            <div className="bg-white rounded-3xl p-6 border border-[#e1eae1] shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#fae8e6] text-[#b94a42] flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#162e22]">
                    支出を記録
                  </h3>
                  <p className="text-xs text-[#789080]">
                    費目と金額を入力して追加
                  </p>
                </div>
              </div>

              <form onSubmit={handleExpenseSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#486353] mb-1">
                    品名 / 用途
                  </label>
                  <input
                    type="text"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    placeholder="例: 食費（スーパー）、カフェなど"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#486353] mb-1">
                      カテゴリ
                    </label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#486353] mb-1">
                      金額 (円)
                    </label>
                    <input
                      type="number"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="例: 1500"
                      min="1"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#486353] mb-1">
                    日付
                  </label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#1c4e3f] hover:bg-[#153e32] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  支出を登録する
                </button>
              </form>
            </div>

            {/* Record Income Form */}
            <div className="bg-white rounded-3xl p-6 border border-[#e1eae1] shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#dcf1e3] text-[#247c5d] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#162e22]">
                    収入を記録
                  </h3>
                  <p className="text-xs text-[#789080]">
                    給与や臨時収入を追加
                  </p>
                </div>
              </div>

              <form onSubmit={handleIncomeSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#486353] mb-1">
                    収入の種類 / 送金元
                  </label>
                  <input
                    type="text"
                    value={incomeSource}
                    onChange={(e) => setIncomeSource(e.target.value)}
                    placeholder="例: 給与、副業、配当金など"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#486353] mb-1">
                    金額 (円)
                  </label>
                  <input
                    type="number"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    placeholder="例: 250000"
                    min="1"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#486353] mb-1">
                    日付
                  </label>
                  <input
                    type="date"
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#2a7b60] hover:bg-[#1e614a] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  収入を登録する
                </button>
              </form>
            </div>
          </div>

          {/* Breakdown & Analysis Box */}
          <div className="bg-white rounded-3xl p-6 border border-[#e1eae1] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0f4ef]">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#162e22]">
                  支出内訳 & カテゴリ分析
                </h3>
                <p className="text-xs text-[#789080]">
                  期間内の合計: ¥{totalExpense.toLocaleString('ja-JP')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Timeframe selector */}
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-[#f6faf6] border border-[#dce7dd] text-xs font-bold text-[#1c4e3f]"
                >
                  <option value="month">今月</option>
                  <option value="week">今週</option>
                  <option value="all">全期間</option>
                </select>

                <div className="flex bg-[#f1f6f2] p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('bar')}
                    className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      viewMode === 'bar'
                        ? 'bg-white text-[#1c4e3f] shadow-xs'
                        : 'text-[#6e8576]'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('pie')}
                    className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      viewMode === 'pie'
                        ? 'bg-white text-[#1c4e3f] shadow-xs'
                        : 'text-[#6e8576]'
                    }`}
                  >
                    <PieChartIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Progress List */}
            <div className="pt-4 space-y-3.5">
              {categoryList.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#789080]">
                  記録された支出データがありません。
                </div>
              ) : (
                categoryList.map(([cat, amount]) => {
                  const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#1a3325]">{cat}</span>
                        <span className="text-[#162e22] tabular-nums">
                          ¥{amount.toLocaleString('ja-JP')}{' '}
                          <span className="text-[#789080] font-normal">
                            ({percent}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-[#eef4ef] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2a7b60] h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Full Transactions Table */}
          <div className="bg-white rounded-3xl p-6 border border-[#e1eae1] shadow-xs">
            <h3 className="text-base font-bold text-[#162e22] mb-4">
              最近の支出履歴一覧
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#edf3ec] text-[#6e8576]">
                    <th className="py-2.5 px-3 font-semibold">日付</th>
                    <th className="py-2.5 px-3 font-semibold">品名 / 用途</th>
                    <th className="py-2.5 px-3 font-semibold">カテゴリ</th>
                    <th className="py-2.5 px-3 font-semibold text-right">金額</th>
                    <th className="py-2.5 px-3 font-semibold text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2f6f2]">
                  {filteredExpenses.map((e) => (
                    <tr key={e.id} className="hover:bg-[#fbfdfb]">
                      <td className="py-3 px-3 text-[#526b5c] whitespace-nowrap">
                        {e.date} {e.time || ''}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#162e22]">
                        {e.title}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-[#edf5ee] text-[#1c4e3f] font-semibold text-[11px]">
                          {e.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-right text-[#1a3325] tabular-nums">
                        −¥{e.amount.toLocaleString('ja-JP')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onDeleteExpense(e.id)}
                          className="p-1 text-[#a5524d] hover:bg-[#fae8e6] rounded-md transition-colors cursor-pointer"
                          title="削除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Receipt Auto Scanner */}
      {activeSubTab === 'receipt' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e1eae1] shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#dcf1e3] text-[#247c5d] flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#162e22]">
                📸 レシートAIオートスキャン
              </h3>
              <p className="text-xs text-[#6e8576]">
                レシートの写真をアップロードすると、自動で金額・費目を解析して支出に記録します。
              </p>
            </div>
          </div>

          <div className="border-2 border-dashed border-[#ccdccd] rounded-3xl p-8 text-center bg-[#f9fbf9] space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#e8f3ea] text-[#1c4e3f] flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#162e22]">
                レシート画像を選択
              </p>
              <p className="text-xs text-[#789080] mt-1">
                JPG, PNGファイルに対応（AIが自動で品目と金額を読み取ります）
              </p>
            </div>

            <label className="inline-block px-5 py-2.5 rounded-xl bg-[#1c4e3f] hover:bg-[#153e32] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs">
              ファイルを選択してスキャン
              <input
                type="file"
                accept="image/*"
                onChange={handleScanReceipt}
                className="hidden"
              />
            </label>

            {scanning && (
              <div className="text-xs font-bold text-[#2a7b60] flex items-center justify-center gap-2 animate-pulse pt-2">
                <Sparkles className="w-4 h-4" />
                <span>AI解析中... レシートデータを読み取っています</span>
              </div>
            )}

            {scanSuccess && (
              <div className="p-3 bg-[#e8f6ec] border border-[#bde4c8] text-[#1c4e3f] rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>{scanSuccess}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Subscriptions */}
      {activeSubTab === 'subs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#e1eae1] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0f4ef]">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#162e22]">
                  💳 定期サブスクリプション管理
                </h3>
                <p className="text-xs text-[#789080]">
                  毎月の固定費を可視化して無駄な自動引き落としを防止
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-[#789080]">月間固定費</div>
                <div className="text-lg font-extrabold text-[#1c4e3f]">
                  ¥{totalSubMonthly.toLocaleString('ja-JP')}
                  <span className="text-xs font-normal text-[#6e8576]">/月</span>
                </div>
              </div>
            </div>

            {/* Add Sub Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const feeNum = parseInt(subFee, 10);
                if (!subName.trim() || isNaN(feeNum) || feeNum <= 0) return;
                onAddSub({ name: subName.trim(), fee: feeNum, cycle: 'monthly' });
                setSubName('');
                setSubFee('');
              }}
              className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <input
                type="text"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="サービス名（例: Netflix, ジム）"
                className="px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm focus:outline-none focus:border-[#2a7b60]"
                required
              />
              <input
                type="number"
                value={subFee}
                onChange={(e) => setSubFee(e.target.value)}
                placeholder="月額料金 (円)"
                min="1"
                className="px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm focus:outline-none focus:border-[#2a7b60]"
                required
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-[#1c4e3f] hover:bg-[#153e32] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                サブスクを追加
              </button>
            </form>

            {/* Subscriptions List */}
            <div className="mt-5 space-y-2.5">
              {subscriptions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f9fbf9] border border-[#e5eee5]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#dcf1e3] text-[#247c5d] flex items-center justify-center font-bold text-xs">
                      📡
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#162e22]">
                        {s.name}
                      </div>
                      <div className="text-[11px] text-[#789080]">
                        年間換算: ¥{(s.fee * 12).toLocaleString('ja-JP')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-[#1a3325]">
                      ¥{s.fee.toLocaleString('ja-JP')}/月
                    </span>
                    <button
                      onClick={() => onDeleteSub(s.id)}
                      className="p-1 text-[#b55852] hover:bg-[#fae8e6] rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Wishlist */}
      {activeSubTab === 'wish' && (
        <div className="bg-white rounded-3xl p-6 border border-[#e1eae1] shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#f0f4ef]">
            <div className="w-10 h-10 rounded-2xl bg-[#faebd7] text-[#a0682b] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#162e22]">
                🛍️ 物欲コントロール（ウィッシュリスト）
              </h3>
              <p className="text-xs text-[#789080]">
                欲しいものを一旦寝かせて「外食○回分」に換算。衝動買いを防ぎます。
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const p = parseInt(wishPrice, 10);
              if (!wishName.trim() || isNaN(p) || p <= 0) return;
              onAddWish({ name: wishName.trim(), price: p });
              setWishName('');
              setWishPrice('');
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <input
              type="text"
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
              placeholder="欲しいもの（例: 新型ガジェット）"
              className="px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm focus:outline-none focus:border-[#2a7b60]"
              required
            />
            <input
              type="number"
              value={wishPrice}
              onChange={(e) => setWishPrice(e.target.value)}
              placeholder="価格 (円)"
              min="1"
              className="px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm focus:outline-none focus:border-[#2a7b60]"
              required
            />
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-[#1c4e3f] hover:bg-[#153e32] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              ウィッシュリストに登録
            </button>
          </form>

          <div className="space-y-3 pt-2">
            {wishes.map((w) => {
              const mealsSaved = Math.ceil(w.price / 3000);
              return (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#f9fbf9] border border-[#e5eee5]"
                >
                  <div>
                    <div className="text-sm font-bold text-[#162e22] flex items-center gap-2">
                      <span>🛍️ {w.name}</span>
                      <span className="text-xs text-[#1c4e3f] font-extrabold">
                        ¥{w.price.toLocaleString('ja-JP')}
                      </span>
                    </div>
                    <div className="text-xs text-[#2a7b60] font-medium mt-1">
                      ✨ 外食を約 {mealsSaved} 回我慢すれば購入可能！
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteWish(w.id)}
                    className="px-3 py-1.5 rounded-lg border border-[#dce7dd] hover:bg-[#fae8e6] hover:text-[#b55852] text-xs font-semibold text-[#6e8576] transition-colors cursor-pointer"
                  >
                    達成 / 削除
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: AI Doctor Report */}
      {activeSubTab === 'ai' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e1eae1] shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#dcf1e3] text-[#247c5d] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#162e22]">
                🩺 AI家計ドクター診断レポート
              </h3>
              <p className="text-xs text-[#6e8576]">
                あなたの現在の収支データを多角的に解析したアドバイス
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#f4f8f4] border border-[#d6e5d8] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-[#dce7dd]">
              <div>
                <span className="text-xs text-[#6e8576]">総合支出</span>
                <div className="text-xl font-extrabold text-[#162e22]">
                  ¥{totalExpense.toLocaleString('ja-JP')}
                </div>
              </div>
              <div>
                <span className="text-xs text-[#6e8576]">最大支出カテゴリ</span>
                <div className="text-xl font-extrabold text-[#1c4e3f]">
                  {highestCategory[0]}
                </div>
              </div>
              <div>
                <span className="text-xs text-[#6e8576]">構成比</span>
                <div className="text-xl font-extrabold text-[#1c4e3f]">
                  {highestRatio}%
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-[#355242] leading-relaxed">
              <p className="font-bold text-[#1c4e3f] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2a7b60]" />
                現在の家計診断判定：順調（バランス良好）
              </p>
              <p>
                「{highestCategory[0]}」が全体の {highestRatio}% を占めています。
                {highestRatio > 35
                  ? ` ${highestCategory[0]}の比率がやや高めです。買い出しの頻度やまとめ買いリストを整備するとさらに月1〜2万円の貯蓄余力が生まれます。`
                  : ' 全体として適正なバランスが保たれており、突発的な過剰支出は見受けられません。'}
              </p>
              <p>
                今月の貯蓄見込みは{' '}
                <strong className="text-[#1c4e3f]">
                  ¥{(totalIncome - totalExpense).toLocaleString('ja-JP')}
                </strong>{' '}
                となっており、目標貯蓄額（¥
                {settings.targetSavings.toLocaleString('ja-JP')}）をクリアできる見通しです。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Settings & Reset */}
      {activeSubTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e1eae1] shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#f0f4ef]">
            <div className="w-10 h-10 rounded-2xl bg-[#edf4ee] text-[#1c4e3f] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#162e22]">
                ⚙️ 家計パラメータ & データ管理
              </h3>
              <p className="text-xs text-[#789080]">
                世帯人数、貯蓄目標、データのバックアップとリセット
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#486353] mb-1">
                世帯人数
              </label>
              <select
                value={settings.familySize}
                onChange={(e) => onUpdateSettings({ familySize: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22]"
              >
                <option value="1">1人暮らし（単身）</option>
                <option value="2">2人暮らし</option>
                <option value="3">3人家族</option>
                <option value="4">4人家族以上</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#486353] mb-1">
                ペットの有無
              </label>
              <select
                value={settings.hasPet ? 'yes' : 'no'}
                onChange={(e) => onUpdateSettings({ hasPet: e.target.value === 'yes' })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22]"
              >
                <option value="no">なし</option>
                <option value="yes">あり（ペット費加算）</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#486353] mb-1">
                月間目標貯蓄額 (円)
              </label>
              <input
                type="number"
                value={settings.targetSavings}
                onChange={(e) =>
                  onUpdateSettings({ targetSavings: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#486353] mb-1">
                表示ユーザー名
              </label>
              <input
                type="text"
                value={settings.userName}
                onChange={(e) => onUpdateSettings({ userName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#edf3ec] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onLoadSampleData}
              className="px-4 py-2 rounded-xl bg-[#eef5ef] hover:bg-[#dcebdd] text-[#1c4e3f] text-xs font-bold transition-colors cursor-pointer"
            >
              画像通りの初期サンプルを再読み込み
            </button>

            <button
              onClick={() => {
                if (window.confirm('すべての家計データを初期化しますか？')) {
                  onResetData();
                }
              }}
              className="px-4 py-2 rounded-xl border border-[#f3d3cf] hover:bg-[#fae8e6] text-[#b55852] text-xs font-bold transition-colors cursor-pointer"
            >
              データ完全リセット
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
