import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { TodoItem } from '../types';

interface TodoViewProps {
  todos: TodoItem[];
  onAddTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export const TodoView: React.FC<TodoViewProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}) => {
  const [todoText, setTodoText] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoText.trim()) return;

    onAddTodo({
      text: todoText.trim(),
      priority,
      completed: false,
    });

    setTodoText('');
  };

  const filteredTodos = todos.filter((item) => {
    if (filter === 'active') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="max-w-[1180px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2ede3]">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#2e6d50] uppercase">
            TASK MANAGEMENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162e22]">
            やることリスト
          </h2>
          <p className="text-xs text-[#6e8576] mt-0.5">
            日々の家計タスク、買い物リスト、支払い期日の忘れを防ぎます
          </p>
        </div>

        {/* Counts summary */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#dce7dd] text-xs font-semibold text-[#1c4e3f]">
            未完了: <strong className="font-extrabold">{activeCount}</strong> 件
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#dce7dd] text-xs font-semibold text-[#6e8576]">
            完了済: <strong className="font-extrabold">{completedCount}</strong> 件
          </div>
        </div>
      </div>

      {/* Add Todo Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e1eae1] shadow-xs">
        <h3 className="text-base font-bold text-[#162e22] mb-3">
          新規タスクを追加
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="例: サブスクの見直しをする、週末の買い出しリストを作る"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-sm text-[#162e22] focus:outline-none focus:border-[#2a7b60]"
            required
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-[#f9fbf9] border border-[#dce7dd] text-xs font-bold text-[#1c4e3f] focus:outline-none"
          >
            <option value="high">🔴 優先度：高</option>
            <option value="medium">🟡 優先度：中</option>
            <option value="low">🔵 優先度：低</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#1c4e3f] hover:bg-[#153e32] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
          >
            タスクを登録
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#e1eae1] w-fit">
        {[
          { id: 'all', label: `すべて (${todos.length})` },
          { id: 'active', label: `未完了 (${activeCount})` },
          { id: 'completed', label: `完了済み (${completedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-[#1c4e3f] text-white shadow-xs'
                : 'text-[#5a7263] hover:text-[#1c4e3f]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <div className="space-y-2.5">
        {filteredTodos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1eae1] text-xs text-[#7b9182]">
            該当するタスクはありません。新しいやることリストを追加しましょう。
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const priorityBadge =
              todo.priority === 'high'
                ? { label: '高', bg: 'bg-[#fae8e6] text-[#b94a42]' }
                : todo.priority === 'medium'
                ? { label: '中', bg: 'bg-[#fcf1db] text-[#a47029]' }
                : { label: '低', bg: 'bg-[#e5f0fa] text-[#2c6ba0]' };

            return (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  todo.completed
                    ? 'bg-[#f7faf8] border-[#e2ede4] opacity-60'
                    : 'bg-white border-[#e1eae1] shadow-xs hover:border-[#ccdccd]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => onToggleTodo(todo.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      todo.completed
                        ? 'bg-[#1c4e3f] border-[#1c4e3f] text-white'
                        : 'border-[#a8beaf] hover:border-[#1c4e3f] bg-white'
                    }`}
                  >
                    {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold shrink-0 ${priorityBadge.bg}`}
                  >
                    {priorityBadge.label}
                  </span>

                  <span
                    className={`text-sm font-semibold truncate ${
                      todo.completed
                        ? 'line-through text-[#789080]'
                        : 'text-[#162e22]'
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  title="削除"
                  className="p-1.5 text-[#a85a55] hover:bg-[#fae8e6] rounded-lg transition-colors cursor-pointer shrink-0 ml-3"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
