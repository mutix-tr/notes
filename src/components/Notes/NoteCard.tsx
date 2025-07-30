import React from 'react';
import { Edit2, Trash2, Tag } from 'lucide-react';
import { Note } from '../../types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 leading-tight">
          {note.title}
        </h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-200"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-4 leading-relaxed">
        {note.content}
      </p>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-400"></div>
          <span className="font-medium">{note.category}</span>
        </div>
        <span className="font-medium">{formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
};