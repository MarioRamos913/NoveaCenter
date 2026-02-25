import { useState, useRef, useEffect } from 'react';
import './DatePicker.css';

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
        <div ref={containerRef} className="datepicker-container">
            {/* Input trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="datepicker-trigger"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-label={selectedDate ? `Fecha seleccionada: ${formatDate(selectedDate)}` : 'Seleccionar fecha de vencimiento'}
            >
                <span className={`datepicker-trigger-text ${!selectedDate ? 'placeholder' : ''}`}>
                    {formatDate(selectedDate)}
                </span>
                <svg className="datepicker-trigger-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
            </button>

            {/* Calendar dropdown */}
            {isOpen && (
                <div className="datepicker-dropdown" role="dialog" aria-label="Calendario">
                    {/* Header */}
                    <header className="datepicker-header">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="datepicker-nav-button"
                            aria-label="Mes anterior"
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        <span className="datepicker-month-year" aria-live="polite">
                            {monthNames[month]} {year}
                        </span>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="datepicker-nav-button"
                            aria-label="Mes siguiente"
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </header>

                    {/* Day names */}
                    <div className="datepicker-daynames" aria-hidden="true">
                        {dayNames.map(day => (
                            <div key={day} className="datepicker-dayname">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="datepicker-grid" role="grid">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                            <div key={`empty-${i}`} className="datepicker-empty" role="gridcell" aria-hidden="true" />
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
                                    className={`datepicker-day ${disabled ? 'disabled' :
                                        selected ? 'selected' :
                                            'available'
                                        }`}
                                    role="gridcell"
                                    aria-selected={selected}
                                    aria-label={`${day} de ${monthNames[month]} ${year}`}
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
