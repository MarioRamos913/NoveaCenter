import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
    selectedDate: Date | null;
    onChange: (date: Date) => void;
    minDate?: Date;
}

export default function DatePicker({ selectedDate, onChange, minDate = new Date() }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

    const handleDateClick = (day: number) => {
        const newDate = new Date(year, month, day);
        onChange(newDate);
        setIsOpen(false);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(year, month - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1));
    };

    const isDateDisabled = (day: number) => {
        const date = new Date(year, month, day);
        return date < minDate;
    };

    const isDateSelected = (day: number) => {
        if (!selectedDate) return false;
        return selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;
    };

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const formatDate = (date: Date | null) => {
        if (!date) return 'Seleccionar fecha';
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Input trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-surface/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none input-glow transition-all text-left flex items-center justify-between"
            >
                <span className={selectedDate ? 'text-slate-100' : 'text-slate-600'}>
                    {formatDate(selectedDate)}
                </span>
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
            </button>

            {/* Calendar dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-2 premium-panel rounded-xl shadow-2xl p-4 w-80 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        <span className="font-display font-semibold text-white">
                            {monthNames[month]} {year}
                        </span>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Day names */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map(day => (
                            <div key={day} className="text-center text-[10px] font-bold text-slate-500 uppercase py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}

                        {/* Days of the month */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const disabled = isDateDisabled(day);
                            const selected = isDateSelected(day);

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => !disabled && handleDateClick(day)}
                                    disabled={disabled}
                                    className={`aspect-square rounded-lg text-sm font-medium transition-all
                                        ${disabled
                                            ? 'text-slate-700 cursor-not-allowed'
                                            : selected
                                                ? 'bg-gradient-to-br from-neon-indigo to-neon-purple text-white shadow-lg scale-105'
                                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
