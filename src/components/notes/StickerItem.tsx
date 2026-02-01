import React, { useState, useRef, useEffect } from 'react';
import { Sticker } from '../../types';
import { X, Maximize2, RotateCw } from 'lucide-react';

interface StickerItemProps {
    sticker: Sticker;
    noteId: string;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<Sticker>) => void;
    onDelete: () => void;
}

export const StickerItem: React.FC<StickerItemProps> = ({
    sticker,
    isSelected,
    onSelect,
    onUpdate,
    onDelete
}) => {
    // Local state for smooth dragging/resizing
    const [localSticker, setLocalSticker] = useState(sticker);
    const [isInteracting, setIsInteracting] = useState(false);

    // Sync local state when prop updates (and not currently dragging)
    useEffect(() => {
        if (!isInteracting) {
            setLocalSticker(sticker);
        }
    }, [sticker, isInteracting]);

    const dragStartRef = useRef<{ x: number, y: number } | null>(null);
    const initialValuesRef = useRef<{ x: number, y: number, w: number, h: number, rotation: number } | null>(null);
    const containerRef = useRef<HTMLElement | null>(null);
    const interactionTypeRef = useRef<'move' | 'resize' | 'rotate' | null>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    const hasMovedRef = useRef(false);

    const handlePointerDown = (e: React.PointerEvent, type: 'move' | 'resize' | 'rotate') => {
        e.stopPropagation();
        e.preventDefault();

        setIsInteracting(true);
        interactionTypeRef.current = type;
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        hasMovedRef.current = false; // Reset move tracking

        initialValuesRef.current = {
            x: localSticker.x,
            y: localSticker.y,
            w: localSticker.width,
            h: localSticker.height,
            rotation: localSticker.rotation
        };

        const target = e.currentTarget as HTMLElement;
        target.setPointerCapture(e.pointerId);

        if (type === 'move') {
            const noteCard = target.closest('.note-card') as HTMLElement;
            containerRef.current = noteCard;
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isInteracting || !initialValuesRef.current || !dragStartRef.current) return;

        const deltaX_px = e.clientX - dragStartRef.current.x;
        const deltaY_px = e.clientY - dragStartRef.current.y;

        // Check threshold for "move" vs "click"
        if (!hasMovedRef.current) {
            const distance = Math.sqrt(deltaX_px * deltaX_px + deltaY_px * deltaY_px);
            if (distance > 5) {
                hasMovedRef.current = true;
            } else {
                // If we haven't moved enough, don't update state yet
                return;
            }
        }

        if (interactionTypeRef.current === 'move') {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();

            const deltaX_pct = (deltaX_px / rect.width) * 100;
            const deltaY_pct = (deltaY_px / rect.height) * 100;

            const newX = Math.max(0, Math.min(100, initialValuesRef.current!.x + deltaX_pct));
            const newY = Math.max(0, Math.min(100, initialValuesRef.current!.y + deltaY_pct));

            setLocalSticker(prev => ({
                ...prev,
                x: newX,
                y: newY
            }));
        } else if (interactionTypeRef.current === 'resize') {
            const deltaX = e.clientX - dragStartRef.current.x;
            const oldWidth = initialValuesRef.current.w;
            const newWidth = Math.max(20, oldWidth + deltaX);
            const scale = newWidth / oldWidth;
            const newHeight = initialValuesRef.current.h * scale;

            setLocalSticker(prev => ({
                ...prev,
                width: newWidth,
                height: newHeight
            }));
        } else if (interactionTypeRef.current === 'rotate') {
            if (!elementRef.current) return;
            const rect = elementRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const radians = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const degrees = radians * (180 / Math.PI);
            const rotation = degrees + 90;

            setLocalSticker(prev => ({
                ...prev,
                rotation: rotation
            }));
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isInteracting) return;

        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsInteracting(false);
        interactionTypeRef.current = null;

        // If we didn't move (it was a click), select the sticker
        if (!hasMovedRef.current) {
            onSelect();
        }

        // Always fire update on release to ensure sync
        onUpdate({
            x: localSticker.x,
            y: localSticker.y,
            width: localSticker.width,
            height: localSticker.height,
            rotation: localSticker.rotation
        });
    };

    return (
        <div
            ref={elementRef}
            className={`absolute z-20 ${isSelected ? 'cursor-move' : 'cursor-grab'} drop-shadow-md`}
            style={{
                left: `${localSticker.x}%`,
                top: `${localSticker.y}%`,
                width: `${localSticker.width}px`,
                height: `${localSticker.height}px`,
                transform: `translate(-50%, -50%) rotate(${localSticker.rotation}deg)`,
                touchAction: 'none'
            }}
            onPointerDown={(e) => handlePointerDown(e, 'move')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={(e) => e.stopPropagation()} // Prevent click from deselecting
        >
            {/* Outline when selected */}
            {isSelected && (
                <div className="absolute inset-0 border-2 border-indigo-500 border-dashed pointer-events-none" />
            )}

            <img
                src={localSticker.url}
                alt="sticker"
                className="w-full h-full object-contain pointer-events-none select-none"
            />

            {isSelected && (
                <>
                    {/* Rotate Handle (Top Center) */}
                    <div
                        className="absolute -top-6 left-1/2 -translate-x-1/2 p-1.5 bg-white border border-indigo-500 rounded-full shadow-sm cursor-grab hover:bg-slate-50 transition-colors z-40"
                        onPointerDown={(e) => handlePointerDown(e, 'rotate')}
                    >
                        <RotateCw className="w-3 h-3 text-indigo-500" />
                    </div>

                    {/* Delete Button (Top Right) */}
                    <button
                        className="absolute -top-3 -right-3 p-1 bg-rose-500 text-white rounded-full shadow-sm hover:scale-110 transition-transform z-50"
                        onPointerDown={(e) => e.stopPropagation()} // Stop drag
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <X className="w-3 h-3" />
                    </button>

                    {/* Resize Handle (Bottom Right) */}
                    <div
                        className="absolute -bottom-2 -right-2 p-1 bg-white border border-indigo-500 rounded-full shadow-sm cursor-nwse-resize z-40"
                        onPointerDown={(e) => handlePointerDown(e, 'resize')}
                    >
                        <Maximize2 className="w-3 h-3 text-indigo-500" />
                    </div>
                </>
            )}
        </div>
    );
};
