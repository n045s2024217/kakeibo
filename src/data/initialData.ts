import { ExpenseItem, IncomeItem, TodoItem, ScheduleItem, SubscriptionItem, WishItem, AppSettings } from '../types';

export const INITIAL_INCOMES: IncomeItem[] = [
  {
    id: 'inc-1',
    source: '本給・給与振込',
    amount: 328000,
    date: '2026-07-10',
    memo: '7月度給与振込',
  },
  {
    id: 'inc-june-1',
    source: '本給・給与振込',
    amount: 280000,
    date: '2026-06-10',
    memo: '6月度給与振込',
  },
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  // Exact recent items from image:
  {
    id: 'exp-1',
    title: '食費（スーパー）',
    category: '食費',
    amount: 3280,
    date: '2026-07-12',
    time: '14:32',
    memo: '夕食・まとめ買い',
  },
  {
    id: 'exp-2',
    title: 'カフェ',
    category: 'カフェ',
    amount: 680,
    date: '2026-07-11',
    time: '10:16',
    memo: 'アイスラテ・休憩',
  },
  {
    id: 'exp-3',
    title: '交通費（電車）',
    category: '交通',
    amount: 1240,
    date: '2026-07-10',
    time: '08:45',
    memo: '定期外移動',
  },
  {
    id: 'exp-4',
    title: '日用品（ドラッグストア）',
    category: '日用品',
    amount: 9880,
    date: '2026-07-09',
    time: '19:12',
    memo: 'シャンプー・洗剤・サプリ',
  },
  {
    id: 'exp-5',
    title: '光熱費（電気）',
    category: '光熱費',
    amount: 6420,
    date: '2026-07-08',
    time: '12:03',
    memo: '東京電力 6月利用分',
  },
  // Supporting data to precisely match the breakdown in image:
  // 食費 total = 68,320 (3,280 + 65,040)
  {
    id: 'exp-6',
    title: '食材・スーパー買い出し',
    category: '食費',
    amount: 65040,
    date: '2026-07-05',
    time: '16:00',
    memo: '月初生鮮食品・調味料まとめ買い',
  },
  // 住まい total = 40,000
  {
    id: 'exp-7',
    title: '家賃・住宅費用',
    category: '住まい',
    amount: 40000,
    date: '2026-07-01',
    time: '09:00',
    memo: '7月分家賃振替',
  },
  // 交通 total = 22,480 (1,240 + 21,240)
  {
    id: 'exp-8',
    title: '新幹線・出張交通費',
    category: '交通',
    amount: 21240,
    date: '2026-07-04',
    time: '11:20',
    memo: '新幹線チケット',
  },
  // Other supporting categories so total expense matches ¥188,680:
  // (68,320 + 40,000 + 22,480 = 130,800. Remaining: 57,880)
  // 日用品 already has 9,880 -> add 8,620 = 18,500
  {
    id: 'exp-9',
    title: '生活消耗品・日用雑貨',
    category: '日用品',
    amount: 8620,
    date: '2026-07-03',
    time: '15:10',
    memo: '消耗品・清掃用品',
  },
  // 光熱費 already has 6,420 -> add 9,980 (ガス・水道) = 16,400
  {
    id: 'exp-10',
    title: '水道・ガス料金',
    category: '光熱費',
    amount: 9980,
    date: '2026-07-02',
    time: '10:00',
    memo: '水道光熱費振替',
  },
  // 通信費: 8,800
  {
    id: 'exp-11',
    title: 'スマートフォン・光回線',
    category: '通信費',
    amount: 8800,
    date: '2026-07-01',
    time: '12:00',
    memo: '7月通信費',
  },
  // 趣味・娯楽: 14,080
  {
    id: 'exp-12',
    title: '書籍・映画・サブスク',
    category: '趣味・娯楽',
    amount: 14080,
    date: '2026-07-07',
    time: '20:30',
    memo: '文芸書・配信サービス',
  },
  // 6月の実績データ (先月比計算の基準データ: 支出計 148,680円, 収支差額 131,320円)
  {
    id: 'exp-june-1',
    title: '家賃・住宅費用',
    category: '住まい',
    amount: 40000,
    date: '2026-06-01',
    time: '09:00',
    memo: '6月分家賃振替',
  },
  {
    id: 'exp-june-2',
    title: '食材・スーパー買い出し',
    category: '食費',
    amount: 52000,
    date: '2026-06-05',
    time: '15:30',
    memo: '6月食費まとめ買い',
  },
  {
    id: 'exp-june-3',
    title: '水道光熱費',
    category: '光熱費',
    amount: 15800,
    date: '2026-06-12',
    time: '11:00',
    memo: '6月水道・電気代',
  },
  {
    id: 'exp-june-4',
    title: '日用品・ドラッグストア',
    category: '日用品',
    amount: 14880,
    date: '2026-06-16',
    time: '18:20',
    memo: '生活消耗品',
  },
  {
    id: 'exp-june-5',
    title: '交通費（電車・ICチャージ）',
    category: '交通',
    amount: 12000,
    date: '2026-06-08',
    time: '08:30',
    memo: '交通費定期外',
  },
  {
    id: 'exp-june-6',
    title: 'スマートフォン・通信費',
    category: '通信費',
    amount: 8800,
    date: '2026-06-01',
    time: '12:00',
    memo: '6月通信費',
  },
  {
    id: 'exp-june-7',
    title: 'カフェ・外食',
    category: 'カフェ',
    amount: 5200,
    date: '2026-06-20',
    time: '14:00',
    memo: '週末カフェランチ',
  },
];

export const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'todo-1',
    text: '7月のレシートを仕分けして家計簿に記入',
    priority: 'high',
    completed: true,
    createdAt: '2026-07-01',
  },
  {
    id: 'todo-2',
    text: '使っていないサブスクの解約検討（ジム・動画配信）',
    priority: 'high',
    completed: false,
    createdAt: '2026-07-03',
  },
  {
    id: 'todo-3',
    text: '夏休みの旅行予算プランを組む',
    priority: 'medium',
    completed: false,
    createdAt: '2026-07-06',
  },
  {
    id: 'todo-4',
    text: '日用品ストックの補充リスト作成',
    priority: 'low',
    completed: false,
    createdAt: '2026-07-10',
  },
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  { id: 'sch-1', date: '2026-07-10', text: '給与振込確認日' },
  { id: 'sch-2', date: '2026-07-12', text: 'スーパー週末セールまとめ買い' },
  { id: 'sch-3', date: '2026-07-15', text: '水道光熱費口座引き落とし' },
  { id: 'sch-4', date: '2026-07-20', text: '夏物セール買い出し' },
  { id: 'sch-5', date: '2026-07-25', text: '家賃支払い日' },
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
  familySize: '1',
  hasPet: false,
  targetSavings: 50000,
  monthlyBudget: 290000,
  userName: 'USER',
};
