import React, { useState } from 'react';
import { Note } from '../../types';
import { NoteCard } from './NoteCard';
import { NoteModal } from './NoteModal';

interface NotesProps {
  notes: Note[];
  onAddNote: (note: Note) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const Notes: React.FC<NotesProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();

  // Listen for global new note event
  React.useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('openNoteModal', handleOpenModal);
    return () => window.removeEventListener('openNoteModal', handleOpenModal);
  }, []);

  const categories = [...new Set(notes.map(note => note.category))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = (note: Note) => {
    if (editingNote) {
      onUpdateNote(note);
    } else {
      onAddNote(note);
    }
    setEditingNote(undefined);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(undefined);
  };

  return (
    <div>
      {filteredNotes.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-gray-500 text-lg font-medium mb-2">
            {searchQuery || selectedCategory ? 'No notes found' : 'No notes yet'}
          </div>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            {searchQuery || selectedCategory ? 'Try adjusting your search or filter criteria' : 'Create your first note to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={onDeleteNote}
            />
          ))}
        </div>
      )}

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNote}
        note={editingNote}
        categories={categories}
      />
    </div>
  );
};