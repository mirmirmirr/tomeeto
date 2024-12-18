import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';
import Calendar from '../resources/Calendar';
import TimeSelector from '../resources/TimeSelector';
import { formToJSON } from 'axios';

export default function CreateEvent() {
  const tempToday = new Date();
  const today =
    tempToday.getMonth() +
    1 +
    '/' +
    tempToday.getDate() +
    '/' +
    tempToday.getFullYear();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  // State for handling dropdowns and selections
  const [openDropdown, setOpenDropdown] = useState(null); // Tracks the open dropdown ('startTime', 'endTime', 'startDay', 'endDay', 'startCal', 'endCal')
  const [intervalDropdownVisible, setIntervalDropdownVisible] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState('60 minutes');
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
  const [endTime, setEndTime] = useState('07:00');
  const [startCalendarDay, setCalendarStart] = useState(today);
  const [endCalendarDay, setCalendarEnd] = useState(today);

  // Styling based on the current theme
  const bgColor = isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]';
  const textColor = isDarkMode ? 'text-[#F5F5F5]' : 'text-[#3E505B]';
  const borderColor = isDarkMode ? 'border-[#F5F5F5]' : 'border-[#3E505B]';
  const placeholderColor = isDarkMode
    ? 'placeholder-[#F5F5F5]'
    : 'placeholder-[#3E505B]';

  const [error, setError] = useState({
    error: false,
    message: '',
  });

  const handleError = (errormessage) => {
    setError({
      error: true,
      message: errormessage,
    });
    setTimeout(() => {
      setError({
        error: false,
        message: '',
      });
    }, 2000);
  };

  const handleToggle = (dropdownId) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

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

  const formatTime = (time) => {
    const [hour, minute, modifier] = time
      .match(/(\d+):(\d+)\s*(AM|PM)/i)
      .slice(1);

    let formattedHour = parseInt(hour, 10);

    if (modifier === 'PM' && formattedHour !== 12) {
      formattedHour += 12;
    } else if (modifier === 'AM' && formattedHour === 12) {
      formattedHour = 0;
    }

    const formattedTime = `${String(formattedHour).padStart(2, '0')}:${minute}`;
    return formattedTime;
  };

  const handleStartTimeChange = (time) => {
    setStartTime(formatTime(time));
  };

  const handleEndTimeChange = (time) => {
    setEndTime(formatTime(time));
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
    const formattedDate =
      date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
    setCalendarStart(formattedDate);
  };

  // Handles end date selection
  const handleEndDateSelect = (date) => {
    setEndDate(date);
    setShowEndCalendar(false);
    const formattedDate =
      date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
    setCalendarEnd(formattedDate);
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
      title: eventName,
      description: eventDescription,
      duration: parseInt(selectedInterval),
      start_time: startTime,
      end_time: endTime,
    };

    const cookies = document.cookie; // Get all cookies as a single string
    const cookieObj = {};

    cookies.split(';').forEach((cookie) => {
      const [key, value] = cookie.split('=').map((part) => part.trim());
      if (key && value) {
        try {
          // Parse JSON if it's valid JSON, otherwise use as-is
          const parsedValue = JSON.parse(decodeURIComponent(value));
          cookieObj[key] = String(parsedValue);
        } catch {
          cookieObj[key] = String(decodeURIComponent(value)); // Handle plain strings
        }
      }
    });

    if (cookieObj['login_email'] && cookieObj['login_password']) {
      data['email'] = cookieObj['login_email'];
      data['password'] = cookieObj['login_password'];
    } else {
      if (cookieObj['guest_email'] && cookieObj['guest_password']) {
        data['guest_id'] = parseInt(cookieObj['guest_email']);
        data['guest_password'] = cookieObj['guest_password'];
      } else {
        try {
          const response = await fetch(
            import.meta.env.VITE_API_HOST + '/create_guest'
          );
          if (response.ok) {
            const responseData = await response.json();
            data['guest_id'] = parseInt(responseData.guest_id);
            data['guest_password'] = responseData.guest_password;
            const guestEmailCookie = `guest_email=${encodeURIComponent(JSON.stringify(responseData.guest_id))}; path=/;`;
            const guestPasswordCookie = `guest_password=${encodeURIComponent(JSON.stringify(responseData.guest_password))}; path=/;`;
            document.cookie = guestEmailCookie;
            document.cookie = guestPasswordCookie;
          } else {
            console.error(
              'Failed to make guest:',
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }

    if (selectDaysOfWeek) {
      data.event_type = 'generic_week';
      data.start_day = selectedStartDay.toLowerCase();
      data.end_day = selectedEndDay.toLowerCase();
    } else {
      data.event_type = 'date_range';
      data.start_date = startCalendarDay;
      data.end_date = endCalendarDay;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_API_HOST + '/create_event',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.message != 'Event created') {
          handleError(responseData.message);
          return;
        }

        navigate('/confirmCreated', {
          state: {
            eventCode: responseData.event_code,
            eventName: data.title,
          },
        });
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
        <div className="p-4 flex-shrink-0 lg:w-[60%]">
          {/* Input for event name */}
          <div className="flex flex-col lg:flex-row mb-5 lg:w-[80vw]">
            <input
              type="text"
              placeholder="Add Event Name"
              className={`flex-grow bg-transparent w-full lg:w-[55vw] rounded-none
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
                        onClick={() => handleToggle('startDay')}
                        className="h-full w-full lg:p-3 lg:text-center text-left"
                      >
                        {selectedStartDay}
                      </button>
                    </div>
                    <TimeSelector
                      defaultTime={startTime}
                      dropdownId="start"
                      isOpen={openDropdown === 'start'}
                      onToggle={handleToggle}
                      onTimeSelect={handleStartTimeChange}
                    />
                  </div>
                  {openDropdown === 'startDay' && (
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
                              handleToggle(null);
                            }}
                            className={`p-1 cursor-pointer rounded-md text-center ${textColor}`}
                            style={{ fontSize: `max(1vw, 20px)` }}
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
                        onClick={() => handleToggle('endDay')}
                        className="h-full w-full lg:p-3 lg:text-center text-left"
                      >
                        {selectedEndDay}
                      </button>
                    </div>
                    <TimeSelector
                      defaultTime={endTime}
                      dropdownId="end"
                      isOpen={openDropdown === 'end'}
                      onToggle={handleToggle}
                      onTimeSelect={handleEndTimeChange}
                    />
                  </div>
                  {openDropdown === 'endDay' && (
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
                              handleToggle(null);
                            }}
                            className={`p-1 cursor-pointer rounded-md text-center ${textColor}`}
                            style={{ fontSize: `max(1vw, 20px)` }}
                          >
                            {day}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
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
                        onClick={() => handleToggle('startCal')}
                        onChange={handleCalendarStartChange}
                        className="h-full w-full lg:p-3 lg:text-center text-left"
                      >
                        {startDate.toLocaleDateString()}
                      </button>
                    </div>
                    <TimeSelector
                      defaultTime={startTime}
                      dropdownId="start"
                      isOpen={openDropdown === 'start'}
                      onToggle={handleToggle}
                      onTimeSelect={handleStartTimeChange}
                    />
                  </div>
                  {openDropdown === 'startCal' && (
                    <div className="lg:absolute self-bottom lg:mt-[62px] lg:z-10 rounded-md shadow-md">
                      <Calendar
                        onDateSelect={handleStartDateSelect}
                        onClose={() => handleToggle(null)}
                      />
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
                        onClick={() => handleToggle('endCal')}
                        onChange={handleCalendarEndChange}
                        className="h-full w-full lg:p-3 lg:text-center text-left"
                      >
                        {endDate.toLocaleDateString()}
                      </button>
                    </div>
                    <TimeSelector
                      defaultTime={endTime}
                      dropdownId="end"
                      isOpen={openDropdown === 'end'}
                      onToggle={handleToggle}
                      onTimeSelect={handleEndTimeChange}
                    />
                  </div>
                  {openDropdown === 'endCal' && (
                    <div className="lg:absolute self-bottom lg:mt-[62px] lg:z-10 rounded-md shadow-md">
                      <Calendar
                        onDateSelect={handleEndDateSelect}
                        onClose={() => handleToggle(null)}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Time interval selection dropdown */}
          {/* <div className="relative pb-3">
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
          </div> */}

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
          {/* Invite URL input
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
          </div> */}

          {error.error && (
            <div
              className={`w-full h-8 mb-4 bg-[#FF5C5C] flex items-center justify-center text-[#F5F5F5]`}
            >
              {error.message}
            </div>
          )}

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
          {/* <div className="flex flex-row w-full m-4 gap-4">
            <label className={`font-semibold ${textColor} text-[20px]`}>
              Invite Code:
            </label>
            <input
              type="text"
              className={`w-[55vw] text-lg bg-transparent text-left border-b-2 focus:outline-none rounded-none
                ${textColor} ${borderColor} ${placeholderColor} text-[20px]`}
            />
          </div> */}
          {error.error && (
            <div
              className={`w-[100vw] h-8 mb-4 bg-[#FF5C5C] flex items-center justify-center ${
                textColor
              }`}
            >
              {error.message}
            </div>
          )}

          {/* Create Event button */}
          <button
            onClick={get_event_data}
            className={`w-[100vw] h-[10vh] bg-[#FF5C5C] flex items-center justify-center text-[#F5F5F5]`}
            style={{ fontSize: `max(1vw, 20px)` }}
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}
