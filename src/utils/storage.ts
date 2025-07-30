import { Note, Todo } from '../types';

const NOTES_KEY = 'notes-todo-app-notes';
const TODOS_KEY = 'notes-todo-app-todos';

export const saveNotes = (notes: Note[]): void => {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

export const loadNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(NOTES_KEY);
    if (data) {
      return JSON.parse(data).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Error loading notes:', error);
  }
  return [];
};

export const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
};

export const loadTodos = (): Todo[] => {
  try {
    const data = localStorage.getItem(TODOS_KEY);
    if (data) {
      return JSON.parse(data).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }));
    }
  } catch (error) {
    console.error('Error loading todos:', error);
  }
  return [];
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};