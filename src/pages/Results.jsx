import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';

import Header from '../resources/Header';

const check_user = async (dataToUse) => {
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
    dataToUse['email'] = cookieObj['login_email'];
    dataToUse['password'] = cookieObj['login_password'];
  } else {
    if (cookieObj['guest_email'] && cookieObj['guest_password']) {
      dataToUse['guest_id'] = parseInt(cookieObj['guest_email']);
      dataToUse['guest_password'] = cookieObj['guest_password'];
    } else {
      try {
        const response = await fetch(
          'http://tomeeto.cs.rpi.edu:8000/create_guest'
        );
        if (response.ok) {
          const responseData = await response.json();
          dataToUse['guest_id'] = parseInt(responseData.guest_id);
          dataToUse['guest_password'] = responseData.guest_password;
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

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventCode, eventName } = location.state || {};

  const { isDarkMode, toggleTheme } = useTheme();
  const [hoveredCell, setHoveredCell] = useState({ row: null, column: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [isDisabled] = useState(true);
  const daysPerPage = 7; // Number of days per page

  const [eventDetails, setEventDetails] = useState(null);
  const [eventDates, setEventDates] = useState(null);
  const [isGenericWeek, setIsGenericWeek] = useState(false);
  const [allDays, setAllDays] = useState([]);
  const [weekdays, setWeekdays] = useState([]);
  const [scheduleData, setResults] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [hours, setHours] = useState([]);
  const [availability, setAvailability] = useState([]);

  const displayedDays = allDays.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );

  const displayedWeekDays = weekdays.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );

  useEffect(() => {
    if (eventCode) {
      const credentials = {
        event_code: eventCode,
      };

      check_user(credentials);

      // First, fetch event details
      fetch('http://tomeeto.cs.rpi.edu:8000/event_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
        .then((response) => response.json())
        .then((eventDetailsData) => {

          // Update the state based on event details
          // setEventDetails(eventDetailsData);
          updateEventData(eventDetailsData);

        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [eventCode]);

  const updateEventData = async (data) => {
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

    var daysArray = [];
    const weekdaysArray = [];
    if (event_type == 'date_range') {
      // Parse start and end dates
      const startDate = new Date(`${start_date} ${start_time}`);
      const endDate = new Date(`${end_date} ${end_time}`);

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

      // Generate days and weekdays arrays
      let currentDate = new Date(startDate); // Use a new instance to avoid mutating startDate

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
      setTotalDays(daysArray.length);
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

    // Generate hours array
    const startHour = parseInt(start_time.split(':')[0], 10);
    const endHour = parseInt(end_time.split(':')[0], 10);
    const generatedHours = Array.from(
      { length: endHour - startHour },
      (_, i) => startHour + i
    );

    // Initialize availability matrix
    const availabilityArray = Array(generatedHours.length).fill(
      Array(daysArray.length).fill(0)
    );

    // Update states
    setHours(generatedHours);
    setAvailability(availabilityArray);

    // Fetch results data
    const credentials = {
      event_code: eventCode,
    };

    check_user(credentials);

    try {
      const response = await fetch(
        'http://tomeeto.cs.rpi.edu:8000/get_results',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching results: ${response.statusText}`);
      }

      const resultsData = await response.json();

      // Process and update results
      if (resultsData) {
        var scheduleDataTemp = [];
        for (const [key, value] of Object.entries(resultsData)) {
          const myDictionary = {};
          myDictionary.name = key;

          // Transform value to an array of single-element arrays
          myDictionary.availability = value.map((v) => [v]);

          scheduleDataTemp.push(myDictionary);
        }
        setResults(scheduleDataTemp);
      } else {
        console.warn('No availabilities found in results data');
      }
    } catch (error) {
      console.error('Error fetching results:', error.message);
    }
  };

  const availabilityCounts = hours.map((_, row) =>
    displayedDays.map((_, column) => {
      const count = scheduleData.filter((attendee) => {
        // Check if the availability for the specific day and time slot is 1
        return (
          attendee.availability[currentPage * daysPerPage + column] &&
          attendee.availability[currentPage * daysPerPage + column][0][row] ===
            1
        );
      }).length;

      return count / scheduleData.length;
    })
  );

  const attendeesAvailable =
    hoveredCell.row !== null && hoveredCell.column !== null
      ? scheduleData.filter((attendee) => {
          return (
            attendee.availability[
              currentPage * daysPerPage + hoveredCell.column
            ] &&
            attendee.availability[
              currentPage * daysPerPage + hoveredCell.column
            ][0][hoveredCell.row] === 1
          );
        }).length
      : 0;

  const attendeesFraction = `${attendeesAvailable}/${scheduleData.length}`;

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

  return (
    <div
      className={`relative flex flex-col min-h-screen lg:h-[100vh] p-4 ${isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'}`}
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
          className={`justify-center lg:ml-4 w-[85vw] lg:w-[93vw] border-t-[1px] ${isDarkMode ? 'border-white' : 'border-gray-500'}`}
        ></div>

        <div
          id="results"
          className="flex flex-col lg:flex-row w-full lg:w-[80vw] h-[80vh] lg:h-[70vh] lg:ml-[5%] mr-auto mt-[2vh] lg:mt-[4vh] overflow-hidden"
        >
          <div className="block lg:hidden w-[80vw] flex flex-col mb-[3vh] ml-4">
            <div className="text-[20px] font-[500]">
              Attendees ({attendeesFraction})
            </div>
            <div className="grid grid-flow-row auto-rows-max grid-cols-[repeat(auto-fill,minmax(50px,1fr))] gap-[10px] w-full">
              {scheduleData.map((attendee, index) => {
                const isAvailable =
                  hoveredCell.row !== null &&
                  hoveredCell.column !== null &&
                  attendee.availability[
                    currentPage * daysPerPage + hoveredCell.column
                  ] &&
                  attendee.availability[
                    currentPage * daysPerPage + hoveredCell.column
                  ][0][hoveredCell.row] === 1;
                const opacityStyle = isAvailable
                  ? 'opacity-100'
                  : 'opacity-50 line-through';

                return (
                  <div
                    key={index}
                    className={`text-[16px] font-[300] transition duration-300 ${opacityStyle}`}
                  >
                    {attendee.name}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-row">
            {!isGenericWeek && (
              <div className="flex justify-between mt-4 w-[50px] h-[60vh]">
                {currentPage > 0 && (
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

            <div className="flex flex-col mr-[10px] h-[70vh]">
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

            <table className="w-[90%] table-fixed h-[70vh]">
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
                    style={{ height: `calc(100% / (${hours.length}+2))` }}
                  >
                    <td
                      className="border-gray-400 p-2 relative"
                      style={{
                        borderTop: '1px solid #b9b9b9',
                      }}
                    ></td>

                    {displayedDays.map((_, column) => {
                      const availability = availabilityCounts[row][column];
                      const opacity = availability > 0 ? availability : 0;
                      const isSelected =
                        hoveredCell.row === row &&
                        hoveredCell.column === column;

                      return (
                        <td
                          key={column}
                          className={`p-2 relative cursor-pointer overflow-visible border ${isDarkMode ? 'border-white' : 'border-black'} ${
                            isSelected ? 'ring-2 ring-[#FF5C5C]' : ''
                          }`}
                          style={{
                            backgroundColor: `rgba(72, 187, 120, ${opacity})`,
                          }}
                          onMouseEnter={() => setHoveredCell({ row, column })}
                          onMouseLeave={() =>
                            setHoveredCell({ row: null, column: null })
                          }
                        ></td>
                      );
                    })}
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

          <div className="hidden lg:block w-full flex flex-col text-center h-[70vh]">
            <div className="text-[23px] font-[500] w-[200px] pt-4">
              Attendees ({attendeesFraction})
            </div>
            {scheduleData.map((attendee, index) => {
              const isAvailable =
                hoveredCell.row !== null &&
                hoveredCell.column !== null &&
                attendee.availability[
                  currentPage * daysPerPage + hoveredCell.column
                ] &&
                attendee.availability[
                  currentPage * daysPerPage + hoveredCell.column
                ][0][hoveredCell.row] === 1;
              const opacityStyle = isAvailable
                ? 'opacity-100'
                : 'opacity-50 line-through';

              return (
                <div
                  key={index}
                  className={`text-[19px] font-[300] transition duration-300 ${opacityStyle}`}
                >
                  {attendee.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
