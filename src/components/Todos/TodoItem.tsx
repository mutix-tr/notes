import React from 'react';
import { Check, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Todo } from '../../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-amber-500 bg-amber-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return 'Normal';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const isOverdue = todo.dueDate && !todo.completed && new Date() > todo.dueDate;

  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group ${
      todo.completed ? 'opacity-75' : ''
    } ${isOverdue ? 'border-red-200/50' : 'border-gray-200/50'}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/25'
              : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
          }`}
        >
          {todo.completed && <Check className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getPriorityColor(todo.priority)}`}>
              {getPriorityText(todo.priority)}
            </span>
            <span className="text-xs text-gray-600 bg-gray-100/70 px-3 py-1 rounded-full font-medium">
              {todo.category}
            </span>
            {isOverdue && (
              <span className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3 h-3" />
                Overdue
              </span>
            )}
          </div>
          
          <p className={`text-gray-900 font-medium leading-relaxed ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.text}
          </p>
          
          {todo.dueDate && (
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{formatDate(todo.dueDate)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(todo)}
            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-200"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};