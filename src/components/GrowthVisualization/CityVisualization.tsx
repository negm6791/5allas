// frontend/src/components/GrowthVisualization/CityVisualization.tsx
import { motion } from 'framer-motion';

const CityVisualization = ({ level }: { level: number }) => {
    const buildingCount = Math.min(level * 2, 24); // Scaled for 12 levels
    const stars = 40;
    const monumentLevel = level >= 12;

    return (
        <svg viewBox="0 0 300 400" className="w-full h-full drop-shadow-2xl bg-[#0F172A] rounded-3xl overflow-hidden">
            <defs>
                <linearGradient id="cityGround" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#020617" />
                </linearGradient>
            </defs>

            {/* Night Sky Stars */}
            {Array.from({ length: stars }).map((_, i) => (
                <motion.circle
                    key={`star-${i}`}
                    cx={Math.random() * 300}
                    cy={Math.random() * 250}
                    r={Math.random() * 1.5}
                    fill="#fff"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                />
            ))}

            {/* City Ground */}
            <rect x="0" y="300" width="300" height="100" fill="url(#cityGround)" />

            {/* Skyline */}
            {Array.from({ length: buildingCount }).map((_, i) => {
                const w = 15 + (i % 3) * 5;
                const h = 40 + Math.random() * 80 + (i / buildingCount) * 40;
                const x = (i * (300 / buildingCount));

                return (
                    <motion.g key={`b-${i}`} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.5 + i * 0.05 }} style={{ transformOrigin: "bottom" }}>
                        <rect x={x} y={300 - h} width={w} height={h} fill="#1E293B" />
                        {/* Windows */}
                        {Array.from({ length: Math.floor(h / 12) }).map((_, w_i) => (
                            <motion.rect
                                key={w_i}
                                x={x + 3} y={300 - h + 5 + w_i * 10}
                                width={w - 6} height="4"
                                fill={Math.random() > 0.3 ? "#FDE047" : "#334155"}
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                            />
                        ))}
                    </motion.g>
                );
            })}

            {/* Traffic Road */}
            <rect x="0" y="340" width="300" height="20" fill="#334155" />
            {Array.from({ length: 15 }).map((_, i) => (
                <motion.rect
                    key={`car-${i}`}
                    width="6" height="3" fill={i % 2 ? "#EF4444" : "#FBBF24"}
                    animate={{ x: [-20, 320] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "linear" }}
                    y={345 + (i % 2 ? 5 : -2)}
                />
            ))}

            {/* Central Tower for Level 12 */}
            {monumentLevel && (
                <motion.g initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: "bottom" }}>
                    <rect x="140" y="100" width="20" height="200" fill="#3B82F6" opacity="0.4" />
                    <rect x="145" y="80" width="10" height="220" fill="#60A5FA" />
                    <motion.circle
                        cx="150" cy="80" r="10"
                        fill="#60A5FA"
                        animate={{ filter: ["blur(0px)", "blur(10px)", "blur(0px)"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.g>
            )}
        </svg>
    );
};

export default CityVisualization;
