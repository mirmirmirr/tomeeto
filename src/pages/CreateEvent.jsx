import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';
import Calendar from '../assets/Calendar';
import TimeSelector from '../assets/TimeSelector';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  // State for handling dropdowns and selections
  const [intervalDropdownVisible, setIntervalDropdownVisible] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState('');
  const [selectDaysOfWeek, setSelectDaysOfWeek] = useState(false);
  const [selectedStartDay, setSelectedStartDay] = useState('Start Day');
  const [selectedEndDay, setSelectedEndDay] = useState('End Day');
  const [startDayDropdownVisible, setStartDayDropdownVisible] = useState(false);
  const [endDayDropdownVisible, setEndDayDropdownVisible] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('19:00');

  // Theme-based styling
  const bgColor = isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]';
  const textColor = isDarkMode ? 'text-[#F5F5F5]' : 'text-[#3E505B]';
  const borderColor = isDarkMode ? 'border-[#F5F5F5]' : 'border-[#3E505B]';
  const placeholderColor = isDarkMode
    ? 'placeholder-[#F5F5F5]'
    : 'placeholder-[#3E505B]';

  const toggleStartDayDropdown = () => {
    setStartDayDropdownVisible(!startDayDropdownVisible);
    setEndDayDropdownVisible(false);
    setShowStartCalendar(false);
    setShowEndCalendar(false);
    setIntervalDropdownVisible(false);
  };

  const toggleEndDayDropdown = () => {
    setStartDayDropdownVisible(false);
    setEndDayDropdownVisible(!endDayDropdownVisible);
    setShowStartCalendar(false);
    setShowEndCalendar(false);
    setIntervalDropdownVisible(false);
  };

  const toggleStartCalendar = () => {
    setStartDayDropdownVisible(false);
    setEndDayDropdownVisible(false);
    setShowStartCalendar(!showStartCalendar);
    setShowEndCalendar(false);
    setIntervalDropdownVisible(false);
  };

  const toggleEndCalendar = () => {
    setStartDayDropdownVisible(false);
    setEndDayDropdownVisible(false);
    setShowStartCalendar(false);
    setShowEndCalendar(!showEndCalendar);
    setIntervalDropdownVisible(false);
  };

  const toggleIntervalDropdown = () => {
    setStartDayDropdownVisible(false);
    setEndDayDropdownVisible(false);
    setShowStartCalendar(false);
    setShowEndCalendar(false);
    setIntervalDropdownVisible(!intervalDropdownVisible);
  };

  // Function to toggle the checkbox for "Select from days of the week"
  const handleSelectDaysOfWeekChange = () => {
    setSelectDaysOfWeek(!selectDaysOfWeek);
    setShowStartCalendar(false);
    setShowEndCalendar(false);
    setIntervalDropdownVisible(false);
  };

  // Handle start date selection
  const handleStartDateSelect = (date) => {
    setStartDate(date);
    setShowStartCalendar(false);
  };

  // Handles end date selection
  const handleEndDateSelect = (date) => {
    setEndDate(date);
    setShowEndCalendar(false);
  };

  // Handles time interval selection
  const handleSelectInterval = (interval) => {
    setSelectedInterval(interval);
    setIntervalDropdownVisible(false);
  };

  // Resets dropdown selections when "Select from days of the week" is unchecked
  useEffect(() => {
    if (!selectDaysOfWeek) {
      setSelectedStartDay('Start Day');
      setSelectedEndDay('End Day');
      setStartDayDropdownVisible(false);
      setEndDayDropdownVisible(false);
    }
  }, [selectDaysOfWeek]);

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return (
    <div className={`relative flex flex-col min-h-screen p-6 ${bgColor}`}>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="flex w-full mt-[4vh] p-4">
        {/* Left Column */}
        <div className="pl-4 flex-shrink-0 w-[60%]">
          {/* Input for event name */}
          <div className="flex items-center pb-5">
            <input
              type="text"
              placeholder="Add Event Name"
              className={`flex-grow px-0 py-2 text-2xl bg-transparent text-left
                border-b-2 focus:outline-none ${textColor} ${borderColor}
                ${placeholderColor}`}
              style={{ fontSize: `min(3vw, 20px)` }}
            />
          </div>

          {/* Date and Time Selection */}
          <div className="flex items-center gap-4 pb-4">
            {selectDaysOfWeek ? (
              <>
                {/* Dropdown for start day */}
                <div className="relative w-[25%]">
                  <button
                    onClick={toggleStartDayDropdown}
                    className="p-3 w-full text-lg font-semibold bg-[#FF5C5C]
                      rounded-lg text-[#F5F5F5] focus:outline-none"
                  >
                    {selectedStartDay}
                  </button>
                  {startDayDropdownVisible && (
                    <div
                      className="absolute z-10 mt-1 w-full bg-[#FF5C5C]
                        rounded-md shadow-lg"
                    >
                      <ul className="flex flex-col">
                        {daysOfWeek.map((day) => (
                          <li
                            key={day}
                            onClick={() => {
                              setSelectedStartDay(day);
                              setStartDayDropdownVisible(false);
                            }}
                            className="p-2 cursor-pointer hover:bg-red-600\
                              rounded-md text-center text-[#F5F5F5]"
                          >
                            {day}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <TimeSelector
                  defaultTime={startTime}
                  onTimeSelect={setStartTime}
                  className="p-3 text-lg rounded-lg bg-[#FF5C5C] text-white"
                />

                <span className={`${textColor} text-lg`}>to</span>

                {/* Dropdown for end day */}
                <div className="relative w-[25%]">
                  <button
                    onClick={toggleEndDayDropdown}
                    className="p-3 w-full text-lg font-semibold bg-[#FF5C5C]
                      rounded-lg text-[#F5F5F5] focus:outline-none"
                  >
                    {selectedEndDay}
                  </button>
                  {endDayDropdownVisible && (
                    <div
                      className="absolute z-10 mt-1 w-full bg-[#FF5C5C]
                      rounded-md shadow-lg"
                    >
                      <ul className="flex flex-col">
                        {daysOfWeek.map((day) => (
                          <li
                            key={day}
                            onClick={() => {
                              setSelectedEndDay(day);
                              setEndDayDropdownVisible(false);
                            }}
                            className="p-2 cursor-pointer hover:bg-red-600
                              rounded-md text-center text-[#F5F5F5]"
                          >
                            {day}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <TimeSelector
                  defaultTime={endTime}
                  onTimeSelect={setEndTime}
                  className="p-3 text-lg rounded-lg bg-[#FF5C5C] text-white"
                />
              </>
            ) : (
              <>
                {/* Start Date Selector */}
                <button
                  onClick={toggleStartCalendar}
                  className="w-[25%] p-3 rounded-lg bg-[#FF5C5C] text-lg
                    text-white text-center font-semibold focus:outline-none"
                >
                  {startDate.toLocaleDateString()}
                </button>

                <TimeSelector
                  defaultTime={startTime}
                  onTimeSelect={setStartTime}
                  className="p-3 text-lg rounded-lg bg-[#FF5C5C] text-white"
                />

                <span className={`${textColor} text-lg`}>to</span>

                {/* End Date Selector */}
                <button
                  onClick={toggleEndCalendar}
                  className="w-[25%] p-3 rounded-lg bg-[#FF5C5C] text-lg
                    text-white text-center font-semibold focus:outline-none"
                >
                  {endDate.toLocaleDateString()}
                </button>

                <TimeSelector
                  defaultTime={endTime}
                  onTimeSelect={setEndTime}
                  className="p-3 text-lg rounded-lg bg-[#FF5C5C] text-white"
                />
              </>
            )}
          </div>

          {/* Render Calendars */}
          {showStartCalendar && (
            <div className="absolute z-10 rounded-md shadow-md">
              <Calendar onDateSelect={handleStartDateSelect} />
            </div>
          )}
          {showEndCalendar && (
            <div className="absolute z-10 rounded-md shadow-md">
              <Calendar onDateSelect={handleEndDateSelect} />
            </div>
          )}

          {/* Time interval selection dropdown */}
          <div className="relative pb-3">
            <button
              onClick={toggleIntervalDropdown}
              className={`w-[25%] p-3 text-lg font-semibold bg-[#FF5C5C]
                rounded-lg text-[#F5F5F5] focus:outline-none`}
            >
              {selectedInterval || 'Time Interval'}
            </button>
            {intervalDropdownVisible && (
              <div
                className="absolute z-10 mt-1 w-[25%] bg-[#FF5C5C]
                rounded-md shadow-lg"
              >
                <ul className="flex flex-col">
                  <li
                    onClick={() => handleSelectInterval('15 minutes')}
                    className="p-2 cursor-pointer hover:bg-red-600 rounded-md
                    text-center text-[#F5F5F5]"
                  >
                    15 minutes
                  </li>
                  <li
                    onClick={() => handleSelectInterval('30 minutes')}
                    className="p-2 cursor-pointer hover:bg-red-600 rounded-md
                    text-center text-[#F5F5F5]"
                  >
                    30 minutes
                  </li>
                  <li
                    onClick={() => handleSelectInterval('60 minutes')}
                    className="p-2 cursor-pointer hover:bg-red-600 rounded-md
                    text-center text-[#F5F5F5]"
                  >
                    60 minutes
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Event description input */}
          <label className={`block text-lg font-semibold ${textColor} mb-2`}>
            Event Description
          </label>
          <div className={`border-2 ${borderColor} rounded-lg p-2 mb-4`}>
            <textarea
              rows="9"
              className={`w-full p-3 text-lg rounded-lg ${bgColor} ${textColor}
                focus:outline-none resize-none`}
              placeholder="Describe your event here..."
            ></textarea>
          </div>
        </div>

        {/* Right Column */}
        <div className="pl-8 flex-shrink-0 w-[40%] flex flex-col items-start">
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
          <div className="w-full mt-[50vh]">
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
            onClick={() => navigate('/confirmCreated')}
            className={`w-full p-3 mt-4 text-lg font-semibold bg-[#FF5C5C]
              rounded-lg text-[#F5F5F5] focus:outline-none`}
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}
