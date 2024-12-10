import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';

export default function Availability() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventName2, isUpdating } = location.state || {};

  function getCookieValue(cookieName) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === cookieName) {
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch {
          return decodeURIComponent(value);
        }
      }
    }
    return null;
  }

  let x = document.cookie;

  const eventCode = getCookieValue('code');
  var userEmail = getCookieValue('login_email');
  var userPW = getCookieValue('login_password');
  var guestEmail = getCookieValue('guest_email');
  var guestPW = getCookieValue('guest_password');

  const { isDarkMode, toggleTheme } = useTheme();

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [name, setName] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [isDisabled] = useState(true);
  const daysPerPage = 7;

  const [eventDetails, setEventDetails] = useState(null);
  const [eventDates, setEventDates] = useState(null);
  const [isGenericWeek, setIsGenericWeek] = useState(false);
  const [allDays, setAllDays] = useState([]);
  const [weekdays, setWeekdays] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [hours, setHours] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [eventName, setEventName] = useState([]);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleError = (errormessage) => {
    setErrorMessage(errormessage);
    setIsError(true);
    setTimeout(() => setIsError(false), 2000);
  };

  useEffect(() => {
    const preventTouchScroll = (e) => {
      if (isDragging) e.preventDefault();
    };

    window.addEventListener('touchmove', preventTouchScroll, {
      passive: false,
    });

    return () => {
      window.removeEventListener('touchmove', preventTouchScroll);
    };
  }, [isDragging]);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouchDevice();
  }, []);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const targetCell = document.elementFromPoint(touch.clientX, touch.clientY);

    if (targetCell && targetCell.tagName === 'TD') {
      const day = targetCell.getAttribute('data-day');
      const hour = targetCell.getAttribute('data-hour');
      setIsDragging(true);
      setDragStart({
        day: Number(day),
        hour: currentPage * daysPerPage + Number(hour),
      });
      setDragEnd({
        day: Number(day),
        hour: currentPage * daysPerPage + Number(hour),
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const targetCell = document.elementFromPoint(touch.clientX, touch.clientY);

    if (targetCell && targetCell.tagName === 'TD') {
      const day = targetCell.getAttribute('data-day');
      const hour = targetCell.getAttribute('data-hour');
      setDragEnd({
        day: Number(day),
        hour: currentPage * daysPerPage + Number(hour),
      });
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const check_user = async (dataToUse) => {
    if (userEmail !== null && userPW !== null) {
      dataToUse['email'] = userEmail;
      dataToUse['password'] = userPW;
    } else {
      if (guestEmail !== null && guestPW !== null) {
        dataToUse['guest_id'] = parseInt(guestEmail);
        dataToUse['guest_password'] = guestPW;
      } else {
        try {
          const response = await fetch(
            'http://tomeeto.cs.rpi.edu:8000/create_guest'
          );
          if (response.ok) {
            const responseData = await response.json();
            dataToUse['guest_id'] = parseInt(responseData.guest_id);
            dataToUse['guest_password'] = responseData.guest_password;
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
  };

  useEffect(() => {
    async function handleEventDetails() {
      try {
        const data = {
          event_code: eventCode,
        };

        // Wait for check_user to complete
        await check_user(data);

        // Proceed with fetch after check_user completes
        const response = await fetch(
          'http://tomeeto.cs.rpi.edu:8000/event_details',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        const eventData = await response.json();

        // Update state based on the event details
        setEventDetails(eventData);
        updateEventData(eventData);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    if (eventCode) {
      handleEventDetails();
    }
  }, [eventCode]);

  const updateEventData = (data) => {
    const {
      all_dates,
      start_date,
      start_time,
      start_day,
      end_day,
      end_date,
      end_time,
      duration,
      event_type,
      title,
    } = data;
    setEventName(title);

    var daysArray = [];
    const weekdaysArray = [];
    if (event_type == 'date_range') {
      const startDate = new Date(start_date + ' ' + start_time);
      const endDate = new Date(end_date + ' ' + end_time);

      // Format the dates to the desired format
      const formattedStartDate = startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const formattedEndDate = endDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      setEventDates(`${formattedStartDate} - ${formattedEndDate}`);

      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        daysArray.push(currentDate.getDate().toString()); // Day of the month
        weekdaysArray.push(
          currentDate
            .toLocaleDateString('en-US', { weekday: 'short' })
            .toUpperCase()
        );
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
      setAllDays(daysArray);
      setWeekdays(weekdaysArray);
    } else {
      setIsGenericWeek(true);
      setEventDates(`${start_day} - ${end_day}`);

      const abbreviations = all_dates[0].weekdayName.map((day) => {
        switch (day) {
          case 'Saturday':
            return 'SAT';
          case 'Monday':
            return 'MON';
          case 'Tuesday':
            return 'TUE';
          case 'Wednesday':
            return 'WED';
          case 'Thursday':
            return 'THU';
          case 'Friday':
            return 'FRI';
          case 'Sunday':
            return 'SUN';
          default:
            return day;
        }
      });

      daysArray = abbreviations;
      setAllDays(daysArray);
    }

    const startHour = parseInt(start_time.split(':')[0]);
    const endHour = parseInt(end_time.split(':')[0]);
    const generatedHours = Array.from(
      { length: endHour - startHour },
      (_, i) => startHour + i
    );
    setHours(generatedHours);

    const availabilityArray = Array(generatedHours.length).fill(
      Array(daysArray.length).fill(0)
    );

    setAvailability(availabilityArray);
    setTotalDays(daysArray.length);
  };

  const displayedDays = allDays.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );

  const displayedWeekDays = weekdays.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );

  // useEffect(() => {
  //   console.log('Availability updated:', availability);
  // }, [availability]);

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if ((currentPage + 1) * daysPerPage < totalDays) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleMouseDown = (day, hour) => {
    setIsDragging(true);
    setDragStart({ day, hour });
    setDragEnd({ day, hour });
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      const { day: startDay, hour: startHour } = dragStart;
      const { day: endDay, hour: endHour } = dragEnd;

      const initialFillState = availability[startDay][startHour];

      const newAvailability = availability.map((dayArray, dayIndex) => {
        if (
          dayIndex >= Math.min(startDay, endDay) &&
          dayIndex <= Math.max(startDay, endDay)
        ) {
          return dayArray.map((hourValue, hourIndex) => {
            if (
              hourIndex >= Math.min(startHour, endHour) &&
              hourIndex <= Math.max(startHour, endHour)
            ) {
              return initialFillState ? 0 : 1;
            }
            return hourValue;
          });
        }
        return dayArray;
      });

      setAvailability(newAvailability);
    }
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  const handleMouseEnter = (day, hour) => {
    if (isDragging) {
      setDragEnd({ day, hour });
    }
  };

  const isInDragArea = (day, hour) => {
    if (!dragStart || !dragEnd) return false;
    const { day: startDay, hour: startHour } = dragStart;
    const { day: endDay, hour: endHour } = dragEnd;
    return (
      day >= Math.min(startDay, endDay) &&
      day <= Math.max(startDay, endDay) &&
      hour >= Math.min(startHour, endHour) &&
      hour <= Math.max(startHour, endHour)
    );
  };

  const transpose = (matrix) => {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  };

  const submit_button = async () => {
    if (name == '') {
      handleError('Please enter a name for the event');
      return;
    }
    const transposedAvailability = transpose(availability);

    var credentials = {
      event_code: eventCode,
      nickname: name,
      availability: transposedAvailability,
    };

    if (isUpdating === true) {
      check_user(credentials);

      try {
        const response = await fetch(
          'http://tomeeto.cs.rpi.edu:8000/update_availability',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.message.localeCompare('Availability updated') === 0) {
            navigate('/dashboard');
          }

          // session management with dashboard
        } else {
          console.error('Failed to record time:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      if (userEmail == null && userPW == null) {
        if (guestEmail != null && guestPW != null) {
          credentials.guest_id = parseInt(guestEmail);
          credentials.guest_password = guestPW;
        } else {
          await fetch('http://tomeeto.cs.rpi.edu:8000/create_guest', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((data) => {
              credentials.guest_id = data.guest_id;
              credentials.guest_password = data.guest_password;
            });
        }
      } else {
        credentials.email = userEmail;
        credentials.password = userPW;
      }
      try {
        const response = await fetch(
          'http://tomeeto.cs.rpi.edu:8000/add_availability',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          }
        );

        if (response.ok) {
          const result = await response.json();

          if (result.message != 'Availability added') {
            handleError(result.message);
            return;
          }
          navigate('/results', { state: { eventCode, eventName } });
        } else {
          console.error('Failed to record time:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div
      className={`relative flex flex-col min-h-screen lg:h-[100vh] p-4 ${isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'}`}
      onMouseUp={handleMouseUp}
      style={{ userSelect: 'none' }}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div
        className={`flex flex-col mt-[4vh] p-4 ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        <div
          id="eventName"
          className="flex flex-col lg:flex-row w-[85vw] lg:w-[93vw] lg:ml-4 justify-between"
          style={{ fontSize: `max(3vw, 35px)` }}
        >
          {eventName}

          <div
            className="lg:mr-[30px]"
            style={{
              fontSize: `max(1vw, 15px)`,
              marginTop: 'auto',
              marginBottom: '10px',
            }}
          >
            {eventDates}
          </div>
        </div>

        <div
          className={`lg:ml-4 w-[85vw] lg:w-[93vw] border-t-[1px] ${isDarkMode ? 'border-white' : 'border-gray-500'}`}
        ></div>

        <div className="flex w-[90vw] justify-between items-center mt-4">
          <div className="pl-4" style={{ fontSize: `max(2vw, 20px)` }}>
            Hi,{' '}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name"
              className={`border-b-2 focus:outline-none rounded-none ${isDarkMode ? 'bg-[#3E505B] text-white border-white' : 'bg-[#F5F5F5] text-black border-black'}`}
            />
            <br />
            add your availability here
          </div>
          <div className="hidden lg:flex flex items-end justify-end">
            {isError && (
              <div className="w-[400px] p-2 bg-[#FF5C5C] flex items-center justify-center mr-4 ">
                {errorMessage}
              </div>
            )}
            <button
              onClick={submit_button}
              className="w-32 p-2 bg-[#FF5C5C] text-white rounded-md shadow-md transition duration-300 hover:bg-red-500"
            >
              Submit
            </button>
          </div>
        </div>

        <div
          id="availability"
          className="flex flex-row w-full h-[80vh] lg:h-[60vh] lg:w-[80vw] lg:ml-[5%] mr-auto mt-[2vh] overflow-hidden"
        >
          {!isGenericWeek && (
            <div className="flex justify-between mt-4 w-[50px] h-[60vh]">
              {currentPage > 0 && !isGenericWeek && (
                <button
                  onClick={goToPrevPage}
                  className="font-bold opacity-25 hover:opacity-100"
                  style={{ fontSize: '2rem' }}
                >
                  &#65308;
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col mr-[10px] h-[60vh]">
            <div
              className=" pb-1 font-[400] opacity-0"
              style={{
                fontSize: `min(3vw, 15px)`,
                width: `min(10vw, 40px)`,
              }}
            >
              nnn
            </div>
            <div
              className="pb-2 font-[400] opacity-0"
              style={{
                fontSize: `min(3vw, 15px)`,
              }}
            >
              nnn
            </div>
            {hours.map((hour, index) => (
              <div
                key={index}
                className="relative text-right align-top"
                style={{
                  height: `calc(100% / ${hours.length})`,
                  display: 'flex',
                  justifyContent: 'end',
                  fontSize: `min(3vw, 12px)`,
                }}
              >
                <span
                  className="absolute top-0 right-0"
                  style={{ transform: `translate(0, -50%)` }}
                >
                  {hour <= 12 ? hour : hour - 12} {hour < 12 ? 'AM' : 'PM'}
                </span>
              </div>
            ))}
          </div>

          <table className="w-[100%] table-fixed h-[60vh]">
            <thead>
              <tr>
                <th style={{ width: `0.5vw` }}></th>
                {displayedWeekDays.map((day, index) => (
                  <th
                    key={index}
                    className="font-[400] opacity-75"
                    style={{
                      fontSize: `min(3vw, 15px)`,
                      height: `calc(100% / (${hours.length}+2))`,
                    }}
                  >
                    {day}
                  </th>
                ))}
              </tr>
              <tr>
                <th style={{ width: `0.5vw` }}></th>
                {displayedDays.map((day, index) => (
                  <th
                    key={index}
                    className="pb-2 font-[400]"
                    style={{
                      fontSize: `min(3vw, 15px)`,
                      height: `calc(100% / (${hours.length}+2))`,
                    }}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((_, row) => (
                <tr
                  key={row}
                  // className="h-full"
                  style={{ height: `calc(100% / (${hours.length}+2))` }}
                >
                  <td
                    className="border-gray-400 p-2 relative"
                    style={{
                      borderTop: '1px solid #b9b9b9',
                    }}
                  ></td>

                  {displayedDays.map((_, column) => (
                    <td
                      key={column}
                      data-day={row}
                      data-hour={column}
                      className={`border ${isDarkMode ? 'border-white' : 'border-black'} text-[10pt]`}
                      style={{
                        backgroundColor: isInDragArea(
                          row,
                          currentPage * daysPerPage + column
                        )
                          ? 'rgba(72, 187, 120, 0.5)'
                          : availability[row][
                                currentPage * daysPerPage + column
                              ]
                            ? 'rgba(72, 187, 120, 1)'
                            : 'transparent',
                        userSelect: 'none',
                      }}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      {...(!isTouchDevice && {
                        onMouseDown: (e) =>
                          handleMouseDown(
                            row,
                            currentPage * daysPerPage + column
                          ),
                        onMouseEnter: (e) =>
                          handleMouseEnter(
                            row,
                            currentPage * daysPerPage + column
                          ),
                      })}
                    ></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {!isGenericWeek && (
            <div className="flex justify-between mt-4 w-[60px] h-[60vh]">
              {(currentPage + 1) * daysPerPage < totalDays && (
                <button
                  onClick={goToNextPage}
                  className="font-bold opacity-25 hover:opacity-100 ml-2"
                  style={{ fontSize: '2rem' }}
                >
                  &#65310;
                </button>
              )}
            </div>
          )}
        </div>

        <div
          className={`lg:hidden fixed bottom-0 left-0 flex-shrink-0 flex flex-col`}
        >
          {isError && (
            <div className="w-[100vw] p-2 bg-[#FF5C5C] flex items-center justify-center mb-4 ">
              {errorMessage}
            </div>
          )}
          <button
            onClick={submit_button}
            className={`w-[100vw] h-[10vh] bg-[#FF5C5C] flex items-center justify-center text-[#F5F5F5]`}
            style={{ fontSize: `max(1vw, 20px)` }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
