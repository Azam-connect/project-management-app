import React, { useState, useEffect, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';
import { CalendarDays } from 'lucide-react';

const DateRangeInputs = ({ onDateRangeChange, initialRange }) => {
  const [range, setRange] = useState(() => ({
    from: initialRange?.from || new Date(),
    to: initialRange?.to || new Date(),
  }));
  const [openInput, setOpenInput] = useState(null); // 'from', 'to', or null

  // Sync when initialRange changes
  useEffect(() => {
    setRange((prev) => {
      const newFrom = initialRange?.from || new Date();
      const newTo = initialRange?.to || new Date();
      if (
        newFrom?.getTime() !== prev.from?.getTime() ||
        newTo?.getTime() !== prev.to?.getTime()
      ) {
        return { from: newFrom, to: newTo };
      }
      return prev;
    });
  }, [initialRange?.from, initialRange?.to]);

  const currentRange = useMemo(
    () => ({ from: range.from, to: range.to }),
    [range.from, range.to]
  );

  useEffect(() => {
    if (onDateRangeChange) {
      onDateRangeChange(currentRange);
    }
  }, [currentRange, onDateRangeChange]);

  // const handleDaySelect = (date) => {
  //   if (!date) return;

  //   if (openInput === "from") {
  //     setRange((prev) => ({
  //       from: date,
  //       to: prev.to && date > prev.to ? date : prev.to,
  //     }));
  //     setOpenInput("to"); // Automatically open "to" calendar
  //   } else if (openInput === "to") {
  //     setRange((prev) => ({
  //       from: prev.from,
  //       to: date,
  //     }));
  //     setOpenInput(null); // Close calendar
  //   }
  // };

  const handleDaySelect = (date) => {
    if (!date) date = openInput === 'from' ? range.from : range.to;

    if (openInput === 'from') {
      setRange((prev) => ({
        from: date,
        to: prev.to && date > prev.to ? date : prev.to,
      }));
      // Automatically switch to "to" unless it's the same date and already selected
      if (!range.to || date.getTime() !== range.to.getTime()) {
        setOpenInput('to');
      } else {
        setOpenInput(null); // Close calendar if same
      }
    } else if (openInput === 'to') {
      setRange((prev) => ({
        from: prev.from,
        to: date,
      }));
      setOpenInput(null); // Always close calendar after selecting "to"
    }
  };

  const formatDate = (date) =>
    date ? dayjs(date).format('DD MMM YYYY') : 'Select date';

  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="flex items-end gap-4">
        {/* From Date Input */}
        <div className="relative flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <button
            type="button"
            onClick={() => setOpenInput('from')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left text-sm bg-white shadow-sm flex items-center justify-between hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <span>{formatDate(range.from)}</span>
            <CalendarDays className="w-5 h-5 text-gray-500" />
          </button>

          {openInput === 'from' && (
            <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4">
              <DayPicker
                mode="single"
                selected={range.from}
                onSelect={handleDaySelect}
                disabled={range.to ? (date) => date > range.to : undefined}
              />
            </div>
          )}
        </div>

        {/* To Date Input */}
        <div className="relative flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <button
            type="button"
            onClick={() => setOpenInput('to')}
            className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-left text-sm bg-white shadow-sm flex items-center justify-between ${
              !range.from
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }`}
            disabled={!range.from}
          >
            <span>{formatDate(range.to)}</span>
            <CalendarDays className="w-5 h-5 text-gray-500" />
          </button>

          {openInput === 'to' && range.from && (
            <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4">
              <DayPicker
                mode="single"
                selected={range.to}
                onSelect={handleDaySelect}
                disabled={(date) => date < range.from}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateRangeInputs;
