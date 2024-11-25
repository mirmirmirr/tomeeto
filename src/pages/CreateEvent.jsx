import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';
import Calendar from '../resources/Calendar';
import TimeSelector from '../resources/TimeSelector';

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
    <div className={`relative flex flex-col min-h-screen p-4 ${bgColor}`}>
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
                font-semibold border-b-2 focus:outline-none ${textColor} 
                ${borderColor} ${placeholderColor}`}
              style={{ fontSize: `min(3vw, 35px)` }}
            />
          </div>

          {/* Date and Time Selection */}
          <div className="relative flex items-center gap-4 pb-4">
            {selectDaysOfWeek ? (
              <>
                {/* Dropdown for start day */}
                <div className="relative w-[25%]">
                  <button
                    onClick={toggleStartDayDropdown}
                    className="p-3 w-full font-semibold bg-[#FF5C5C]
                      rounded-lg text-[#F5F5F5] focus:outline-none"
                    style={{ fontSize: `min(3vw, 15px)` }}
                  >
                    {selectedStartDay}
                  </button>
                  {startDayDropdownVisible && (
                    <div
                      className={`absolute z-10 mt-2 w-full ${bgColor} ${textColor}
                      rounded-md shadow-lg`}
                    >
                      <ul className="flex flex-col">
                        {daysOfWeek.map((day) => (
                          <li
                            key={day}
                            onClick={() => {
                              setSelectedStartDay(day);
                              setStartDayDropdownVisible(false);
                            }}
                            className={`p-2 cursor-pointer rounded-md text-center
                            ${textColor}`}
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
                  className="p-3 rounded-lg bg-[#FF5C5C] text-white"
                />

                <span
                  className={`${textColor}`}
                  style={{ fontSize: `min(3vw, 15px)` }}
                >
                  to
                </span>

                {/* Dropdown for end day */}
                <div className="relative w-[25%]">
                  <button
                    onClick={toggleEndDayDropdown}
                    className="p-3 w-full font-semibold bg-[#FF5C5C]
                      rounded-lg text-[#F5F5F5] focus:outline-none"
                    style={{ fontSize: `min(3vw, 15px)` }}
                  >
                    {selectedEndDay}
                  </button>
                  {endDayDropdownVisible && (
                    <div
                      className={`absolute z-10 mt-2 w-full ${bgColor} ${textColor}
                      rounded-md shadow-lg`}
                    >
                      <ul className="flex flex-col">
                        {daysOfWeek.map((day) => (
                          <li
                            key={day}
                            onClick={() => {
                              setSelectedEndDay(day);
                              setEndDayDropdownVisible(false);
                            }}
                            className={`p-2 cursor-pointer rounded-md text-center
                              ${textColor}`}
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
                  className="p-3 rounded-lg bg-[#FF5C5C] text-white"
                />
              </>
            ) : (
              <>
                {/* Start Date Selector */}
                <div
                  className="w-[25%] rounded-lg bg-[#FF5C5C] text-white text-center
                  font-semibold focus:outline-none"
                  style={{ fontSize: `min(3vw, 15px)` }}
                >
                  <button
                    onClick={toggleStartCalendar}
                    className="h-full w-full p-3"
                  >
                    {startDate.toLocaleDateString()}
                  </button>
                  {showStartCalendar && (
                    <div className="absolute self-bottom pt-2 z-10 rounded-md shadow-md">
                      <Calendar onDateSelect={handleStartDateSelect} />
                    </div>
                  )}
                </div>

                <TimeSelector
                  defaultTime={startTime}
                  onTimeSelect={setStartTime}
                />

                <span
                  className={`${textColor}`}
                  style={{ fontSize: `min(3vw, 15px)` }}
                >
                  to
                </span>

                {/* End Date Selector */}
                <div
                  className="w-[25%] rounded-lg bg-[#FF5C5C]
                      text-white text-center font-semibold focus:outline-none"
                  style={{ fontSize: `min(3vw, 15px)` }}
                >
                  <button
                    onClick={toggleEndCalendar}
                    className="h-full w-full p-3"
                  >
                    {endDate.toLocaleDateString()}
                  </button>
                  {showEndCalendar && (
                    <div className="absolute self-bottom pt-2 z-10 rounded-md shadow-md">
                      <Calendar onDateSelect={handleEndDateSelect} />
                    </div>
                  )}
                </div>

                <TimeSelector defaultTime={endTime} onTimeSelect={setEndTime} />
              </>
            )}
          </div>

          {/* Time interval selection dropdown */}
          <div className="relative pb-4">
            <button
              onClick={toggleIntervalDropdown}
              className={`w-[25%] p-3 font-semibold bg-[#FF5C5C]
                rounded-lg text-[#F5F5F5] focus:outline-none`}
              style={{ fontSize: `min(3vw, 15px)` }}
            >
              {selectedInterval || 'Time Interval'}
            </button>
            {intervalDropdownVisible && (
              <div
                className={`absolute z-10 mt-2 w-[25%] ${bgColor} rounded-md
                shadow-lg`}
              >
                <ul className="flex flex-col">
                  <li
                    onClick={() => handleSelectInterval('15 minutes')}
                    className={`p-2 cursor-pointer rounded-md text-center ${textColor}`}
                  >
                    15 minutes
                  </li>
                  <li
                    onClick={() => handleSelectInterval('30 minutes')}
                    className={`p-2 cursor-pointer rounded-md text-center ${textColor}`}
                  >
                    30 minutes
                  </li>
                  <li
                    onClick={() => handleSelectInterval('60 minutes')}
                    className={`p-2 cursor-pointer rounded-md text-center ${textColor}`}
                  >
                    60 minutes
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Event description input */}
          <label
            className={`block font-semibold ${textColor} mb-2`}
            style={{ fontSize: `min(3vw, 20px)` }}
          >
            Event Description
          </label>
          <div className={`border-2 ${borderColor} rounded-lg p-2 mb-4`}>
            <textarea
              rows="8"
              className={`w-full p-3 rounded-lg ${bgColor} ${textColor}
                focus:outline-none resize-none`}
              style={{ fontSize: `min(3vw, 15px)` }}
              placeholder="Describe your event here..."
            ></textarea>
          </div>
        </div>

        {/* Right Column */}
        <div className="pl-8 pr-2 flex-shrink-0 w-[40%] flex flex-col items-start">
          {/* Checkbox for selecting days of the week */}
          <label className={`flex items-center mt-4 ${textColor}`}>
            <input
              type="checkbox"
              checked={selectDaysOfWeek}
              onChange={handleSelectDaysOfWeekChange}
              className="mr-2 w-5 h-5 rounded-md focus:outline-none
                bg-transparent"
            />
            <span style={{ fontSize: `min(3vw, 15px)` }}>
              Select from days of the week
            </span>
          </label>

          {/* Invite URL input */}
          <div className="w-full mt-[49vh]">
            <label
              className={`block font-semibold ${textColor}`}
              style={{ fontSize: `min(3vw, 20px)` }}
            >
              Invite URL
            </label>
            <input
              type="text"
              className={`w-full px-0 py-2 text-lg bg-transparent text-left border-b-2 focus:outline-none
                ${textColor} ${borderColor} ${placeholderColor}`}
              style={{ fontSize: `min(3vw, 15px)` }}
            />
          </div>

          {/* Create Event button */}
          <button
            onClick={() => navigate('/confirmCreated')}
            className={`w-full p-3 mt-4 font-semibold bg-[#FF5C5C]
              rounded-lg text-[#F5F5F5] focus:outline-none`}
            style={{ fontSize: `min(3vw, 15px)` }}
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}
