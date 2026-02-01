import { useLocalStorage } from './useLocalStorage';
import { Note } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useDailyNotes = (date: string) => {
    // Store as Record<dateString, Note[]>
    const [allNotes, setAllNotes] = useLocalStorage<Record<string, Note[]>>('5allas_daily_notes', {});

    const notes = allNotes[date] || [];

    const addNote = (content: string, color: string = 'bg-yellow-100') => {
        const newNote: Note = {
            id: uuidv4(),
            content,
            createdAt: new Date().toISOString(),
            color
        };

        setAllNotes(prev => ({
            ...prev,
            [date]: [newNote, ...(prev[date] || [])]
        }));
    };

    const addSticker = (noteId: string, item: File | string) => {
        const createSticker = (url: string) => {
            const newSticker = {
                id: uuidv4(),
                url: url,
                x: 50, // Center initially
                y: 50,
                width: 64, // Default size
                height: 64,
                rotation: Math.random() * 30 - 15
            };

            setAllNotes(prev => ({
                ...prev,
                [date]: (prev[date] || []).map(note =>
                    note.id === noteId
                        ? { ...note, stickers: [...(note.stickers || []), newSticker] }
                        : note
                )
            }));
            return newSticker.url;
        };

        if (typeof item === 'string') {
            createSticker(item);
            return;
        }

        // Image resizing logic for File
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 150;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/webp', 0.8);
                createSticker(dataUrl);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(item);
    };

    const updateSticker = (noteId: string, stickerId: string, updates: Partial<any>) => {
        setAllNotes(prev => ({
            ...prev,
            [date]: (prev[date] || []).map(note =>
                note.id === noteId
                    ? {
                        ...note,
                        stickers: (note.stickers || []).map(s =>
                            s.id === stickerId ? { ...s, ...updates } : s
                        )
                    }
                    : note
            )
        }));
    };

    const deleteSticker = (noteId: string, stickerId: string) => {
        setAllNotes(prev => ({
            ...prev,
            [date]: (prev[date] || []).map(note =>
                note.id === noteId
                    ? {
                        ...note,
                        stickers: (note.stickers || []).filter(s => s.id !== stickerId)
                    }
                    : note
            )
        }));
    };

    const deleteNote = (id: string) => {
        setAllNotes(prev => ({
            ...prev,
            [date]: (prev[date] || []).filter(n => n.id !== id)
        }));
    };

    return {
        notes,
        addNote,
        deleteNote,
        addSticker,
        updateSticker,
        deleteSticker
    };
};
