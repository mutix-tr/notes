export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
}

export interface AppState {
  notes: Note[];
  todos: Todo[];
  activeTab: 'notes' | 'todos';
  searchQuery: string;
  selectedCategory: string;
}