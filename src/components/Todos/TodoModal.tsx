import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Todo } from '../../types';
import { generateId } from '../../utils/storage';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Todo) => void;
  todo?: Todo;
  categories: string[];
}

export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  todo,
  categories,
}) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (todo) {
      setText(todo.text);
      setPriority(todo.priority);
      setCategory(todo.category);
      setDueDate(todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '');
    } else {
      setText('');
      setPriority('medium');
      setCategory('');
      setDueDate('');
    }
    setNewCategory('');
  }, [todo, isOpen]);

  const handleSave = () => {
    if (!text.trim()) return;

    const finalCategory = newCategory.trim() || category || 'Genel';
    const now = new Date();

    const savedTodo: Todo = {
      id: todo?.id || generateId(),
      text: text.trim(),
      completed: todo?.completed || false,
      priority,
      category: finalCategory,
      createdAt: todo?.createdAt || now,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    onSave(savedTodo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-md shadow-2xl border border-gray-200/50">
        <div className="flex items-center justify-between p-8 border-b border-gray-200/50">
          <h2 className="text-2xl font-semibold text-gray-900">
            {todo ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/70 rounded-xl transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Task
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
              placeholder="Enter task description..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Category
            </label>
            <div className="space-y-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
                placeholder="Or create new category..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-8 border-t border-gray-200/50 bg-gray-50/30">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100/70 transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 font-medium shadow-lg shadow-orange-500/25"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};