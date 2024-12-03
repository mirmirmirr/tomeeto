import { useState } from 'react';
import { useTheme } from './ThemeContext';

export default function TimeSelector({
  dropdownId,
  isOpen,
  onToggle,
  onTimeSelect,
}) {
  const { isDarkMode } = useTheme();
  const [timeDropdownVisible, setTimeDropdownVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState('7:00 AM');

  const bgColor = isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]';
  const textColor = isDarkMode ? 'text-[#F5F5F5]' : 'text-[#3E505B]';

  const times = [
    '12:00 AM',
    '1:00 AM',
    '2:00 AM',
    '3:00 AM',
    '4:00 AM',
    '5:00 AM',
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM',
    '11:00 PM',
  ];

  const toggleDropdown = () => {
    setTimeDropdownVisible(!timeDropdownVisible);
  };

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    onTimeSelect(time);
    onToggle(null);
  };

  return (
    <div className="relative flex flex-col">
      {/* Time Display Button */}
      <button
        onClick={() => onToggle(dropdownId)}
        className={`lg:p-3 w-[120px] lg:rounded-md lg:bg-[#FF5C5C] text-[#F5F5F5] text-lg ml-auto
         focus:outline-none`}
        style={{ fontSize: `max(1vw, 20px)` }}
      >
        {selectedTime}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`-ml-[30vw] text-center lg:absolute lg:mt-[60px] w-[85vw] lg:ml-[0px] lg:w-full max-h-[120px] rounded-md 
            ${bgColor} lg:shadow-lg overflow-y-auto ${textColor}`}
          style={{
            scrollbarWidth: 'none', // Hides scrollbar for Firefox
            msOverflowStyle: 'none', // Hides scrollbar for Internet Explorer
          }}
        >
          <style>
            {`
              .dropdown::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          {times.map((time) => (
            <div
              key={time}
              onClick={() => handleSelectTime(time)}
              className="p-1 cursor-pointer text-center"
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
