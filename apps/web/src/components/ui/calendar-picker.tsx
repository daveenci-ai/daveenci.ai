/**
 * Custom Calendar Picker Component
 * Integrated with Google Calendar availability
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Loader2 } from 'lucide-react';
import { Button } from './button';

interface TimeSlot {
  start: string;
  end: string;
  display: string;
}

interface CalendarPickerProps {
  onSelectSlot: (slot: { start: string; end: string; display: string }) => void;
  selectedSlot?: { start: string; end: string } | null;
  timezone?: string;
}

export function CalendarPicker({ onSelectSlot, selectedSlot, timezone = 'America/Chicago' }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Fetch available slots when date is selected
  useEffect(() => {
    const fetchAvailableSlotsForDate = async (date: Date) => {
      setLoading(true);
      setError(null);

      try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const response = await fetch(
          `${apiUrl}/bookings/availability?` +
          `startDate=${startOfDay.toISOString()}&` +
          `endDate=${endOfDay.toISOString()}&` +
          `timezone=${timezone}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.details || 'Failed to fetch availability');
        }

        const data = await response.json();
        setAvailableSlots(data.slots || []);
      } catch (err) {
        console.error('Error fetching slots:', err);
        setError(err instanceof Error ? err.message : 'Unable to load available times. Please try again.');
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchAvailableSlotsForDate(selectedDate);
    }
  }, [selectedDate, apiUrl, timezone]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
    setAvailableSlots([]);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
    setAvailableSlots([]);
  };

  const handleDateClick = (date: Date) => {
    if (isPast(date) || isWeekend(date)) return;
    setSelectedDate(date);
  };

  const handleTimeSlotClick = (slot: TimeSlot) => {
    onSelectSlot(slot);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={handlePreviousMonth}
            variant="outline"
            size="sm"
            className="hover:bg-slate-100 h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h3 className="text-lg font-semibold text-slate-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>

          <Button
            onClick={handleNextMonth}
            variant="outline"
            size="sm"
            className="hover:bg-slate-100 h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map(day => (
            <div
              key={day}
              className="text-center text-xs font-medium text-slate-600 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const disabled = isPast(date) || isWeekend(date);
            const selected = isSelected(date);
            const today = isToday(date);

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                disabled={disabled}
                className={`
                  aspect-square rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center h-9
                  ${disabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-900 hover:bg-slate-100 cursor-pointer'
                  }
                  ${selected ? 'bg-black text-white hover:bg-slate-800' : ''}
                  ${today && !selected ? 'border-2 border-black' : ''}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-500 mt-3 text-center">
          Weekends unavailable • Select a weekday to see available times
        </p>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-slate-600" />
            <h4 className="text-base font-semibold text-slate-900">
              Available Times - {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </h4>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              <span className="ml-3 text-slate-600">Loading available times...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && availableSlots.length === 0 && (
            <div className="bg-slate-50 rounded-lg p-8 text-center">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">No available times on this date</p>
              <p className="text-sm text-slate-500 mt-2">Please select another date</p>
            </div>
          )}

          {!loading && !error && availableSlots.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {availableSlots.map((slot, index) => {
                const isSlotSelected =
                  selectedSlot &&
                  selectedSlot.start === slot.start &&
                  selectedSlot.end === slot.end;

                return (
                  <Button
                    key={index}
                    onClick={() => handleTimeSlotClick(slot)}
                    variant={isSlotSelected ? "default" : "outline"}
                    className={`
                      ${isSlotSelected
                        ? 'bg-black text-white hover:bg-slate-800'
                        : 'hover:bg-slate-100'
                      }
                    `}
                  >
                    {slot.display}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CalendarPicker;

