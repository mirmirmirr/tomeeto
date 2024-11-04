import { useState, useEffect } from 'react';
import darkLogo from '../src/assets/tomeeto-dark.png';
import lightLogo from '../src/assets/tomeeto-light.png';

export default function CreateEvent() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [intervalDropdownVisible, setIntervalDropdownVisible] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState('');
  const [selectDaysOfWeek, setSelectDaysOfWeek] = useState(false);
  const [selectedStartDay, setSelectedStartDay] = useState('Start Day');
  const [selectedEndDay, setSelectedEndDay] = useState('End Day');
  const [startDayDropdownVisible, setStartDayDropdownVisible] = useState(false);
  const [endDayDropdownVisible, setEndDayDropdownVisible] = useState(false);

  // Styling based on the current theme
  const bgColor = isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]';
  const textColor = isDarkMode ? 'text-[#F5F5F5]' : 'text-[#3E505B]';
  const borderColor = isDarkMode ? 'border-[#F5F5F5]' : 'border-[#3E505B]';
  const placeholderColor = isDarkMode
    ? 'placeholder-[#F5F5F5]'
    : 'placeholder-[#3E505B]';

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Functions to handle dropdown visibility for start day
  const toggleStartDayDropdown = () => {
    setStartDayDropdownVisible(!startDayDropdownVisible);
    setEndDayDropdownVisible(false);
    setIntervalDropdownVisible(false);
  };

  // Functions to handle dropdown visibility for end day
  const toggleEndDayDropdown = () => {
    setEndDayDropdownVisible(!endDayDropdownVisible);
    setStartDayDropdownVisible(false);
    setIntervalDropdownVisible(false);
  };

  // Functions to handle dropdown visibility for time interval
  const toggleIntervalDropdown = () => {
    setIntervalDropdownVisible(!intervalDropdownVisible);
    setStartDayDropdownVisible(false);
    setEndDayDropdownVisible(false);
  };

  // Function to handle selection of start days
  const handleStartDaySelect = (day) => {
    setSelectedStartDay(day);
    setStartDayDropdownVisible(false);
  };

  // Function to handle selection of end days
  const handleEndDaySelect = (day) => {
    setSelectedEndDay(day);
    setEndDayDropdownVisible(false);
  };

  // Function to handle selection of time intervals and end days
  const handleSelectInterval = (interval) => {
    setSelectedInterval(interval);
    setIntervalDropdownVisible(false);
  };

  // Function to toggle the checkbox for selecting days of the week
  const handleSelectDaysOfWeekChange = () => {
    setSelectDaysOfWeek(!selectDaysOfWeek);
  };

  // Effect to reset selections when the days of the week checkbox is unchecked
  useEffect(() => {
    if (!selectDaysOfWeek) {
      setSelectedStartDay('Start Day');
      setSelectedEndDay('End Day');
      setStartDayDropdownVisible(false);
      setEndDayDropdownVisible(false);
    }
  }, [selectDaysOfWeek]);

  // Get current date for default date selection
  const today = new Date().toISOString().split('T')[0];

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <div
      className={`relative flex flex-col items-start justify-center min-h-screen
        p-4 ${bgColor}`}
    >
      {/* Logo */}
      <img
        src={isDarkMode ? darkLogo : lightLogo}
        alt="Logo"
        className="absolute top-4 left-4 w-24 h-auto object-contain"
      />
      {/* Theme */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 bg-gray-300 rounded-full shadow-md
          hover:bg-gray-400 transition duration-300"
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="flex w-full">
        {/* Left Column */}
        <div className="mt-10 ml-4 w-[60%]">
          {/* Input for event name */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Add event name"
              className={`flex-grow px-0 py-2 text-2xl bg-transparent text-left
                border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${textColor} ${borderColor} ${placeholderColor}`}
            />
          </div>

          {/* Date and time selection */}
          <div className="flex items-center gap-4 mb-4 mt-4">
            {selectDaysOfWeek ? (
              <>
                {/* Start Day Dropdown */}
                <div className="relative w-[25%]">
                  <button
                    onClick={toggleStartDayDropdown}
                    className="p-3 w-full text-lg font-semibold bg-red-500
                      rounded-lg text-[#F5F5F5] focus:outline-none"
                  >
                    {selectedStartDay}
                  </button>
                  {startDayDropdownVisible && (
                    <div
                      className="absolute z-10 mt-1 w-full bg-red-500
                      rounded-md shadow-lg"
                    >
                      <ul className="flex flex-col">
                        {daysOfWeek.map((day) => (
                          <li
                            key={day}
                            onClick={() => handleStartDaySelect(day)}
                            className="p-2 cursor-pointer hover:bg-red-600
                              text-center text-[#F5F5F5]"
                          >
                            {day}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <input
                  type="time"
                  defaultValue="07:00"
                  className="p-3 text-lg rounded-lg bg-red-500 text-white
                    text-center focus:outline-none"
                />
                <span className={`${textColor} text-lg`}>to</span>

                {/* End Day Dropdown */}
                <div className="relative w-[25%]">
                  <button
                    onClick={toggleEndDayDropdown}
                    className="p-3 w-full text-lg font-semibold bg-red-500
                      rounded-lg text-[#F5F5F5] focus:outline-none"
                  >
                    {selectedEndDay}
                  </button>
                  {endDayDropdownVisible && (
                    <div
                      className="absolute z-10 mt-1 w-full bg-red-500
                      rounded-md shadow-lg"
                    >
                      <ul className="flex flex-col">
                        {daysOfWeek.map((day) => (
                          <li
                            key={day}
                            onClick={() => handleEndDaySelect(day)}
                            className="p-2 cursor-pointer hover:bg-red-600
                              text-center text-[#F5F5F5]"
                          >
                            {day}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <input
                  type="time"
                  defaultValue="19:00"
                  className="p-3 text-lg rounded-lg bg-red-500 text-white
                    text-center focus:outline-none"
                />
              </>
            ) : (
              <>
                {/* Date input for single day selection */}
                <input
                  type="date"
                  defaultValue={today}
                  className="w-[25%] p-3 text-lg rounded-lg bg-red-500
                    text-white text-center focus:outline-none"
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
                  className="w-[25%] p-3 text-lg rounded-lg bg-red-500
                    text-white text-center focus:outline-none"
                />
                <input
                  type="time"
                  defaultValue="19:00"
                  className="p-3 text-lg rounded-lg bg-red-500 text-white
                    text-center focus:outline-none"
                />
              </>
            )}
          </div>

          {/* Time interval selection dropdown */}
          <div className="relative mb-4">
            <button
              onClick={toggleIntervalDropdown}
              className={`w-[25%] p-3 text-lg font-semibold bg-red-500
                rounded-lg text-[#F5F5F5] focus:outline-none`}
            >
              {selectedInterval || 'Time Interval'}
            </button>
            {intervalDropdownVisible && (
              <div
                className="absolute z-10 mt-1 w-[25%] bg-red-500
                rounded-md shadow-lg"
              >
                <ul className="flex flex-col">
                  <li
                    onClick={() => handleSelectInterval('15 minutes')}
                    className="p-2 cursor-pointer hover:bg-red-600 text-center
                      text-[#F5F5F5]"
                  >
                    15 minutes
                  </li>
                  <li
                    onClick={() => handleSelectInterval('30 minutes')}
                    className="p-2 cursor-pointer hover:bg-red-600 text-center
                      text-[#F5F5F5]"
                  >
                    30 minutes
                  </li>
                  <li
                    onClick={() => handleSelectInterval('60 minutes')}
                    className="p-2 cursor-pointer hover:bg-red-600 text-center
                      text-[#F5F5F5]"
                  >
                    60 minutes
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Event description input */}
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

        {/* Right Column */}
        <div className="mt-10 ml-8 mr-4 w-[40%] flex flex-col items-start">
          {/* Checkbox for selecting days of the week */}
          <label className={`flex items-center mb-4 ${textColor}`}>
            <input
              type="checkbox"
              checked={selectDaysOfWeek}
              onChange={handleSelectDaysOfWeekChange}
              className="mr-2 w-5 h-5 rounded-md focus:outline-none
                bg-transparent"
            />
            <span>Select from days of the week</span>
          </label>

          {/* Invite URL input */}
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

          {/* Create Event button */}
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
