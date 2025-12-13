import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRemoteControl = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Map TV Remote keys
            const key = e.key;

            // Back button
            if (key === 'Backspace' || key === 'Escape' || key === 'BrowserBack') {
                e.preventDefault();
                navigate(-1);
                return;
            }

            // Navigation is handled natively by browser focus for Tab/Arrows mostly,
            // but we can enhance it here if needed.
            // For now, ensuring 'Enter' triggers click is standard.

            // Custom logic for specific keys if needed (e.g. Play/Pause media keys)
            if (key === 'MediaPlayPause') {
                // Toggle play
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);
};

// Spatial Navigation helper (simplified)
export const focusNextElement = (direction: 'up' | 'down' | 'left' | 'right') => {
    // This would require a more complex spatial navigation library or logic
    // For MVP, we rely on standard tab-index and browser behavior or simple arrow navigation
    // if elements are arranged in a grid.
};
