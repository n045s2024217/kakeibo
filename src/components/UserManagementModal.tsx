import React, { useState } from 'react';
import { X, UserPlus, Edit2, Trash2, Check, User, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../types';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
  onAddUser: (user: Omit<UserProfile, 'id'>) => void;
  onUpdateUser: (id: string, updates: Partial<UserProfile>) => void;
  onDeleteUser: (id: string) => void;
}

const PRESET_COLORS = [
  { name: 'フォレストグリーン', hex: '#1c4e3f' },
  { name: 'インディゴブルー', hex: '#2563eb' },
  { name: 'スカイブルー', hex: '#0284c7' },
  { name: 'エメラルド', hex: '#059669' },
  { name: 'ローズピンク', hex: '#e11d48' },
  { name: 'アンバーオレンジ', hex: '#d97706' },
  { name: 'バイオレット', hex: '#7c3aed' },
  { name: 'スレートグレー', hex: '#475569' },
];

const PRESET_ROLES = ['家計主 / 管理者', 'パートナー', '子供', '家族', 'その他'];

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUserId,
  onSelectUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Form states for Add / Edit
  const [name, setName] = useState('');
  const [role, setRole] = useState('パートナー');
  const [avatarColor, setAvatarColor] = useState(PRESET_COLORS[0].hex);
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [memo, setMemo] = useState('');

  if (!isOpen) return null;

  const startAdd = () => {
    setNoticeMessage(null);
    setEditingUserId(null);
    setName('');
    setRole('パートナー');
    setAvatarColor(PRESET_COLORS[(users.length % PRESET_COLORS.length)].hex);
    setMonthlyBudget('');
    setMemo('');
    setIsAdding(true);
  };

  const startEdit = (user: UserProfile) => {
    setNoticeMessage(null);
    setIsAdding(false);
    setEditingUserId(user.id);
    setName(user.name);
    setRole(user.role || 'パートナー');
    setAvatarColor(user.avatarColor || '#1c4e3f');
    setMonthlyBudget(user.monthlyBudget ? String(user.monthlyBudget) : '');
    setMemo(user.memo || '');
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingUserId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const budgetNum = monthlyBudget ? parseInt(monthlyBudget, 10) : undefined;

    if (isAdding) {
      onAddUser({
        name: name.trim(),
        role: role.trim(),
        avatarColor,
        monthlyBudget: budgetNum && !isNaN(budgetNum) ? budgetNum : undefined,
        memo: memo.trim(),
      });
      setIsAdding(false);
    } else if (editingUserId) {
      onUpdateUser(editingUserId, {
        name: name.trim(),
        role: role.trim(),
        avatarColor,
        monthlyBudget: budgetNum && !isNaN(budgetNum) ? budgetNum : undefined,
        memo: memo.trim(),
      });
      setEditingUserId(null);
    }
  };

  const requestDelete = (user: UserProfile) => {
    setNoticeMessage(null);
    if (users.length <= 1) {
      setNoticeMessage('ユーザーは最低1人登録されている必要があります。削除できません。');
      return;
    }
    setDeletingUser(user);
  };

  const confirmDelete = () => {
    if (!deletingUser) return;
    onDeleteUser(deletingUser.id);
    if (editingUserId === deletingUser.id) cancelForm();
    setDeletingUser(null);
    setNoticeMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#dce8dd] relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#edf4ee]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#edf4ee] text-[#1c4e3f] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#162e22]">
                ユーザー・家族管理
              </h3>
              <p className="text-xs text-[#71887a]">
                各ユーザーの名前・役割・テーマ色・個別予算の設定
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#789080] hover:text-[#162e22] hover:bg-[#f0f5f1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice banner */}
        {noticeMessage && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{noticeMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setNoticeMessage(null)}
              className="text-amber-800 hover:text-amber-950 font-bold text-xs cursor-pointer px-1"
            >
              閉じる
            </button>
          </div>
        )}

        {/* Content body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Active user status switch pill */}
          <div className="bg-[#f4f8f4] p-3 rounded-2xl border border-[#e1ece2] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#446552]">現在選択中の表示モード</div>
              <div className="text-xs font-semibold text-[#1c4e3f] mt-0.5">
                {currentUserId === 'all'
                  ? '家計全体（全員の合算）'
                  : `${users.find((u) => u.id === currentUserId)?.name || '選択中'} 個人の家計`}
              </div>
            </div>
            <button
              onClick={() => onSelectUser('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentUserId === 'all'
                  ? 'bg-[#1c4e3f] text-white shadow-xs'
                  : 'bg-white border border-[#d2e2d5] text-[#2c4e3b] hover:bg-[#ebf4ec]'
              }`}
            >
              全員表示に切替
            </button>
          </div>

          {/* Add / Edit Form Modal Segment */}
          {(isAdding || editingUserId) ? (
            <form onSubmit={handleSave} className="bg-[#f9fbf9] border border-[#dbe7dc] rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#e5efe6] pb-2">
                <h4 className="text-sm font-bold text-[#193d2c]">
                  {isAdding ? '＋ 新しいユーザーを追加' : 'ユーザー情報の編集'}
                </h4>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="text-xs text-[#6e8576] hover:text-[#193d2c] font-semibold cursor-pointer"
                >
                  キャンセル
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#3d5948] mb-1">
                  名前 / ニックネーム <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: 田中 太郎、花子、ママ、自分"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#1c4e3f]"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-[#3d5948] mb-1">
                  役割 / 続柄
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_ROLES.map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                        role === r
                          ? 'bg-[#1c4e3f] text-white font-bold'
                          : 'bg-white border border-[#d6e5d8] text-[#4d6957] hover:bg-[#edf4ee]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="自由入力可 (例: 家計管理者、ルームメイト)"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#1c4e3f]"
                />
              </div>

              {/* Color Preset Palette */}
              <div>
                <label className="block text-xs font-bold text-[#3d5948] mb-1.5">
                  テーマカラー（アバター & グラフ色）
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setAvatarColor(c.hex)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-xs"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {avatarColor === c.hex && (
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3d5948] mb-1">
                    月間目安予算 (円, 任意)
                  </label>
                  <input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    placeholder="例: 150000"
                    min="0"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#1c4e3f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3d5948] mb-1">
                    メモ / 担当項目 (任意)
                  </label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="例: 食費・日用品メイン"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#1c4e3f]"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-[#d5e2d6] text-[#557161] hover:bg-[#edf5ee] cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#1c4e3f] hover:bg-[#163e32] text-white shadow-xs cursor-pointer"
                >
                  {isAdding ? 'ユーザーを追加する' : '変更を保存する'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={startAdd}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1c4e3f] hover:bg-[#153e32] text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>新しいユーザーを追加</span>
              </button>
            </div>
          )}

          {/* User List */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-[#557262] uppercase tracking-wider">
              登録ユーザー一覧 ({users.length}名)
            </div>

            {users.map((user) => {
              const isCurrent = currentUserId === user.id;
              const canDelete = users.length > 1;

              return (
                <div
                  key={user.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-[#f0f7f1] border-[#2a7b60] shadow-xs'
                      : 'bg-white border-[#e2ede3] hover:border-[#cbdccf]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-2xl text-white font-bold flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: user.avatarColor || '#1c4e3f' }}
                    >
                      {user.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#162e22] truncate">
                          {user.name}
                        </span>
                        {user.role && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f0e7] text-[#2b6448]">
                            {user.role}
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1c4e3f] text-white">
                            選択中
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#6e8576] mt-0.5 flex items-center gap-3 flex-wrap">
                        {user.monthlyBudget ? (
                          <span>目安予算: ¥{user.monthlyBudget.toLocaleString('ja-JP')}</span>
                        ) : null}
                        {user.memo ? <span>{user.memo}</span> : null}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectUser(user.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-[#1c4e3f] text-white'
                          : 'bg-[#edf4ee] text-[#295b44] hover:bg-[#dbe9dd]'
                      }`}
                      title="このユーザーを選択"
                    >
                      {isCurrent ? '選択中' : '選択'}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(user)}
                      className="p-1.5 rounded-xl text-[#5c7767] hover:text-[#1c4e3f] hover:bg-[#edf4ee] transition-colors cursor-pointer"
                      title="編集"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDelete(user)}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                        !canDelete
                          ? 'text-[#ccd8d0] hover:text-[#b5c5bb] cursor-not-allowed opacity-50'
                          : 'text-[#8d9f93] hover:text-rose-600 hover:bg-rose-50'
                      }`}
                      title={!canDelete ? '最低1人必要なため削除できません' : '削除'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#edf4ee] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#1c4e3f] hover:bg-[#163e32] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            完了
          </button>
        </div>

        {/* In-App Delete Confirmation Dialog (Never relies on window.confirm) */}
        {deletingUser && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-rose-100 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#162e22]">
                  ユーザーを削除しますか？
                </h4>
                <p className="text-xs text-[#6e8576] mt-1.5 leading-relaxed">
                  「<span className="font-bold text-[#162e22]">{deletingUser.name}</span>」を削除します。<br />
                  <span className="text-rose-600 font-semibold inline-block mt-0.5">※ このユーザーに関する支出・収入などの全記録も同時に消去されます。</span><br />
                  この操作は元に戻せません。よろしいですか？
                </p>

              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#d6e5d8] text-xs font-bold text-[#557161] hover:bg-[#edf5ee] cursor-pointer transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs cursor-pointer transition-colors"
                >
                  削除する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
