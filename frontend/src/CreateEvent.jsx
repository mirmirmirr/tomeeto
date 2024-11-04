import { useState } from 'react';
import darkLogo from '../src/assets/tomeeto-dark.png';
import lightLogo from '../src/assets/tomeeto-light.png';

export default function CreateEvent() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const bgColor = isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]';
  const textColor = isDarkMode ? 'text-[#F5F5F5]' : 'text-[#3E505B]';
  const borderColor = isDarkMode ? 'border-[#F5F5F5]' : 'border-[#3E505B]';
  const placeholderColor = isDarkMode
    ? 'placeholder-[#F5F5F5]'
    : 'placeholder-[#3E505B]';

  const today = new Date().toISOString().split('T')[0];

  return (
    <div
      className={`relative flex flex-col items-start justify-center 
                min-h-screen p-4 ${bgColor}`}
    >
      <img
        src={isDarkMode ? darkLogo : lightLogo}
        alt="Logo"
        className="absolute top-4 left-4 w-24 h-auto object-contain"
      />
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 bg-gray-300 rounded-full shadow-md
            hover:bg-gray-400 transition duration-300"
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="flex w-full">
        {/* Left column */}
        <div className="mt-10 ml-4 w-[60%]">
          {/* Add Event Name */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Add event name"
              className={`flex-grow px-0 py-2 text-2xl bg-transparent text-left
                border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
                ${textColor} ${borderColor} ${placeholderColor}`}
            />
          </div>

          {/* Date and Time Range */}
          <div className="flex items-center gap-4 mb-4 mt-4">
            <input
              type="date"
              defaultValue={today}
              className="p-3 text-lg rounded-lg bg-red-500 text-white
                text-center focus:outline-none"
            />
            <input
              type="time"
              defaultValue="07:00"
              className="p-3 text-lg rounded-lg bg-red-500 text-white
                text-center focus:outline-none"
            />
            <span className={`${textColor} text-lg`}>to</span>
            <input
              type="date"
              defaultValue={today}
              className="p-3 text-lg rounded-lg bg-red-500 text-white 
                text-center focus:outline-none"
            />
            <input
              type="time"
              defaultValue="19:00"
              className="p-3 text-lg rounded-lg bg-red-500 text-white
                text-center focus:outline-none"
            />
          </div>

          {/* Time Interval Button */}
          <button
            className={`w-[25%] p-3 mb-4 text-lg font-semibold bg-red-500
                rounded-lg text-[#F5F5F5] focus:outline-none`}
          >
            Time Interval
          </button>

          {/* Event Description Box */}
          <label className={`block text-lg font-semibold ${textColor} mb-2`}>
            Event description
          </label>
          <div className={`border-2 ${borderColor} rounded-lg p-2 mb-4`}>
            <textarea
              rows="11"
              className={`w-full p-3 text-lg rounded-lg ${bgColor} ${textColor}
                focus:outline-none resize-none`}
              placeholder="Describe your event here..."
            ></textarea>
          </div>
        </div>

        {/* Right column */}
        <div className="mt-10 ml-8 mr-4 w-[40%] flex flex-col items-start">
          {/* Select from Days of the Week Checkbox */}
          <label className={`flex items-center mb-4 ${textColor}`}>
            <input
              type="checkbox"
              className="mr-2 w-5 h-5 rounded-md focus:outline-none 
                bg-transparent"
            />
            <span>Select from days of the week</span>
          </label>

          {/* Invite URL Input */}
          <div className="w-full mt-[76.5%]">
            <label className={`block text-lg font-semibold ${textColor}`}>
              Invite URL
            </label>
            <input
              type="text"
              className={`w-full px-0 py-2 text-lg bg-transparent text-left 
                border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
                ${textColor} ${borderColor} ${placeholderColor}`}
            />
          </div>

          {/* Create Event Button */}
          <button
            className={`w-full p-3 mt-4 text-lg font-semibold bg-red-500 
                rounded-lg text-[#F5F5F5] focus:outline-none`}
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}
