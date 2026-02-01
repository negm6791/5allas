import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import Sidebar from './components/Sidebar';
import TodayView from './components/TodayView';
import ProjectsView from './components/ProjectsView';
import ArchiveView from './components/ArchiveView';
import Insights from './components/Insights';
import SmartInput from './components/SmartInput';
import CommandPalette from './components/CommandPalette';

const App = () => {
    const {
        activeTab,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        theme
    } = useStore();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setCommandPaletteOpen]);

    return (
        <div className="flex h-screen w-screen bg-background-base overflow-hidden text-text-main font-display transition-colors duration-500">
            <Sidebar />

            <main className="flex-1 relative flex flex-col overflow-hidden">
                <div className="noise-texture opacity-30" />
                <div className="absolute top-0 left-0 w-full h-full bg-pattern pointer-events-none opacity-40" />

                <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.99 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.01 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full w-full"
                        >
                            {activeTab === 'today' && <TodayView />}
                            {activeTab === 'projects' && <ProjectsView />}
                            {activeTab === 'insights' && <Insights />}
                            {activeTab === 'archive' && <ArchiveView />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Voice OS Bar - Floating for Today and Projects view */}
                {(activeTab === 'today' || activeTab === 'projects') && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-12 z-50">
                        <SmartInput />
                    </div>
                )}

                {/* Ambient Depth */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
            </main>

            <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
        </div>
    );
};

export default App;
