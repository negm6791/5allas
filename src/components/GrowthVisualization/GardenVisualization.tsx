// frontend/src/components/GrowthVisualization/GardenVisualization.tsx
import { motion } from 'framer-motion';

const GardenVisualization = ({ level }: { level: number }) => {
    const flowerCount = Math.min(level * 5, 60); // Scaled for 12 levels
    const butterflies = level >= 8 ? Math.min(level - 7, 6) : 0;
    const fountainLevel = level >= 10;

    return (
        <svg viewBox="0 0 300 400" className="w-full h-full drop-shadow-2xl">
            <defs>
                <radialGradient id="gardenCenter" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#A5D6A7" />
                    <stop offset="100%" stopColor="#43A047" />
                </radialGradient>
            </defs>

            {/* Grass Meadow */}
            <motion.ellipse
                cx="150" cy="320" rx="140" ry="60"
                fill="url(#gardenCenter)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "backOut" }}
            />

            {/* Flowers */}
            {Array.from({ length: flowerCount }).map((_, i) => {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * 120;
                const x = 150 + dist * Math.cos(angle);
                const y = 320 + (dist * 0.4) * Math.sin(angle);
                const colors = ["#F44336", "#E91E63", "#9C27B0", "#FFEB3B", "#FF9800", "#fff"];
                const color = colors[i % colors.length];

                return (
                    <motion.g
                        key={`flower-${i}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.05, type: "spring" }}
                    >
                        <circle cx={x} cy={y} r="5" fill={color} />
                        <circle cx={x} cy={y} r="2" fill="#FDD835" />
                    </motion.g>
                );
            })}

            {/* Fountain (High levels) */}
            {fountainLevel && (
                <motion.g
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="origin-bottom"
                >
                    <rect x="135" y="270" width="30" height="40" fill="#B0BEC5" rx="5" />
                    <motion.path
                        d="M 150 270 Q 130 250 120 270 M 150 270 Q 170 250 180 270"
                        stroke="#81D4FA" strokeWidth="3" fill="none"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />
                </motion.g>
            )}

            {/* Butterflies */}
            {Array.from({ length: butterflies }).map((_, i) => (
                <motion.g
                    key={`bt-${i}`}
                    animate={{
                        x: [100 + i * 20, 200 - i * 20, 100 + i * 20],
                        y: [250, 300, 250],
                    }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                >
                    <circle r="3" fill="#FFEB3B" />
                    <motion.rect
                        width="8" height="6" x="-4" y="-3" fill="#FFEB3B" rx="2"
                        animate={{ scaleY: [1, 0.2, 1] }}
                        transition={{ duration: 0.2, repeat: Infinity }}
                    />
                </motion.g>
            ))}
        </svg>
    );
};

export default GardenVisualization;
