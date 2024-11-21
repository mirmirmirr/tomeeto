import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';

import Header from '../resources/Header';

export default function Result() {
  const navigate = useNavigate();

  const { isDarkMode, toggleTheme } = useTheme();
  const [hoveredCell, setHoveredCell] = useState({ row: null, column: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [isDisabled] = useState(true);
  const daysPerPage = 7; // Number of days per page

  const eventTitle = 'tomeeto planning';
  const weekdays = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'SUN',
    'MON',
    'TUE',
    'WED',
  ];

  const allDays = [
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
  ];
  const totalDays = allDays.length; // Total number of days
  const hours = Array.from({ length: 15 }, (_, i) => 7 + i);

  const displayedDays = allDays.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );

  const displayedWeekDays = weekdays.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );

  const scheduleData = [
    {
      name: 'Alice',
      availability: [
        [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0], // 7 AM
        [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0], // 8 AM
        [0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0], // 9 AM
        [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0], // 10 AM
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0], // 11 AM
        [0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0], // 12 PM
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 1 PM
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0], // 2 PM
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 3 PM
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0], // 4 PM
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 5 PM
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0], // 2 PM
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 3 PM
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0], // 4 PM
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 5 PM
      ],
    },
    {
      name: 'Bob',
      availability: [
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0], // 8 AM
        [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 7 AM
        [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0], // 9 AM
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 10 AM
        [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0], // 11 AM
        [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0], // 12 PM
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 1 PM
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0], // 2 PM
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 3 PM
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 4 PM
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 5 PM
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0], // 2 PM
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 3 PM
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0], // 4 PM
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 5 PM
      ],
    },
  ];

  const availabilityCounts = hours.map((_, row) =>
    displayedDays.map((_, column) => {
      const count = scheduleData.filter(
        (attendee) => attendee.availability[row][column] == 1
      ).length;
      return count / scheduleData.length;
    })
  );

  const attendeesAvailable = hoveredCell.row !== null && hoveredCell.column !== null
  ? scheduleData.filter(
      (attendee) =>
        attendee.availability[hoveredCell.row][hoveredCell.column] == 1
    ).length
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
      className={`relative flex flex-col min-h-screen p-4 ${isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'}`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div
        className={`flex flex-col mt-[5vh] items-center ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        <div
          id="eventName"
          className="w-[80vw] lg:w-[93vw]"
          style={{ fontSize: `max(3vw, 35px)` }}
        >
          {eventTitle}
        </div>

        <div
          className={`w-[80vw] lg:w-[93vw] border-t-[1px] ${isDarkMode ? 'border-white' : 'border-gray-500'}`}
        ></div>

        <div
          id="results"
          className="w-full lg:w-[80vw] h-[100vh] lg:h-[70vh] lg:ml-[5%] items-center mr-auto mt-[3vh] flex flex-col lg:flex-row overflow-hidden"
        >
          <div className="block lg:hidden w-[80vw] flex flex-col mb-[3vh]">
            <div className="text-[20px] font-[500]">
              Attendees ({attendeesFraction})
            </div>
            <div className="grid grid-flow-row auto-rows-max grid-cols-[repeat(auto-fill,minmax(50px,1fr))] gap-[10px] justify-center w-full">
              {scheduleData.map((attendee, index) => {
                const isAvailable =
                  hoveredCell.row !== null &&
                  hoveredCell.column !== null &&
                  attendee.availability[hoveredCell.row][hoveredCell.column] == 1;
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
            <div className="flex justify-between mt-4">
              {currentPage > 0 && (
                <button
                  onClick={goToPrevPage}
                  className="lg:px-4 py-2 font-bold opacity-25 hover:opacity-100"
                  style={{ fontSize: '2rem' }}
                >
                  &#65308;
                </button>
              )}
              {(currentPage + 1) * daysPerPage < totalDays && (
                <button
                  onClick={goToNextPage}
                  className="h-full flex items-center justify-center lg:px-4 py-2 opacity-0"
                  style={{ fontSize: '2rem' }}
                  disabled={isDisabled}
                >
                  &#65310;
                </button>
              )}
            </div>

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

            <table className="w-[80%] table-fixed h-[70vh]">
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

                      return (
                        <td
                          key={column}
                          className="border border-gray-400 p-2 relative"
                          style={{
                            backgroundColor: `rgba(72, 187, 120, ${opacity})`,
                            border: '1px solid #b9b9b9',
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

            <div className="flex justify-between mt-4">
              {currentPage > 0 && (
                <button
                  onClick={goToPrevPage}
                  className="lg:px-4 py-2 opacity-0"
                  style={{ fontSize: '2rem' }}
                  disabled={isDisabled}
                >
                  &#65308;
                </button>
              )}
              {(currentPage + 1) * daysPerPage < totalDays && (
                <button
                  onClick={goToNextPage}
                  className="h-full flex items-center justify-center lg:px-4 py-2 font-bold opacity-25 hover:opacity-100"
                  style={{ fontSize: '2rem' }}
                >
                  &#65310;
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:block w-full flex flex-col text-center h-[70vh]">
            <div className="text-[23px] font-[500] w-[200px] pt-4">
              Attendees ({attendeesFraction})
            </div>
            {scheduleData.map((attendee, index) => {
              const isAvailable =
                hoveredCell.row !== null &&
                hoveredCell.column !== null &&
                attendee.availability[hoveredCell.row][hoveredCell.column] == 1;
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
