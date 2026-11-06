import { ExpenseItem, IncomeItem, TodoItem, ScheduleItem, SubscriptionItem, WishItem, AppSettings, UserProfile } from '../types';

export const getCurrentYearMonthString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getPreviousYearMonthString = (yearMonthStr: string): string => {
  const [yStr, mStr] = yearMonthStr.split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const prevDate = new Date(y, m - 2, 1);
  return `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
};

const CURRENT_YM = getCurrentYearMonthString();
const PREV_YM = getPreviousYearMonthString(CURRENT_YM);

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-1',
    name: '田中 太郎',
    role: '家計主 / 管理者',
    avatarColor: '#1c4e3f', // Forest green
    monthlyBudget: 190000,
    memo: '固定費・食費メイン担当',
  },
  {
    id: 'user-2',
    name: '田中 花子',
    role: 'パートナー',
    avatarColor: '#2563eb', // Indigo Blue
    monthlyBudget: 100000,
    memo: '日用品・カフェ・雑貨担当',
  },
];

export const INITIAL_INCOMES: IncomeItem[] = [
  {
    id: 'inc-1',
    source: '本給・給与振込',
    amount: 328000,
    date: `${CURRENT_YM}-10`,
    memo: '給与振込',
    userId: 'user-1',
  },
  {
    id: 'inc-june-1',
    source: '本給・給与振込',
    amount: 280000,
    date: `${PREV_YM}-10`,
    memo: '前月給与振込',
    userId: 'user-1',
  },
];


export const INITIAL_EXPENSES: ExpenseItem[] = [
  // Exact recent items adapted to current month:
  {
    id: 'exp-1',
    title: '食費（スーパー）',
    category: '食費',
    amount: 3280,
    date: `${CURRENT_YM}-12`,
    time: '14:32',
    memo: '夕食・まとめ買い',
    userId: 'user-1',
  },
  {
    id: 'exp-2',
    title: 'カフェ',
    category: 'カフェ',
    amount: 680,
    date: `${CURRENT_YM}-11`,
    time: '10:16',
    memo: 'アイスラテ・休憩',
    userId: 'user-2',
  },
  {
    id: 'exp-3',
    title: '交通費（電車）',
    category: '交通',
    amount: 1240,
    date: `${CURRENT_YM}-10`,
    time: '08:45',
    memo: '定期外移動',
    userId: 'user-1',
  },
  {
    id: 'exp-4',
    title: '日用品（ドラッグストア）',
    category: '日用品',
    amount: 9880,
    date: `${CURRENT_YM}-09`,
    time: '19:12',
    memo: 'シャンプー・洗剤・サプリ',
    userId: 'user-2',
  },
  {
    id: 'exp-5',
    title: '光熱費（電気）',
    category: '光熱費',
    amount: 6420,
    date: `${CURRENT_YM}-08`,
    time: '12:03',
    memo: '電気料金利用分',
    userId: 'user-1',
  },
  {
    id: 'exp-6',
    title: '食材・スーパー買い出し',
    category: '食費',
    amount: 65040,
    date: `${CURRENT_YM}-05`,
    time: '16:00',
    memo: '月初生鮮食品・調味料まとめ買い',
    userId: 'user-1',
  },
  // 住まい total = 40,000
  {
    id: 'exp-7',
    title: '家賃・住宅費用',
    category: '住まい',
    amount: 40000,
    date: `${CURRENT_YM}-01`,
    time: '09:00',
    memo: '今月分家賃振替',
    userId: 'user-1',
  },
  // 交通 total = 22,480 (1,240 + 21,240)
  {
    id: 'exp-8',
    title: '新幹線・出張交通費',
    category: '交通',
    amount: 21240,
    date: `${CURRENT_YM}-04`,
    time: '11:20',
    memo: '新幹線チケット',
    userId: 'user-1',
  },
  // Other supporting categories so total expense matches ¥188,680:
  // (68,320 + 40,000 + 22,480 = 130,800. Remaining: 57,880)
  // 日用品 already has 9,880 -> add 8,620 = 18,500
  {
    id: 'exp-9',
    title: '生活消耗品・日用雑貨',
    category: '日用品',
    amount: 8620,
    date: `${CURRENT_YM}-03`,
    time: '15:10',
    memo: '消耗品・清掃用品',
    userId: 'user-2',
  },
  // 光熱費 already has 6,420 -> add 9,980 (ガス・水道) = 16,400
  {
    id: 'exp-10',
    title: '水道・ガス料金',
    category: '光熱費',
    amount: 9980,
    date: `${CURRENT_YM}-02`,
    time: '10:00',
    memo: '水道光熱費振替',
    userId: 'user-1',
  },
  // 通信費: 8,800
  {
    id: 'exp-11',
    title: 'スマートフォン・光回線',
    category: '通信費',
    amount: 8800,
    date: `${CURRENT_YM}-01`,
    time: '12:00',
    memo: '今月通信費',
    userId: 'user-1',
  },
  // 趣味・娯楽: 14,080
  {
    id: 'exp-12',
    title: '書籍・映画・サブスク',
    category: '趣味・娯楽',
    amount: 14080,
    date: `${CURRENT_YM}-07`,
    time: '20:30',
    memo: '文芸書・配信サービス',
    userId: 'user-2',
  },
  // 先月の実績データ (先月比計算の基準データ: 支出計 148,680円, 収支差額 131,320円)
  {
    id: 'exp-june-1',
    title: '家賃・住宅費用',
    category: '住まい',
    amount: 40000,
    date: `${PREV_YM}-01`,
    time: '09:00',
    memo: '前月分家賃振替',
    userId: 'user-1',
  },
  {
    id: 'exp-june-2',
    title: '食材・スーパー買い出し',
    category: '食費',
    amount: 52000,
    date: `${PREV_YM}-05`,
    time: '15:30',
    memo: '前月食費まとめ買い',
    userId: 'user-1',
  },
  {
    id: 'exp-june-3',
    title: '水道光熱費',
    category: '光熱費',
    amount: 15800,
    date: `${PREV_YM}-12`,
    time: '11:00',
    memo: '前月水道・電気代',
    userId: 'user-1',
  },
  {
    id: 'exp-june-4',
    title: '日用品・ドラッグストア',
    category: '日用品',
    amount: 14880,
    date: `${PREV_YM}-16`,
    time: '18:20',
    memo: '生活消耗品',
    userId: 'user-1',
  },
  {
    id: 'exp-june-5',
    title: '交通費（電車・ICチャージ）',
    category: '交通',
    amount: 12000,
    date: `${PREV_YM}-08`,
    time: '08:30',
    memo: '交通費定期外',
    userId: 'user-1',
  },
  {
    id: 'exp-june-6',
    title: 'スマートフォン・通信費',
    category: '通信費',
    amount: 8800,
    date: `${PREV_YM}-01`,
    time: '12:00',
    memo: '前月通信費',
    userId: 'user-1',
  },
  {
    id: 'exp-june-7',
    title: 'カフェ・外食',
    category: 'カフェ',
    amount: 5200,
    date: `${PREV_YM}-20`,
    time: '14:00',
    memo: '週末カフェランチ',
    userId: 'user-1',
  },
];

export const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'todo-1',
    text: '今月のレシートを仕分けして家計簿に記入',
    priority: 'high',
    completed: true,
    createdAt: `${CURRENT_YM}-01`,
  },
  {
    id: 'todo-2',
    text: '使っていないサブスクの解約検討（ジム・動画配信）',
    priority: 'high',
    completed: false,
    createdAt: `${CURRENT_YM}-03`,
  },
  {
    id: 'todo-3',
    text: '旅行・レジャー予算プランを組む',
    priority: 'medium',
    completed: false,
    createdAt: `${CURRENT_YM}-06`,
  },
  {
    id: 'todo-4',
    text: '日用品ストックの補充リスト作成',
    priority: 'low',
    completed: false,
    createdAt: `${CURRENT_YM}-10`,
  },
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  { id: 'sch-1', date: `${CURRENT_YM}-10`, text: '給与振込確認日' },
  { id: 'sch-2', date: `${CURRENT_YM}-12`, text: 'スーパー週末セールまとめ買い' },
  { id: 'sch-3', date: `${CURRENT_YM}-15`, text: '水道光熱費口座引き落とし' },
  { id: 'sch-4', date: `${CURRENT_YM}-20`, text: '日用品まとめ買い' },
  { id: 'sch-5', date: `${CURRENT_YM}-25`, text: '家賃支払い日' },
];

export const INITIAL_SUBS: SubscriptionItem[] = [
  { id: 'sub-1', name: '動画配信サービス (Netflix)', fee: 1490, cycle: 'monthly' },
  { id: 'sub-2', name: '音楽配信 (Spotify)', fee: 980, cycle: 'monthly' },
  { id: 'sub-3', name: 'クラウドストレージ', fee: 400, cycle: 'monthly' },
  { id: 'sub-4', name: 'フィットネスジム', fee: 7800, cycle: 'monthly' },
];

export const INITIAL_WISHES: WishItem[] = [
  { id: 'wish-1', name: 'ノイズキャンセリングヘッドホン', price: 29800, saved: false },
  { id: 'wish-2', name: '北欧デザイン リビング間接照明', price: 14500, saved: false },
  { id: 'wish-3', name: '上質なレザーキーケース', price: 8200, saved: true },
];

export const INITIAL_SETTINGS: AppSettings = {
  familySize: '2',
  hasPet: false,
  targetSavings: 50000,
  monthlyBudget: 290000,
  userName: '田中 太郎',
  currentUserId: 'all',
  users: INITIAL_USERS,
};

