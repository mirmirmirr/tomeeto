import { useState } from 'react';
import { useTheme } from '../resources/ThemeContext';

export default function TimeSelector() {
  const { isDarkMode } = useTheme();
  const [timeDropdownVisible, setTimeDropdownVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState('7:00 AM');

  const bgColor = isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]';
  const textColor = isDarkMode ? 'text-[#F5F5F5]' : 'text-[#3E505B]';

  const times = [
    '7:00 AM',
    '7:10 AM',
    '7:20 AM',
    '7:30 AM',
    '7:40 AM',
    '7:50 AM',
    '8:00 AM',
    '8:10 AM',
    '8:20 AM',
    '8:30 AM',
    '8:40 AM',
    '8:50 AM',
    '9:00 AM',
    '9:10 AM',
    '9:20 AM',
    '9:30 AM',
    '9:40 AM',
    '9:50 AM',
    '10:00 AM',
    '10:10 AM',
    '10:20 AM',
    '10:30 AM',
    '10:40 AM',
    '10:50 AM',
    '11:00 AM',
    '11:10 AM',
    '11:20 AM',
    '11:30 AM',
    '11:40 AM',
    '11:50 AM',
    '12:00 PM',
    '12:10 PM',
    '12:20 PM',
    '12:30 PM',
    '12:40 PM',
    '12:50 PM',
    '1:00 PM',
    '1:10 PM',
    '1:20 PM',
    '1:30 PM',
    '1:40 PM',
    '1:50 PM',
    '2:00 PM',
    '2:10 PM',
    '2:20 PM',
    '2:30 PM',
    '2:40 PM',
    '2:50 PM',
    '3:00 PM',
    '3:10 PM',
    '3:20 PM',
    '3:30 PM',
    '3:40 PM',
    '3:50 PM',
    '4:00 PM',
    '4:10 PM',
    '4:20 PM',
    '4:30 PM',
    '4:40 PM',
    '4:50 PM',
    '5:00 PM',
    '5:10 PM',
    '5:20 PM',
    '5:30 PM',
    '5:40 PM',
    '5:50 PM',
    '6:00 PM',
    '6:10 PM',
    '6:20 PM',
    '6:30 PM',
    '6:40 PM',
    '6:50 PM',
    '7:00 PM',
    '7:10 PM',
    '7:20 PM',
    '7:30 PM',
    '7:40 PM',
    '7:50 PM',
    '8:00 PM',
    '8:10 PM',
    '8:20 PM',
    '8:30 PM',
    '8:40 PM',
    '8:50 PM',
    '9:00 PM',
    '9:10 PM',
    '9:20 PM',
    '9:30 PM',
    '9:40 PM',
    '9:50 PM',
    '10:00 PM',
    '10:10 PM',
    '10:20 PM',
    '10:30 PM',
    '10:40 PM',
    '10:50 PM',
    '11:00 PM',
    '11:10 PM',
    '11:20 PM',
    '11:30 PM',
    '11:40 PM',
    '11:50 PM',
    '12:00 AM',
    '12:10 AM',
    '12:20 AM',
    '12:30 AM',
    '12:40 AM',
    '12:50 AM',
    '1:00 AM',
    '1:10 AM',
    '1:20 AM',
    '1:30 AM',
    '1:40 AM',
    '1:50 AM',
    '2:00 AM',
    '2:10 AM',
    '2:20 AM',
    '2:30 AM',
    '2:40 AM',
    '2:50 AM',
    '3:00 AM',
    '3:10 AM',
    '3:20 AM',
    '3:30 AM',
    '3:40 AM',
    '3:50 AM',
    '4:00 AM',
    '4:10 AM',
    '4:20 AM',
    '4:30 AM',
    '4:40 AM',
    '4:50 AM',
    '5:00 AM',
    '5:10 AM',
    '5:20 AM',
    '5:30 AM',
    '5:40 AM',
    '5:50 AM',
    '6:00 AM',
    '6:10 AM',
    '6:20 AM',
    '6:30 AM',
    '6:40 AM',
    '6:50 AM',
  ];

  const toggleDropdown = () => {
    setTimeDropdownVisible(!timeDropdownVisible);
  };

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    setTimeDropdownVisible(false);
  };

  return (
    <div className="relative w-[120px]">
      {/* Time Display Button */}
      <button
        onClick={toggleDropdown}
        className="p-2 w-full rounded-md bg-[#FF5C5C] text-white text-lg
          font-semibold focus:outline-none"
      >
        {selectedTime}
      </button>

      {/* Dropdown Menu */}
      {timeDropdownVisible && (
        <div
          className={`absolute z-10 mt-2 w-full max-h-[150px] rounded-md 
            bg-[#FF5C5C] text-white shadow-lg overflow-y-auto`}
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
              className="p-2 cursor-pointer text-center"
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
