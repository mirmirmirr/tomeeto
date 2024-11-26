import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';

export default function Availability() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventCode, eventName } = location.state || {};

  console.log('Event Code:', eventCode);
  console.log('Event Name:', eventName);

  const { isDarkMode, toggleTheme } = useTheme();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [name, setName] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [isDisabled] = useState(true);
  const daysPerPage = 7;

  const [eventDetails, setEventDetails] = useState(null);
  const [allDays, setAllDays] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [hours, setHours] = useState([]);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    if (eventCode) {
      const data = {
        email: 'testing@gmail.com',
        password: '123',
        event_code: eventCode,
      };

      fetch('http://tomeeto.cs.rpi.edu:8000/event_details', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )
        .then(response => response.json())
        .then(data => {
          // Assuming the data from /event_details contains 'days' and 'start_time'
          console.log('Event details:', data);
          
          // Update the state based on the event details
          setEventDetails(data);
          updateEventData(data); // Call function to update days and hours
        })
        .catch(error => {
          console.error('Error fetching event details:', error);
        });
    }
  }, [eventCode]);

  const updateEventData = (data) => {

    const { start_date, start_time, end_date, end_time, duration, event_type } = data;
    
    const startDate = new Date(start_date + ' ' + start_time);
    const endDate = new Date(end_date + ' ' + end_time);
    console.log(startDate);
    console.log(endDate);

    const daysArray = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      console.log("here");
      daysArray.push(currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
      console.log(daysArray);
      currentDate.setDate(currentDate.getDate() + 1);
      console.log(currentDate);
    }
    
    setAllDays(daysArray);
    
    const startHour = parseInt(start_time.split(':')[0]);
    const endHour = parseInt(end_time.split(':')[0]);
    const generatedHours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
    setHours(generatedHours);
    console.log(generatedHours);

    const availabilityArray = Array(generatedHours.length).fill(Array(daysArray.length).fill(0));
    setAvailability(availabilityArray);
  };

  // const allDays = [
  //   'SUN 6',
  //   'MON 7',
  //   'TUE 8',
  //   'WED 9',
  //   'THU 10',
  //   'FRI 11',
  //   'SAT 12',
  //   'SUN 13',
  //   'MON 14',
  //   'TUE 15',
  //   'WED 16',
  // ];
  // const totalDays = allDays.length; // Total number of days
  // const hours = Array.from({ length: 15 }, (_, i) => 7 + i);

  const displayedDays = allDays.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );

  useEffect(() => {
    console.log('Availability updated:', availability);
  }, [availability]);

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

  const submit_button = async () => {
    console.log('Ran');
    console.log(name);
    console.log(availability);
    const data = {
      email: 'testing@gmail.com',
      password: '123',
      event_code: eventCode,
      nickname: name,
      availability: availability,
    };

    try {
      const response = await fetch(
        'http://tomeeto.cs.rpi.edu:8000/add_availability',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Time Set Successfully', result);

        // session management with dashboard
        navigate('/results', { state: { eventCode, eventName } });
      } else {
        console.error('Failed to record time:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className={`relative flex flex-col min-h-screen p-4 ${isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'}`}
      onMouseUp={handleMouseUp}
      style={{ userSelect: 'none' }} // Disable text selection
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div
        className={`flex flex-col mt-[4vh] p-4 ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        <div
          id="eventName"
          className="w-[80vw] lg:w-[93vw] lg:ml-4"
          style={{ fontSize: `max(3vw, 35px)` }}
        >
          {eventName}
        </div>

        <div
          className={`w-[93vw] border-t-2 m-auto opacity-25 ${isDarkMode ? 'border-gray-300' : 'border-gray-500'}`}
        ></div>

        <div className="flex w-[90vw] justify-between items-center mt-4">
          <div className="pl-4" style={{ fontSize: `max(2vw, 20px)` }}>
            Hi,{' '}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name"
              className={`border-b-2 focus:outline-none ${isDarkMode ? 'bg-[#3E505B] text-white border-white' : 'bg-[#F5F5F5] text-black border-black'}`}
            />
            <br />
            add your availability here
          </div>
          <div className="hidden lg:block">
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
          className="w-[90vw] h-[64vh] mt-[1vh] flex flex-row overflow-hidden"
        >
          <div className="flex mt-4">
            {currentPage > 0 && (
              <button
                onClick={goToPrevPage}
                className="px-4 py-2 font-bold opacity-25 hover:opacity-100"
                style={{ fontSize: '2rem' }}
              >
                &#65308; {/* Previous page entity */}
              </button>
            )}
            {(currentPage + 1) * daysPerPage < totalDays && (
              <button
                onClick={goToNextPage}
                className="h-full flex items-center justify-center px-4 py-2 opacity-0"
                style={{ fontSize: '2rem' }}
                disabled={isDisabled}
              >
                &#65310;
              </button>
            )}
          </div>

          <table className="w-full table-fixed">
            <thead>
              <tr>
                <th className="p-2" style={{ width: `min(10vw, 55px)` }}></th>
                {displayedDays.map((day, index) => (
                  <th
                    key={index}
                    className="p-2 font-[400]"
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
              {hours.map((hour, row) => (
                <tr
                  key={row}
                  className="h-full"
                  style={{ height: `calc(100% / ${hours.length})` }}
                >
                  <td
                    className="pr-2 text-right"
                    style={{ fontSize: `min(3vw, 12px)` }}
                  >
                    {hour <= 12 ? hour : hour - 12} {hour < 12 ? 'AM' : 'PM'}
                  </td>
                  {displayedDays.map((_, column) => (
                    <td
                      key={column}
                      className={`border ${isDarkMode ? 'border-white' : 'border-black'} text-[10pt]`} // Add text size class here
                      style={{
                        backgroundColor: isInDragArea(
                          row,
                          currentPage * daysPerPage + column
                        )
                          ? 'rgba(72, 187, 120, 0.5)' // Highlight drag area
                          : availability[row][
                                currentPage * daysPerPage + column
                              ]
                            ? 'rgba(72, 187, 120, 1)' // Filled cell
                            : 'transparent', // Empty cell
                        userSelect: 'none', // Disable text selection
                      }}
                      onMouseDown={() =>
                        handleMouseDown(row, currentPage * daysPerPage + column)
                      }
                      onMouseEnter={() =>
                        handleMouseEnter(
                          row,
                          currentPage * daysPerPage + column
                        )
                      }
                    ></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            {currentPage > 0 && (
              <button
                onClick={goToPrevPage}
                className="px-4 py-2 opacity-0"
                style={{ fontSize: '2rem' }}
                disabled={isDisabled}
              >
                &#65308; {/* Previous page entity */}
              </button>
            )}
            {(currentPage + 1) * daysPerPage < totalDays && (
              <button
                onClick={goToNextPage}
                className="h-full flex items-center justify-center px-4 py-2 font-bold opacity-25 hover:opacity-100"
                style={{ fontSize: '2rem' }}
              >
                &#65310; {/* Next page entity */}
              </button>
            )}
          </div>
        </div>

        <div className="lg:hidden mt-4">
          <button
            onClick={submit_button}
            className="w-full p-2 bg-[#FF5C5C] text-white rounded-md shadow-md transition duration-300 hover:bg-red-500"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
