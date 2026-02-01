import React, { useState } from 'react';
import {
    format,
    startOfYear,
    endOfYear,
    eachDayOfInterval,
    isSameDay,
    startOfMonth,
    endOfMonth,
    eachMonthOfInterval,
    getDay
} from 'date-fns';
import { RefreshCw, Palmtree, Edit3, Check, Minus } from 'lucide-react';

interface HeatmapProps {
    data: { date: string; completionRate: number }[];
    holidays: string[];
    onToggleHoliday: (date: string) => void;
    onDateSelect?: (date: string) => void;
    selectedDate?: string | null;
}

export const Heatmap: React.FC<HeatmapProps> = ({ data, holidays, onToggleHoliday, onDateSelect, selectedDate }) => {
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);
    const [isHolidayMode, setIsHolidayMode] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const now = new Date();
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    // Custom Status Logic: Success, Failure, Holiday
    const getLevelInfo = (rate: number, isHoliday: boolean) => {
        if (isHoliday) return {
            type: 'holiday',
            bg: 'bg-slate-800',
            border: 'border-slate-900',
            text: 'Holiday',
            icon: Minus,
            iconColor: 'text-white'
        };

        if (rate <= 0) return { type: 'empty', bg: 'bg-slate-50', border: 'border-slate-100', text: 'No Activity' };

        if (rate === 100) return {
            type: 'success',
            bg: 'bg-emerald-600',
            border: 'border-emerald-700',
            text: 'All Tasks Done',
            icon: Check,
            iconColor: 'text-white'
        };

        if (rate >= 70) return {
            type: 'high',
            bg: 'bg-emerald-500',
            border: 'border-emerald-600',
            text: 'High Intensity',
            icon: Check,
            iconColor: 'text-white'
        };

        if (rate >= 30) return {
            type: 'medium',
            bg: 'bg-emerald-400',
            border: 'border-emerald-500',
            text: 'Medium Intensity',
            icon: Check,
            iconColor: 'text-white/50'
        };

        // Low concentration
        return {
            type: 'low',
            bg: 'bg-emerald-200',
            border: 'border-emerald-300',
            text: 'Low Intensity',
            icon: Check,
            iconColor: 'text-emerald-500'
        };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        setTooltipPos({ x: e.clientX, y: e.clientY });
    };

    return (
        <div className={`bg-white rounded-3xl border transition-all duration-700 shadow-xl p-6 relative overflow-visible group/matrix ${isHolidayMode ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-100'}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 font-sans">Yearly Overview</p>
                        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tighter">Year Board</h2>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsHolidayMode(!isHolidayMode)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${isHolidayMode
                                ? 'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-200 scale-105'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            {isHolidayMode ? <Palmtree className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                            {isHolidayMode ? 'Save Holidays' : 'Edit Holidays'}
                        </button>

                        {selectedDate && (
                            <button
                                onClick={() => onDateSelect && onDateSelect(format(new Date(), 'yyyy-MM-dd'))}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all border border-indigo-100"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Return to Today
                            </button>
                        )}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 bg-slate-50/80 backdrop-blur-sm px-4 py-2.5 rounded-full border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-200" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide ml-1">Intensity</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200 mx-1" />
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ring-2 ring-slate-200" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Holiday</span>
                    </div>
                </div>
            </div>

            {/* Matrix Grid - More Columns = Less Height */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-12 gap-y-10">
                {months.map((monthDate, mIndex) => {
                    const mStart = startOfMonth(monthDate);
                    const mEnd = endOfMonth(monthDate);
                    const daysInMonth = eachDayOfInterval({ start: mStart, end: mEnd });

                    return (
                        <div
                            key={monthDate.toISOString()}
                            className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000"
                            style={{ animationDelay: `${mIndex * 40}ms` }}
                        >
                            <div className="flex items-end justify-between px-1 border-b border-slate-100 pb-2">
                                <span className="text-sm font-black text-slate-800 uppercase tracking-widest">
                                    {format(monthDate, 'MMM')}
                                </span>
                                <span className="text-[10px] font-bold text-slate-300">
                                    {format(monthDate, 'yy')}
                                </span>
                            </div>

                            <div className="grid grid-cols-7 gap-2 relative">
                                {Array.from({ length: getDay(mStart) }).map((_, i) => (
                                    <div key={`spacer-${i}`} className="w-[12px] h-[12px]" />
                                ))}

                                {daysInMonth.map((day) => {
                                    const dayString = format(day, 'yyyy-MM-dd');
                                    const dayData = data.find(d => isSameDay(new Date(d.date), day));
                                    const rate = dayData ? dayData.completionRate : 0;
                                    const isFuture = day > now && !isSameDay(day, now);
                                    const isToday = isSameDay(day, now);
                                    const isHoliday = holidays.includes(dayString);
                                    const isSelected = selectedDate === dayString;
                                    const info = getLevelInfo(rate, isHoliday);

                                    // Simplified logic: Render clean squares
                                    return (
                                        <div
                                            key={day.toISOString()}
                                            onClick={() => {
                                                if (isHolidayMode) {
                                                    onToggleHoliday(dayString);
                                                } else if (onDateSelect && !isFuture) {
                                                    onDateSelect(dayString);
                                                }
                                            }}
                                            onMouseEnter={(e) => {
                                                setHoveredDay(dayString);
                                                handleMouseMove(e);
                                            }}
                                            onMouseLeave={() => setHoveredDay(null)}
                                            className={`
                                                w-[12px] h-[12px] rounded-[3px] transition-all duration-300 cursor-pointer
                                                relative flex items-center justify-center
                                                ${isFuture ? 'bg-slate-100 opacity-20 pointer-events-none' : `${info.bg}`}
                                                ${!isFuture && !isSelected ? 'hover:scale-150 hover:rounded-sm hover:z-50 hover:shadow-lg ring-1 ring-black/5' : ''}
                                                ${isSelected ? 'ring-2 ring-indigo-600 ring-offset-2 scale-125 z-20 shadow-md' : ''}
                                                ${isToday ? 'ring-1 ring-slate-400' : ''}
                                                ${isHolidayMode && !isFuture ? 'hover:ring-2 hover:ring-rose-300' : ''}
                                            `}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tooltip */}
            {hoveredDay && (
                <div
                    className="fixed pointer-events-none z-[100] px-4 py-3 bg-slate-900/95 text-white rounded-xl shadow-2xl transition-all duration-100 -translate-x-1/2 -translate-y-[130%] animate-in fade-in zoom-in-95 backdrop-blur-md border border-white/10"
                    style={{ left: tooltipPos.x, top: tooltipPos.y }}
                >
                    <div className="relative text-center min-w-[120px] space-y-0.5">
                        <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-400">{format(new Date(hoveredDay), 'yyyy')}</p>
                        <p className="text-base font-bold text-white">{format(new Date(hoveredDay), 'MMM dd')}</p>

                        <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-white/10">
                            {holidays.includes(hoveredDay) ? (
                                <span className="text-[10px] font-bold uppercase tracking-wide text-rose-400">Rest Day</span>
                            ) : (
                                <span className="text-[10px] font-bold uppercase tracking-wide text-blue-400">
                                    {data.find(d => d.date === hoveredDay)?.completionRate || 0}% Done
                                </span>
                            )}
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 mt-[-4px]" />
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100 gap-4">
                <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Operational</p>
                </div>
            </div>
            {/* Noise Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};
