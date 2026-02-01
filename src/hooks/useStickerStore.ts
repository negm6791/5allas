import { useLocalStorage } from './useLocalStorage';

export const useStickerStore = () => {
    const [stickers, setStickers] = useLocalStorage<string[]>('sticker_gallery', []);

    const saveSticker = (url: string) => {
        setStickers(prev => {
            // Remove if exists to move to top
            const filtered = prev.filter(s => s !== url);
            // Add to front, limit to 50
            return [url, ...filtered].slice(0, 50);
        });
    };

    const removeSticker = (url: string) => {
        setStickers(prev => prev.filter(s => s !== url));
    };

    return {
        stickers,
        saveSticker,
        removeSticker
    };
};
