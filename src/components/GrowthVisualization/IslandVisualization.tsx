// frontend/src/components/GrowthVisualization/IslandVisualization.tsx
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const IslandVisualization = ({ level }: { level: number }) => {
    const islandSize = useMemo(() => 80 + level * 10, [level]);
    const palmTrees = Math.min(level, 12); // Scaled for 12 levels
    const buildings = level >= 5 ? Math.min(level - 4, 10) : 0; // Scaled for 12 levels

    return (
        <svg viewBox="0 0 300 400" className="w-full h-full drop-shadow-2xl">
            <defs>
                <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4FC3F7" />
                    <stop offset="100%" stopColor="#0288D1" />
                </linearGradient>
                <linearGradient id="islandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFF59D" />
                    <stop offset="100%" stopColor="#FBC02D" />
                </linearGradient>
                <linearGradient id="palmTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5D4037" />
                    <stop offset="100%" stopColor="#3E2723" />
                </linearGradient>
            </defs>

            {/* Ocean */}
            <motion.rect
                x="0" y="280" width="300" height="120"
                fill="url(#oceanGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            />

            {/* Shore Foam */}
            <motion.ellipse
                cx="150" cy="320" rx={islandSize + 25} ry={(islandSize + 25) * 0.3}
                fill="#81D4FA" opacity="0.3"
                initial={{ rx: 0, ry: 0 }}
                animate={{ rx: islandSize + 25, ry: (islandSize + 25) * 0.3 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Main Island */}
            <motion.ellipse
                cx="150" cy="320" rx={islandSize} ry={islandSize * 0.3}
                fill="url(#islandGradient)"
                initial={{ rx: 0, ry: 0 }}
                animate={{ rx: islandSize, ry: islandSize * 0.3 }}
                transition={{ duration: 1.5, ease: "backOut" }}
            />

            {/* Palm Trees */}
            {Array.from({ length: palmTrees }).map((_, i) => {
                const angle = (i / palmTrees) * Math.PI * 2;
                const dist = islandSize * (0.5 + Math.random() * 0.2); // Randomize bit for natural look
                const x = 150 + dist * Math.cos(angle);
                const y = 320 + (dist * 0.3) * Math.sin(angle);
                const h = 40 + (i % 4) * 10;

                return (
                    <motion.g
                        key={`palm-${i}`}
                        initial={{ scale: 0, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: 1 + i * 0.1, type: "spring" }}
                        style={{ transformOrigin: `${x}px ${y}px` }}
                    >
                        <path
                            d={`M ${x - 2} ${y} Q ${x} ${y - h / 2} ${x + 5} ${y - h}`}
                            stroke="url(#palmTrunk)" strokeWidth="4" fill="none" strokeLinecap="round"
                        />
                        {/* Leaves */}
                        {[0, 72, 144, 216, 288].map((rot) => (
                            <motion.ellipse
                                key={rot} cx={x + 5} cy={y - h} rx="18" ry="6" fill="#1B5E20"
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ delay: 1.5 + i * 0.05 }}
                                style={{ transformOrigin: `${x + 5}px ${y - h}px`, transform: `rotate(${rot}deg)` }}
                            />
                        ))}
                    </motion.g>
                );
            })}

            {/* Buildings (Village) */}
            {Array.from({ length: buildings }).map((_, i) => {
                const x = 150 + ((i % 5) - 2) * 20;
                const y = 310 - Math.floor(i / 5) * 15;
                const h = 25 + (i % 3) * 6;

                return (
                    <motion.rect
                        key={`b-${i}`} x={x - 8} y={y - h} width="16" height={h}
                        fill="#D7CCC8" stroke="#5D4037" strokeWidth="1.5"
                        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                        transition={{ delay: 2 + i * 0.1 }}
                        style={{ transformOrigin: "bottom" }}
                    />
                );
            })}

            {/* Ship for level 12 */}
            {level >= 12 && (
                <motion.g
                    initial={{ x: -60, y: 360 }}
                    animate={{ x: 360, y: [355, 365, 355] }}
                    transition={{ x: { duration: 25, repeat: Infinity }, y: { duration: 4, repeat: Infinity } }}
                >
                    <path d="M 0,0 L 40,0 L 30,15 L 10,15 Z" fill="#4E342E" />
                    <path d="M 20,0 L 20,-20 L 5,-10 L 20,-5" fill="#fff" stroke="#333" />
                </motion.g>
            )}
        </svg>
    );
};

export default IslandVisualization;
