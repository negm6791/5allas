// frontend/src/hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    // Get from local storage then parse or return initialValue
    const readValue = useCallback((): T => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    }, [initialValue, key]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            // Dispatch a custom event to notify other instances in the same tab
            window.dispatchEvent(new Event('local-storage-update-' + key));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    }, [key, storedValue]);

    useEffect(() => {
        const handleUpdate = () => setStoredValue(readValue());
        window.addEventListener('storage', handleUpdate);
        window.addEventListener('local-storage-update-' + key, handleUpdate);
        return () => {
            window.removeEventListener('storage', handleUpdate);
            window.removeEventListener('local-storage-update-' + key, handleUpdate);
        };
    }, [key, readValue]);

    return [storedValue, setValue] as const;
}
