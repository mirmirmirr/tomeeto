import { useState } from 'react';
import { useTheme } from './ThemeContext';

export default function Calendar({ onDateSelect }) {
  const { isDarkMode } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const bgColor = isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]';
  const textColor = isDarkMode ? 'text-[#F5F5F5]' : 'text-[#3E505B]';

  // Define the maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  const handleMonthChange = (direction) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to 00:00:00 for comparison
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);

    // Allow change only if newDate is within bounds
    if (newDate <= maxDate && newDate >= today) {
      setCurrentDate(newDate);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Number of days in the current month
  const startDay = new Date(year, month, 1).getDay(); // Day of the week the month starts on

  const handleDateClick = (day) => {
    const selectedDate = new Date(year, month, day);
    onDateSelect(selectedDate);
  };

  const isCurrentMonth =
    currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear();

  const isAtMaxMonth =
    currentDate.getMonth() === maxDate.getMonth() &&
    currentDate.getFullYear() === maxDate.getFullYear();

  // Generate days for the calendar grid
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-8 w-10" />); // Empty cells for alignment
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const selectedDate = new Date(year, month, day);
    const isPastDate = selectedDate < new Date().setHours(0, 0, 0, 0); // Compare ignoring time

    calendarDays.push(
      <div
        key={day}
        onClick={!isPastDate ? () => handleDateClick(day) : null} // Disable click for past dates
        className={`h-8 w-10 flex items-center justify-center rounded-lg 
                    cursor-pointer hover:${textColor} transition-colors 
                    ${isPastDate ? 'text-gray-400 cursor-default' : ''}`} // Style for past dates
      >
        {day}
      </div>
    );
  }

  return (
    <div
      className={`${bgColor} ${textColor} p-2 rounded-md shadow-md border-0`}
    >
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-2">
        {/* Previous Month Button */}
        {!isCurrentMonth && (
          <button
            onClick={() => handleMonthChange(-1)}
            className={`text-sm font-bold ${textColor} flex items-center justify-center p-1`}
            aria-label="Previous Month"
          >
            &#8592;
          </button>
        )}

        {/* Month Name and Year */}
        <div className="flex justify-center flex-grow">
          <p className="font-bold text-sm">
            {currentDate.toLocaleString('default', { month: 'long' })} {year}
          </p>
        </div>

        {/* Next Month Button (conditionally rendered) */}
        {!isAtMaxMonth && (
          <button
            onClick={() => handleMonthChange(1)}
            className={`text-sm font-bold ${textColor} flex items-center justify-center p-1`}
            aria-label="Next Month"
          >
            &#8594;
          </button>
        )}
      </div>
      {/* Day Names */}
      <div className={`grid grid-cols-7 gap-x-2 text-center ${textColor} mb-1`}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div
            key={index}
            className="h-6 w-10 flex items-center justify-center text-xs"
          >
            {day}
          </div>
        ))}
      </div>
      {/* Dates */}
      <div className="grid grid-cols-7 gap-2 text-center">{calendarDays}</div>
    </div>
  );
}
