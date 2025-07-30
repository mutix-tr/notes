import React, { useState } from 'react';
import { CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import { Todo } from '../../types';
import { TodoItem } from './TodoItem';
import { TodoModal } from './TodoModal';

interface TodosProps {
  todos: Todo[];
  onAddTodo: (todo: Todo) => void;
  onUpdateTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  onToggleTodo: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const Todos: React.FC<TodosProps> = ({
  todos,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onToggleTodo,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Listen for global new todo event
  React.useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('openTodoModal', handleOpenModal);
    return () => window.removeEventListener('openTodoModal', handleOpenModal);
  }, []);

  const categories = [...new Set(todos.map(todo => todo.category))];
  
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || todo.category === selectedCategory;
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && !todo.completed) ||
                         (filter === 'completed' && todo.completed);
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.filter(todo => !todo.completed).length;
  const overdueCount = todos.filter(todo => 
    !todo.completed && todo.dueDate && new Date() > todo.dueDate
  ).length;

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSaveTodo = (todo: Todo) => {
    if (editingTodo) {
      onUpdateTodo(todo);
    } else {
      onAddTodo(todo);
    }
    setEditingTodo(undefined);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(undefined);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <Circle className="w-5 h-5" />
            <span className="font-semibold">Active Tasks</span>
          </div>
          <div className="text-3xl font-bold text-blue-700">{activeCount}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200/50">
          <div className="flex items-center gap-3 text-green-600 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Completed</span>
          </div>
          <div className="text-3xl font-bold text-green-700">{completedCount}</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 border border-red-200/50">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Overdue</span>
          </div>
          <div className="text-3xl font-bold text-red-700">{overdueCount}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            filter === 'all'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
              : 'bg-white/70 text-gray-600 hover:bg-white border border-gray-200/50'
          }`}
        >
          All ({todos.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            filter === 'active'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
              : 'bg-white/70 text-gray-600 hover:bg-white border border-gray-200/50'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            filter === 'completed'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
              : 'bg-white/70 text-gray-600 hover:bg-white border border-gray-200/50'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-gray-400" />
          </div>
          <div className="text-gray-500 text-lg font-medium mb-2">
            {searchQuery || selectedCategory || filter !== 'all' 
              ? 'No tasks found' 
              : 'No tasks yet'}
          </div>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            {searchQuery || selectedCategory || filter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first task to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggleTodo}
              onEdit={handleEditTodo}
              onDelete={onDeleteTodo}
            />
          ))}
        </div>
      )}

      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTodo}
        todo={editingTodo}
        categories={categories}
      />
    </div>
  );
};