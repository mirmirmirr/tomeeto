import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';
import Calendar from '../resources/Calendar';
import TimeSelector from '../resources/TimeSelector';

export default function CreateEvent() {
  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  // State for handling dropdowns and selections
  const [intervalDropdownVisible, setIntervalDropdownVisible] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState('30 minutes');
  const [selectDaysOfWeek, setSelectDaysOfWeek] = useState(false);
  const [selectedStartDay, setSelectedStartDay] = useState('Start Day');
  const [selectedEndDay, setSelectedEndDay] = useState('End Day');
  const [startDayDropdownVisible, setStartDayDropdownVisible] = useState(false);
  const [endDayDropdownVisible, setEndDayDropdownVisible] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('19:00');
  const [startCalendarDay, setCalendarStart] = useState(today);
  const [endCalendarDay, setCalendarEnd] = useState(today);

  // Styling based on the current theme
  const bgColor = isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]';
  const textColor = isDarkMode ? 'text-[#F5F5F5]' : 'text-[#3E505B]';
  const borderColor = isDarkMode ? 'border-[#F5F5F5]' : 'border-[#3E505B]';
  const placeholderColor = isDarkMode
    ? 'placeholder-[#F5F5F5]'
    : 'placeholder-[#3E505B]';

  const handleCalendarStartChange = (event) => {
    setCalendarStart(event.target.value);
  };

  const handleCalendarEndChange = (event) => {
    setCalendarEnd(event.target.value);
  };

  const handleInputChange = (event) => {
    setEventName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setEventDescription(event.target.value);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  // Functions to handle dropdown visibility for start day
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

  const get_event_data = async () => {
    const data = {
      email: 'testing@gmail.com',
      password: '123',
      title: eventName,
      description: eventDescription,
      duration: parseInt(selectedInterval),
      start_time: startTime,
      end_time: endTime,
    };

    if (selectDaysOfWeek) {
      data.event_type = 'generic_week';
      data.start_day = selectedStartDay.toLowerCase();
      data.end_day = selectedEndDay.toLowerCase();
    } else {
      data.event_type = 'date_range';
      const startDate = startCalendarDay.split('-');
      const endDate = endCalendarDay.split('-');
      data.start_date = startDate[1] + '/' + startDate[2] + '/' + startDate[0];
      data.end_date = endDate[1] + '/' + endDate[2] + '/' + endDate[0];
    }

    console.log('works');

    try {
      const response = await fetch(
        'http://tomeeto.cs.rpi.edu:8000/create_event',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        navigate('/confirmCreated');
      } else {
        console.error('Failed to create event:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Get current date for default date selection

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

      <div className="flex flex-col lg:flex-row mt-[5vh]">
        {/* Event Information */}
        <div className="pl-[25px] flex-shrink-0 lg:w-[60%]">
          {/* Input for event name */}
          <div className="flex flex-col lg:flex-row mb-5 lg:w-[80vw]">
            <input
              type="text"
              placeholder="Add Event Name"
              className={`flex-grow bg-transparent w-[80vw] lg:w-[55vw] rounded-none
                border-b-2 focus:outline-none ${textColor} 
                ${borderColor} ${placeholderColor}`}
              style={{ fontSize: `max(3vw, 35px)` }}
              value={eventName}
              onChange={handleInputChange}
            />

            {/* checkbox for selecting days of the week */}
            <label className={`flex items-center mt-4 ${textColor}`}>
              <input
                type="checkbox"
                checked={selectDaysOfWeek}
                onChange={handleSelectDaysOfWeekChange}
                className="mr-2 w-5 h-5 rounded-md focus:outline-none
                bg-transparent"
              />
              <span style={{ fontSize: `max(1.5vw, 20px)` }}>
                Select from days of the week
              </span>
            </label>
          </div>

          {/* Date and Time Selection */}
          <div className="relative flex flex-col lg:flex-row items-center gap-4 pb-4">
            {selectDaysOfWeek ? (
              <>
                {/* Dropdown for start day */}
                <div className="flex flex-col w-full lg:w-[40%] gap-2">
                  <div
                    className="flex w-full lg:gap-4"
                    style={{ fontSize: `max(1vw, 20px)` }}
                  >
                    <div
                      className="lg:w-[70%] mr-auto h-full lg:rounded-lg lg:bg-[#FF5C5C] text-[#F5F5F5]
                  focus:outline-none"
                    >
                      <button
                        onClick={toggleStartDayDropdown}
                        className="h-full w-full lg:p-3 lg:text-center text-left"
                      >
                        {selectedStartDay}
                      </button>
                    </div>
                    <TimeSelector
                      defaultTime={startTime}
                      onTimeSelect={setStartTime}
                      onChange={handleStartTimeChange}
                      className="h-full w-[30%]"
                    />
                  </div>
                  {startDayDropdownVisible && (
                    <div
                      className={`lg:absolute lg:w-[25%] self-bottom lg:mt-[62px] lg:z-10 rounded-md lg:shadow-md ${bgColor} max-h-[120px] overflow-y-auto`}
                      style={{
                        scrollbarWidth: 'none', // Hides scrollbar for Firefox
                        msOverflowStyle: 'none', // Hides scrollbar for Internet Explorer
                      }}
                    >
                      <ul className="flex flex-col">
                        {daysOfWeek.map((day) => (
                          <li
                            key={day}
                            onClick={() => {
                              setSelectedStartDay(day);
                              setStartDayDropdownVisible(false);
                            }}
                            className={`p-2 cursor-pointer rounded-md text-center ${textColor}`}
                          >
                            {day}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <span
                  className={`${textColor} lg:block hidden`}
                  style={{ fontSize: `min(3vw, 20px)` }}
                >
                  to
                </span>

                {/* Dropdown for end day */}

                <div className="flex flex-col w-full lg:w-[40%] gap-2">
                  <div
                    className="flex w-full lg:gap-4"
                    style={{ fontSize: `max(1vw, 20px)` }}
                  >
                    <div
                      className="lg:w-[70%] mr-auto h-full lg:rounded-lg lg:bg-[#FF5C5C] text-[#F5F5F5]
                  focus:outline-none"
                    >
                      <button
                        onClick={toggleEndDayDropdown}
                        className="h-full w-full lg:p-3 lg:text-center text-left"
                      >
                        {selectedEndDay}
                      </button>
                    </div>
                    <TimeSelector
                      defaultTime={endTime}
                      onTimeSelect={setEndTime}
                      onChange={handleEndTimeChange}
                      className="h-full w-[30%]"
                    />
                  </div>
                  {endDayDropdownVisible && (
                    <div
                      className={`lg:absolute lg:w-[25%] self-bottom lg:mt-[62px] lg:z-10 rounded-md lg:shadow-md ${bgColor} max-h-[120px] overflow-y-auto`}
                      style={{
                        scrollbarWidth: 'none', // Hides scrollbar for Firefox
                        msOverflowStyle: 'none', // Hides scrollbar for Internet Explorer
                      }}
                    >
                      <ul className="flex flex-col">
                        {daysOfWeek.map((day) => (
                          <li
                            key={day}
                            onClick={() => {
                              setSelectedEndDay(day);
                              setEndDayDropdownVisible(false);
                            }}
                            className={`p-2 cursor-pointer rounded-md text-center ${textColor}`}
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
                  defaultValue={endTime}
                  className="p-3 text-lg rounded-lg bg-red-500 text-white
                    text-center focus:outline-none"
                  onChange={handleEndTimeChange}
                />
              </>
            ) : (
              <>
                {/* Start Date Selector */}
                <div className="flex flex-col w-full lg:w-[40%] gap-2">
                  <div
                    className="flex w-full lg:gap-4"
                    style={{ fontSize: `max(1vw, 20px)` }}
                  >
                    <div
                      className="lg:w-[70%] mr-auto h-full lg:rounded-lg lg:bg-[#FF5C5C] text-[#F5F5F5]
                  focus:outline-none"
                    >
                      <button
                        onClick={toggleStartCalendar}
                        onChange={handleCalendarStartChange}
                        className="h-full w-full lg:p-3 lg:text-center text-left"
                      >
                        {startDate.toLocaleDateString()}
                      </button>
                    </div>
                    <TimeSelector
                      defaultTime={startTime}
                      onTimeSelect={setStartTime}
                      onChange={handleStartTimeChange}
                      className="h-full w-[30%]"
                    />
                  </div>
                  {showStartCalendar && (
                    <div className="lg:absolute self-bottom lg:mt-[62px] lg:z-10 rounded-md shadow-md">
                      <Calendar onDateSelect={handleStartDateSelect} />
                    </div>
                  )}
                </div>

                <span
                  className={`${textColor} lg:block hidden`}
                  style={{ fontSize: `max(1vw, 20px)` }}
                >
                  to
                </span>

                {/* End Date Selector */}
                <div className="flex flex-col w-full lg:w-[40%] gap-2">
                  <div
                    className="flex w-full lg:gap-4"
                    style={{ fontSize: `max(1vw, 20px)` }}
                  >
                    <div
                      className="lg:w-[70%] mr-auto h-full lg:rounded-lg lg:bg-[#FF5C5C] text-[#F5F5F5]
                  focus:outline-none"
                    >
                      <button
                        onClick={toggleEndCalendar}
                        onChange={handleCalendarEndChange}
                        className="h-full w-full lg:p-3 lg:text-center text-left"
                      >
                        {endDate.toLocaleDateString()}
                      </button>
                    </div>
                    <TimeSelector
                      defaultTime={endTime}
                      onTimeSelect={setEndTime}
                      onChange={handleEndTimeChange}
                      className="h-full w-[30%]"
                    />
                  </div>
                  {showEndCalendar && (
                    <div className="lg:absolute self-bottom lg:mt-[62px] lg:z-10 rounded-md shadow-md">
                      <Calendar onDateSelect={handleEndDateSelect} />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Time interval selection dropdown */}
          <div className="relative pb-3">
            <button
              onClick={toggleIntervalDropdown}
              className={`hidden lg:block w-[25%] p-3 lg:bg-[#FF5C5C]
                rounded-lg text-[#F5F5F5] focus:outline-none`}
              style={{ fontSize: `min(3vw, 20px)` }}
            >
              {selectedInterval || 'Time Interval'}
            </button>

            <div
              className="flex flex-row w-full"
              style={{ fontSize: `max(1vw, 20px)` }}
            >
              <button
                onClick={toggleIntervalDropdown}
                className={`text-left lg:hidden mr-auto
                  rounded-lg text-[#F5F5F5] focus:outline-none`}
              >
                Time Interval{' '}
              </button>
              <div className={`lg:hidden mr-[20px] ${textColor}`}>
                {selectedInterval || '30 minutes'}
              </div>
            </div>

            {intervalDropdownVisible && (
              <div
                className={`lg:absolute lg:z-10 mt-2 lg:w-[25%] ${bgColor}
                rounded-md lg:shadow-lg`}
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
            style={{ fontSize: `max(1vw, 20px)` }}
          >
            Event Description
          </label>
          <div className={`border-2 ${borderColor} rounded-lg p-2 mb-4`}>
            <textarea
              rows="9"
              className={`w-full p-3 rounded-lg ${bgColor} ${textColor}
                focus:outline-none resize-none`}
              style={{ fontSize: `max(1vw, 20px)` }}
              placeholder="Describe your event here..."
              value={eventDescription}
              onChange={handleDescriptionChange} // Attaching event listener
            ></textarea>
          </div>
        </div>

        {/* Right Column */}
        <div
          className={`hidden lg:block pl-8 fixed bottom-[10vw] right-4 flex-shrink-0 lg:w-[40%] flex lg:flex-col items-start`}
        >
          {/* Invite URL input */}
          <div className="w-full">
            <label
              className={`block font-semibold ${textColor}`}
              style={{ fontSize: `max(1vw, 20px)` }}
            >
              Invite Code:
            </label>
            <input
              type="text"
              className={`w-full px-0 py-2 text-lg bg-transparent text-left border-b-2 focus:outline-none
                ${textColor} ${borderColor} ${placeholderColor}`}
              style={{ fontSize: `max(1vw, 20px)` }}
            />
          </div>

          {/* Create Event button */}
          <button
            onClick={get_event_data}
            className={`w-full p-3 mt-4 bg-[#FF5C5C]
              rounded-lg text-[#F5F5F5] focus:outline-none`}
            style={{ fontSize: `min(3vw, 20px)` }}
          >
            Create Event
          </button>
        </div>

        <div
          className={`lg:hidden fixed bottom-0 left-0 flex-shrink-0 flex flex-col ${bgColor}`}
        >
          {/* Invite URL input */}
          <div className="flex flex-row w-full m-4 gap-4">
            <label className={`font-semibold ${textColor} text-[20px]`}>
              Invite Code:
            </label>
            <input
              type="text"
              className={`w-[55vw] text-lg bg-transparent text-left border-b-2 focus:outline-none rounded-none
                ${textColor} ${borderColor} ${placeholderColor} text-[20px]`}
            />
          </div>

          {/* Create Event button */}
          <button
            onClick={get_event_data}
            className={`w-[100vw] h-[10vh] bg-[#FF5C5C] flex items-center justify-center ${
              textColor
            }`}
            style={{ fontSize: `max(1vw, 20px)` }}
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}
