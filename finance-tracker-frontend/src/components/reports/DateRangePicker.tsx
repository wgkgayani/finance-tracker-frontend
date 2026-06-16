// src/components/reports/DateRangePicker.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "lucide-react";
import {
  format,
  subDays,
  subMonths,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  onPresetSelect?: (preset: string) => void;
  className?: string;
}

type PresetOption = {
  label: string;
  value: string;
  getRange: () => { start: Date; end: Date };
};

const presets: PresetOption[] = [
  {
    label: "Today",
    value: "today",
    getRange: () => ({
      start: new Date(),
      end: new Date(),
    }),
  },
  {
    label: "Yesterday",
    value: "yesterday",
    getRange: () => ({
      start: subDays(new Date(), 1),
      end: subDays(new Date(), 1),
    }),
  },
  {
    label: "Last 7 Days",
    value: "last7days",
    getRange: () => ({
      start: subDays(new Date(), 7),
      end: new Date(),
    }),
  },
  {
    label: "Last 30 Days",
    value: "last30days",
    getRange: () => ({
      start: subDays(new Date(), 30),
      end: new Date(),
    }),
  },
  {
    label: "This Month",
    value: "thisMonth",
    getRange: () => ({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last Month",
    value: "lastMonth",
    getRange: () => ({
      start: startOfMonth(subMonths(new Date(), 1)),
      end: endOfMonth(subMonths(new Date(), 1)),
    }),
  },
  {
    label: "This Year",
    value: "thisYear",
    getRange: () => ({
      start: startOfYear(new Date()),
      end: endOfYear(new Date()),
    }),
  },
  {
    label: "Last Year",
    value: "lastYear",
    getRange: () => ({
      start: startOfYear(subYears(new Date(), 1)),
      end: endOfYear(subYears(new Date(), 1)),
    }),
  },
];

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  onPresetSelect,
  className = "",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isRangeMode, setIsRangeMode] = useState(true);

  // Update temp dates when props change
  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  const handlePresetClick = (preset: PresetOption) => {
    const { start, end } = preset.getRange();
    const startStr = format(start, "yyyy-MM-dd");
    const endStr = format(end, "yyyy-MM-dd");
    setSelectedPreset(preset.value);
    setTempStartDate(startStr);
    setTempEndDate(endStr);
    onChange(startStr, endStr);
    onPresetSelect?.(preset.value);
    setIsOpen(false);
  };

  const handleApply = () => {
    onChange(tempStartDate, tempEndDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
  };

  const formatDateDisplay = (start: string, end: string) => {
    if (!start && !end) return "Select date range";
    if (start === end) return format(new Date(start), "MMM dd, yyyy");
    return `${format(new Date(start), "MMM dd, yyyy")} - ${format(new Date(end), "MMM dd, yyyy")}`;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    // Empty slots for days before month starts
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!tempStartDate || !tempEndDate) return false;
    const start = new Date(tempStartDate);
    const end = new Date(tempEndDate);
    return date >= start && date <= end;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");

    if (!isRangeMode) {
      // Single date selection
      setTempStartDate(dateStr);
      setTempEndDate(dateStr);
      return;
    }

    // Range selection
    if (
      !tempStartDate ||
      (tempStartDate && tempEndDate && tempStartDate === tempEndDate)
    ) {
      // Start of range
      setTempStartDate(dateStr);
      setTempEndDate("");
    } else if (tempStartDate && !tempEndDate) {
      // End of range
      if (new Date(dateStr) < new Date(tempStartDate)) {
        setTempStartDate(dateStr);
        setTempEndDate(tempStartDate);
      } else {
        setTempEndDate(dateStr);
      }
    } else {
      // Reset and start new range
      setTempStartDate(dateStr);
      setTempEndDate("");
    }
    setSelectedPreset("");
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + direction,
        1,
      ),
    );
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = generateCalendarDays();

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-700">
            {formatDateDisplay(startDate, endDate)}
          </span>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-[700px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="flex">
              {/* Presets Panel */}
              <div className="w-48 bg-gray-50 p-4 border-r border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Quick Select
                </h4>
                <div className="space-y-1">
                  {presets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handlePresetClick(preset)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedPreset === preset.value
                          ? "bg-primary-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <hr className="my-3" />
                <button
                  onClick={() => {
                    setSelectedPreset("");
                    setTempStartDate("");
                    setTempEndDate("");
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  Clear Selection
                </button>
              </div>

              {/* Calendar Panel */}
              <div className="flex-1 p-4">
                {/* Mode Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsRangeMode(true)}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        isRangeMode
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Range
                    </button>
                    <button
                      onClick={() => setIsRangeMode(false)}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        !isRangeMode
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Single
                    </button>
                  </div>
                  <button
                    onClick={goToToday}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Today
                  </button>
                </div>

                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <h3 className="font-semibold text-gray-900">
                    {format(currentMonth, "MMMM yyyy")}
                  </h3>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Day Names */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => (
                    <div key={index} className="aspect-square">
                      {date ? (
                        <button
                          onClick={() => handleDateClick(date)}
                          className={`w-full h-full rounded-lg text-sm transition-colors ${
                            tempStartDate && tempEndDate && isDateInRange(date)
                              ? "bg-primary-100 text-primary-700"
                              : ""
                          } ${
                            tempStartDate &&
                            format(date, "yyyy-MM-dd") === tempStartDate
                              ? "bg-primary-600 text-white hover:bg-primary-700"
                              : tempEndDate &&
                                  format(date, "yyyy-MM-dd") === tempEndDate
                                ? "bg-primary-600 text-white hover:bg-primary-700"
                                : "hover:bg-gray-100"
                          }`}
                        >
                          {format(date, "d")}
                        </button>
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Selected Range Display */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-xs text-gray-500">From</span>
                      <p className="text-sm font-medium text-gray-900">
                        {tempStartDate
                          ? format(new Date(tempStartDate), "MMM dd, yyyy")
                          : "Select date"}
                      </p>
                    </div>
                    <span className="text-gray-400">→</span>
                    <div>
                      <span className="text-xs text-gray-500">To</span>
                      <p className="text-sm font-medium text-gray-900">
                        {tempEndDate
                          ? format(new Date(tempEndDate), "MMM dd, yyyy")
                          : "Select date"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {tempStartDate && tempEndDate
                        ? `${Math.ceil((new Date(tempEndDate).getTime() - new Date(tempStartDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days`
                        : ""}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
