import React, { useState, useEffect } from 'react';
import { FileText, CheckSquare, Download, Search, Plus } from 'lucide-react';
import { AppState, Note, Todo } from './types';
import { saveNotes, loadNotes, saveTodos, loadTodos } from './utils/storage';
import { Notes } from './components/Notes/Notes';
import { Todos } from './components/Todos/Todos';

function App() {
  const [state, setState] = useState<AppState>({
    notes: [],
    todos: [],
    activeTab: 'notes',
    searchQuery: '',
    selectedCategory: '',
  });

  useEffect(() => {
    const loadedNotes = loadNotes();
    const loadedTodos = loadTodos();
    setState(prev => ({
      ...prev,
      notes: loadedNotes,
      todos: loadedTodos,
    }));
  }, []);

  useEffect(() => {
    saveNotes(state.notes);
  }, [state.notes]);

  useEffect(() => {
    saveTodos(state.todos);
  }, [state.todos]);

  const handleAddNote = (note: Note) => {
    setState(prev => ({
      ...prev,
      notes: [note, ...prev.notes],
    }));
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ),
    }));
  };

  const handleDeleteNote = (id: string) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== id),
    }));
  };

  const handleAddTodo = (todo: Todo) => {
    setState(prev => ({
      ...prev,
      todos: [todo, ...prev.todos],
    }));
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.map(todo => 
        todo.id === updatedTodo.id ? updatedTodo : todo
      ),
    }));
  };

  const handleDeleteTodo = (id: string) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.filter(todo => todo.id !== id),
    }));
  };

  const handleToggleTodo = (id: string) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
  };

  const handleExportData = () => {
    const data = {
      notes: state.notes,
      todos: state.todos,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-todos-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Notes</h1>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={state.searchQuery}
                onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100/70 border-0 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all duration-200 text-sm"
              />
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 p-6">
            <div className="space-y-2">
              <button
                onClick={() => setState(prev => ({ 
                  ...prev, 
                  activeTab: 'notes',
                  selectedCategory: ''
                }))}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  state.activeTab === 'notes'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-gray-700 hover:bg-gray-100/70'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">All Notes</span>
                <span className="ml-auto text-sm opacity-75">
                  {state.notes.length}
                </span>
              </button>
              
              <button
                onClick={() => setState(prev => ({ 
                  ...prev, 
                  activeTab: 'todos',
                  selectedCategory: ''
                }))}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  state.activeTab === 'todos'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-gray-700 hover:bg-gray-100/70'
                }`}
              >
                <CheckSquare className="w-5 h-5" />
                <span className="font-medium">Tasks</span>
                <span className="ml-auto text-sm opacity-75">
                  {state.todos.filter(t => !t.completed).length}
                </span>
              </button>
            </div>
            
            {/* Categories */}
            {(state.activeTab === 'notes' ? [...new Set(state.notes.map(n => n.category))] : [...new Set(state.todos.map(t => t.category))]).length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-3 px-4">Categories</h3>
                <div className="space-y-1">
                  {(state.activeTab === 'notes' ? [...new Set(state.notes.map(n => n.category))] : [...new Set(state.todos.map(t => t.category))]).map((category) => (
                    <button
                      key={category}
                      onClick={() => setState(prev => ({ ...prev, selectedCategory: category }))}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all duration-200 text-sm ${
                        state.selectedCategory === category
                          ? 'bg-gray-200/70 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-100/50'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-gray-200/50">
            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100/70 rounded-xl transition-all duration-200"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Export Data</span>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white/50 backdrop-blur-xl border-b border-gray-200/50 px-8 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {state.activeTab === 'notes' ? 'Notes' : 'Tasks'}
                {state.selectedCategory && ` • ${state.selectedCategory}`}
              </h2>
              <button
                onClick={() => {
                  if (state.activeTab === 'notes') {
                    // Trigger new note modal
                    const event = new CustomEvent('openNoteModal');
                    window.dispatchEvent(event);
                  } else {
                    // Trigger new todo modal
                    const event = new CustomEvent('openTodoModal');
                    window.dispatchEvent(event);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">
                  {state.activeTab === 'notes' ? 'New Note' : 'New Task'}
                </span>
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-auto p-8">
            {state.activeTab === 'notes' ? (
              <Notes
                notes={state.notes}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                searchQuery={state.searchQuery}
                onSearchChange={(query) => setState(prev => ({ ...prev, searchQuery: query }))}
                selectedCategory={state.selectedCategory}
                onCategoryChange={(category) => setState(prev => ({ ...prev, selectedCategory: category }))}
              />
            ) : (
              <Todos
                todos={state.todos}
                onAddTodo={handleAddTodo}
                onUpdateTodo={handleUpdateTodo}
                onDeleteTodo={handleDeleteTodo}
                onToggleTodo={handleToggleTodo}
                searchQuery={state.searchQuery}
                onSearchChange={(query) => setState(prev => ({ ...prev, searchQuery: query }))}
                selectedCategory={state.selectedCategory}
                onCategoryChange={(category) => setState(prev => ({ ...prev, selectedCategory: category }))}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;