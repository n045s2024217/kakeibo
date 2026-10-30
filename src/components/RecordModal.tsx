import React, { useState } from 'react';
import { X, TrendingDown, TrendingUp } from 'lucide-react';
import { ExpenseCategory, ExpenseItem, IncomeItem } from '../types';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onAddIncome: (income: Omit<IncomeItem, 'id'>) => void;
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

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  onAddIncome,
}) => {
  const [type, setType] = useState<'expense' | 'income'>('expense');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('食費');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount, 10);
    if (!title.trim() || isNaN(val) || val <= 0) return;

    if (type === 'expense') {
      onAddExpense({
        title: title.trim(),
        category,
        amount: val,
        date,
        time: new Date().toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      });
    } else {
      onAddIncome({
        source: title.trim(),
        amount: val,
        date,
      });
    }

    setTitle('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#dce8dd] relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#789080] hover:text-[#162e22] hover:bg-[#f0f5f1] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div>
          <h3 className="text-xl font-bold text-[#162e22]">
            収支を記録する
          </h3>
          <p className="text-xs text-[#6e8576] mt-0.5">
            支出または収入を選んで金額を入力してください
          </p>
        </div>

        {/* Type Toggle */}
        <div className="flex bg-[#f1f6f2] p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'expense'
                ? 'bg-white text-[#b94a42] shadow-xs'
                : 'text-[#6e8576]'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>支出</span>
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-white text-[#247c5d] shadow-xs'
                : 'text-[#6e8576]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>収入</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#486353] mb-1">
              {type === 'expense' ? '品名 / 用途' : '収入の種類 / 送金元'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'expense' ? '例: 食費（スーパー）、カフェ' : '例: 給与、賞与'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
              required
              autoFocus
            />
          </div>

          {type === 'expense' && (
            <div>
              <label className="block text-xs font-semibold text-[#486353] mb-1">
                カテゴリ
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#486353] mb-1">
              金額 (円)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="例: 3200"
              min="1"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#486353] mb-1">
              日付
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1c4e3f] hover:bg-[#153e32] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
            >
              {type === 'expense' ? '支出を登録する' : '収入を登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
