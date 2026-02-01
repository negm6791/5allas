import React, { useState } from 'react';
import { useDailyNotes } from '../../hooks/useDailyNotes';
import { useStickerStore } from '../../hooks/useStickerStore';
import { StickerItem } from './StickerItem';
import { Plus, Trash2, StickyNote, Briefcase, X } from 'lucide-react';

interface DailyNotesProps {
    date: string;
}

const NOTE_COLORS = [
    {
        id: 'purple',
        bg: 'bg-[#E6E6FA]', // Lavender
        lines: 'linear-gradient(transparent 95%, #DCDCDC 95%)',
        rotate: 'rotate-1'
    },
    {
        id: 'teal',
        bg: 'bg-[#E0F2F1]', // Mint
        lines: 'linear-gradient(transparent 95%, #B2DFDB 95%)',
        rotate: '-rotate-2'
    },
    {
        id: 'pink',
        bg: 'bg-[#FFDEEB]', // Rose
        lines: 'linear-gradient(transparent 95%, #F8BBD0 95%)',
        rotate: 'rotate-2'
    },
    {
        id: 'peach',
        bg: 'bg-[#FFE5B4]', // Peach
        lines: 'linear-gradient(transparent 95%, #FFE0B2 95%)',
        rotate: '-rotate-1'
    },
];

export const DailyNotes: React.FC<DailyNotesProps> = ({ date }) => {
    const { notes, addNote, deleteNote, addSticker, updateSticker, deleteSticker } = useDailyNotes(date);
    const { stickers: savedStickers, saveSticker } = useStickerStore();
    const [content, setContent] = useState('');
    const [selectedColorIdx, setSelectedColorIdx] = useState(0);
    const [openGalleryId, setOpenGalleryId] = useState<string | null>(null);
    const [selectedSticker, setSelectedSticker] = useState<{ noteId: string, stickerId: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        addNote(content, selectedColorIdx.toString());
        setContent('');
    };

    const processAndAddSticker = (noteId: string, file: File) => {
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

                // 1. Add to Note
                addSticker(noteId, dataUrl);
                // 2. Save to Gallery
                saveSticker(dataUrl);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleFileUpload = (noteId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processAndAddSticker(noteId, e.target.files[0]);
        }
    };

    const handlePaste = (noteId: string, e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    processAndAddSticker(noteId, file);
                    e.preventDefault(); // Prevent default paste behavior
                }
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-visible mt-4">
            <h3 className="text-sm font-black text-indigo-950 uppercase tracking-tight mb-4 flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-indigo-500" />
                Daily Notes Board
            </h3>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="mb-8 flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a note..."
                        className="w-full pl-4 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xl font-bold text-slate-600 focus:border-indigo-200 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                        style={{ fontFamily: "'Kalam', cursive" }}
                    />
                </div>

                {/* Color Selector */}
                <div className="flex gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                    {NOTE_COLORS.map((color, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedColorIdx(idx)}
                            className={`w-6 h-6 rounded-full border border-slate-200 ${color.bg} transition-all ${selectedColorIdx === idx ? 'ring-2 ring-offset-2 ring-slate-300 scale-110 shadow-md' : 'opacity-70 hover:opacity-100'}`}
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    className="p-3 bg-indigo-900 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-950 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            {/* Sticky Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2 pb-4">
                {notes.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-100">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Empty Board</p>
                    </div>
                ) : (
                    notes.map((note) => {
                        const colorIdx = parseInt(note.color || '0');
                        const theme = NOTE_COLORS[colorIdx] || NOTE_COLORS[0];
                        const isGalleryOpen = openGalleryId === note.id;

                        return (
                            <div
                                key={note.id}
                                tabIndex={0}
                                onPaste={(e) => handlePaste(note.id, e)}
                                // Add class 'note-card' for checking in handlers
                                className={`group note-card relative p-5 rounded-none shadow-md transition-all hover:scale-105 hover:z-10 hover:shadow-xl h-48 flex flex-col ${theme.bg} ${theme.rotate} outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 cursor-default`}
                                style={{
                                    backgroundImage: theme.lines,
                                    backgroundSize: '100% 24px' // Standard line height
                                }}
                                onClick={() => setSelectedSticker(null)} // Deselect when clicking note bg
                            >
                                {/* Realistic Pin */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 group-hover:-translate-y-1 transition-transform duration-300">
                                    <div className="relative">
                                        {/* Pin Shadow */}
                                        <div className="absolute top-3 left-1 w-4 h-4 bg-black/30 rounded-full blur-[2px] transform skew-x-12 scale-y-50" />

                                        {/* Pin Head */}
                                        <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-900 shadow-[inset_1px_1px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]">
                                            {/* Specular Highlight */}
                                            <div className="absolute top-1 left-1.5 w-2 h-1.5 bg-gradient-to-b from-white/90 to-white/10 rounded-full blur-[0.5px]" />
                                            {/* Center Indent */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-800 rounded-full opacity-50 shadow-inner" />
                                        </div>

                                        {/* Needle (Hidden/Piercing) */}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-zinc-500/50 rounded-b-full shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
                                    </div>
                                </div>

                                <p
                                    className="text-lg font-bold text-black whitespace-pre-wrap leading-[24px] flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-2"
                                    style={{ fontFamily: "'Kalam', cursive" }}
                                >
                                    {note.content}
                                </p>

                                {/* Stickers Layer */}
                                {note.stickers?.map(sticker => (
                                    <StickerItem
                                        key={sticker.id}
                                        sticker={sticker}
                                        noteId={note.id}
                                        isSelected={selectedSticker?.noteId === note.id && selectedSticker?.stickerId === sticker.id}
                                        onSelect={() => setSelectedSticker({ noteId: note.id, stickerId: sticker.id })}
                                        onUpdate={(updates) => updateSticker(note.id, sticker.id, updates)}
                                        onDelete={() => deleteSticker(note.id, sticker.id)}
                                    />
                                ))}

                                {/* Gallery Popover */}
                                {isGalleryOpen && (
                                    <div className="absolute bottom-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-50 mb-2 animate-in fade-in zoom-in-95 origin-bottom-left" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Sticker Store</span>
                                            <button onClick={() => setOpenGalleryId(null)} className="text-slate-300 hover:text-slate-500">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                                            {/* Upload Option */}
                                            <label className="aspect-square bg-slate-50 hover:bg-slate-100 rounded-lg border border-dashed border-slate-200 flex items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-indigo-500">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        handleFileUpload(note.id, e);
                                                        setOpenGalleryId(null);
                                                    }}
                                                />
                                                <Plus className="w-4 h-4" />
                                            </label>

                                            {/* Saved Stickers */}
                                            {savedStickers.map((url, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        addSticker(note.id, url);
                                                        setOpenGalleryId(null);
                                                    }}
                                                    className="aspect-square bg-slate-50 hover:bg-slate-100 rounded-lg p-1 border border-transparent hover:border-indigo-100 transition-all"
                                                >
                                                    <img src={url} className="w-full h-full object-contain" alt="sticker" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-2 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity relative z-30">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase font-sans">
                                        {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>

                                    <div className="flex gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenGalleryId(isGalleryOpen ? null : note.id);
                                            }}
                                            className={`p-1.5 rounded-lg transition-all ${isGalleryOpen ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-white/50'}`}
                                            title="Sticker Store"
                                        >
                                            <Briefcase className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNote(note.id);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white/50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
