// frontend/src/components/GrowthVisualization/TreeVisualization.tsx
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const TreeVisualization = ({ level }: { level: number }) => {
    const treeConfig = useMemo(() => {
        // Base growth logic
        const baseHeight = 120;
        const maxHeight = 380;
        const height = Math.min(baseHeight + (level - 1) * 30, maxHeight);

        const trunkWidth = 12 + Math.min(level * 2, 24);
        const branches = Math.min(level * 2, 20);
        const leaves = Math.min(level * 8, 120); // More leaves for 12 levels
        const flowers = level >= 7 ? Math.min((level - 6) * 4, 25) : 0;
        const butterflies = level >= 9 ? Math.min(level - 8, 5) : 0;
        const birds = level >= 10 ? Math.min(level - 9, 3) : 0;

        return { height, trunkWidth, branches, leaves, flowers, butterflies, birds };
    }, [level]);

    const leafColors = ['#228B22', '#32CD32', '#00FF00', '#90EE90', '#3CB371'];
    const flowerColors = ['#FF69B4', '#FFB6C1', '#FF1493', '#FFD700', '#FFA500'];

    return (
        <svg
            viewBox="0 0 400 500"
            className="w-full h-full max-h-[500px]"
            style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.15))' }}
        >
            <defs>
                <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6B4423" />
                    <stop offset="50%" stopColor="#8B4513" />
                    <stop offset="100%" stopColor="#6B4423" />
                </linearGradient>

                <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B7355" />
                    <stop offset="100%" stopColor="#654321" />
                </linearGradient>

                <radialGradient id="leafGlow">
                    <stop offset="0%" stopColor="#90EE90" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#228B22" stopOpacity="0.3" />
                </radialGradient>

                <filter id="shadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="0" dy="2" result="offsetblur" />
                    <feComponentTransfer><feFuncA type="linear" slope="0.3" /></feComponentTransfer>
                    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            {/* Ground */}
            <motion.ellipse
                cx="200" cy="480" rx="150" ry="25"
                fill="url(#groundGradient)"
                initial={{ rx: 0 }}
                animate={{ rx: 150 }}
                transition={{ duration: 1.2, delay: 0.2 }}
            />

            {/* Grass */}
            {Array.from({ length: 25 }).map((_, i) => (
                <motion.line
                    key={`grass-${i}`}
                    x1={80 + i * 10} y1="480" x2={80 + i * 10 + (i % 2 ? 3 : -3)} y2="470"
                    stroke="#228B22" strokeWidth="1.5" strokeLinecap="round"
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 0.6, scaleY: 1 }}
                    transition={{ delay: 1.5 + i * 0.02 }}
                />
            ))}

            {/* Trunk */}
            <motion.rect
                x={200 - treeConfig.trunkWidth / 2}
                y={480 - treeConfig.height}
                width={treeConfig.trunkWidth}
                height={treeConfig.height}
                fill="url(#trunkGradient)"
                rx="6"
                filter="url(#shadow)"
                initial={{ height: 0, y: 480 }}
                animate={{ height: treeConfig.height, y: 480 - treeConfig.height }}
                transition={{ duration: 1.8, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.4 }}
            />

            {/* Trunk texture */}
            {Array.from({ length: Math.floor(treeConfig.height / 20) }).map((_, i) => (
                <motion.line
                    key={`texture-${i}`}
                    x1={200 - treeConfig.trunkWidth / 2 + 2}
                    y1={480 - i * 20}
                    x2={200 - treeConfig.trunkWidth / 2 + 2}
                    y2={480 - i * 20 - 8}
                    stroke="#654321" strokeWidth="1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ delay: 1 + i * 0.05 }}
                />
            ))}

            {/* Branches */}
            {Array.from({ length: treeConfig.branches }).map((_, i) => {
                const isLeft = i % 2 === 0;
                const angle = isLeft ? -30 - (i * 3) : 30 + (i * 3);
                const yPos = 480 - (treeConfig.height * (0.2 + (i / treeConfig.branches) * 0.7));
                const length = 35 + Math.min(i * 4, 60);
                const thickness = Math.max(6 - i * 0.2, 2);
                const endX = 200 + length * Math.sin(angle * Math.PI / 180);
                const endY = yPos - length * Math.cos(angle * Math.PI / 180);

                return (
                    <motion.line
                        key={`branch-${i}`}
                        x1="200" y1={yPos} x2={endX} y2={endY}
                        stroke="url(#trunkGradient)" strokeWidth={thickness}
                        strokeLinecap="round" filter="url(#shadow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 + i * 0.08 }}
                    />
                );
            })}

            {/* Leaves clustering */}
            {Array.from({ length: treeConfig.leaves }).map((_, i) => {
                const angle = (i / treeConfig.leaves) * 360;
                const radius = 60 + (i % 15) * 5;
                const cx = 200 + radius * Math.cos(angle * Math.PI / 180) * 0.8;
                const cy = (480 - treeConfig.height) - 50 + radius * Math.sin(angle * Math.PI / 180) * 0.6;
                const size = 12 + (i % 4) * 4;
                const color = leafColors[i % leafColors.length];

                return (
                    <motion.circle
                        key={`leaf-${i}`}
                        cx={cx} cy={cy} r={size}
                        fill={color} opacity="0.8"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, y: [0, -4, 0] }}
                        transition={{
                            scale: { delay: 2 + i * 0.01 },
                            y: { duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }
                        }}
                    />
                );
            })}

            {/* Flowers */}
            {Array.from({ length: treeConfig.flowers }).map((_, i) => {
                const angle = (i / treeConfig.flowers) * 360;
                const radius = 70 + (i % 5) * 10;
                const cx = 200 + radius * Math.cos(angle * Math.PI / 180) * 0.7;
                const cy = (480 - treeConfig.height) - 60 + radius * Math.sin(angle * Math.PI / 180) * 0.5;
                const color = flowerColors[i % flowerColors.length];

                return (
                    <motion.circle
                        key={`flower-${i}`}
                        cx={cx} cy={cy} r="6"
                        fill={color} stroke="#fff" strokeWidth="1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.5 + i * 0.1, type: "spring" }}
                    />
                );
            })}

            {/* Birds (Simple flying path) */}
            {Array.from({ length: treeConfig.birds }).map((_, i) => (
                <motion.g
                    key={`bird-${i}`}
                    initial={{ x: -20, y: 100 + i * 40 }}
                    animate={{ x: 420, y: [100 + i * 40, 80 + i * 40, 100 + i * 40] }}
                    transition={{ duration: 15, repeat: Infinity, delay: i * 4, ease: "linear" }}
                >
                    <path d="M 0,0 Q 5,-5 10,0 Q 5,5 0,0" fill="#333" />
                    <motion.path
                        d="M 0,0 L -5,-5 M 0,0 L -5,5"
                        stroke="#333" strokeWidth="1"
                        animate={{ rotate: [0, 20, 0, -20, 0] }}
                        transition={{ duration: 0.4, repeat: Infinity }}
                    />
                </motion.g>
            ))}

            {/* Sun effects for level 12 */}
            {level >= 12 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
                    <circle cx="350" cy="60" r="25" fill="#FFD700" />
                    {[...Array(8)].map((_, i) => (
                        <line
                            key={i} x1="350" y1="60"
                            x2={350 + 40 * Math.cos(i * 45 * Math.PI / 180)}
                            y2={60 + 40 * Math.sin(i * 45 * Math.PI / 180)}
                            stroke="#FFD700" strokeWidth="2" opacity="0.4"
                        />
                    ))}
                </motion.g>
            )}
        </svg>
    );
};

export default TreeVisualization;
