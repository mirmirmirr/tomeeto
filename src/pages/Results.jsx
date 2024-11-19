import { useState } from 'react';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';

export default function Result() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [hoveredCell, setHoveredCell] = useState({ row: null, column: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const daysPerPage = 7; // Number of days per page

  const eventTitle = 'tomeeto planning';
  const allDays = [
    'SUN 6',
    'MON 7',
    'TUE 8',
    'WED 9',
    'THU 10',
    'FRI 11',
    'SAT 12',
    'SUN 13',
    'MON 14',
    'TUE 15',
    'WED 16',
    'THU 17',
    'FRI 18',
    'SAT 19',
    'SUN 20',
    'MON 21',
    'TUE 22',
    'WED 23',
    'THU 24',
    'FRI 25',
    'SAT 26',
    'SUN 27',
    'MON 28',
    'TUE 29',
    'WED 30',
  ];

  const totalDays = allDays.length; // Total number of days
  const hours = Array.from({ length: 15 }, (_, i) => 7 + i);
  const displayedDays = allDays.slice(
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

  const handleCellClick = (row, column) => {
    setSelectedCell({ row, column });
  };

  const closeModal = () => {
    setSelectedCell(null);
  };

  return (
    <div
      className={`relative flex flex-col min-h-screen p-4 ${isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'}`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div
        className={`flex flex-col flex-grow mt-[4vh] p-4 ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        <div
          id="eventName"
          className="pl-4 mb-4"
          style={{ fontSize: `min(4vh, 70px)` }}
        >
          {eventTitle}
        </div>
        <div
          className={`w-[93vw] border-t-2 m-auto opacity-25 ${isDarkMode ? 'border-gray-300' : 'border-gray-500'}`}
        ></div>
        <div className="flex w-[90vw] justify-between items-center mt-4">
          <div className="pl-4" style={{ fontSize: `min(3vh, 25px)` }}>
            Results
          </div>
        </div>
        <div
          id="availability"
          className="w-[90vw] flex-grow mt-[2vh] flex flex-row overflow-x-auto overflow-y-auto"
        >
          <div
            className="flex flex-col justify-center"
            style={{ minWidth: '50px' }}
          >
            {currentPage > 0 && (
              <button
                onClick={goToPrevPage}
                className="px-4 py-2 font-bold opacity-25 hover:opacity-100 mb-2"
                style={{ fontSize: '2rem' }}
              >
                &#65308; {/* Previous page entity */}
              </button>
            )}
          </div>
          <div className="overflow-x-auto" style={{ flexGrow: 1 }}>
            <table
              className="w-full table-fixed mt-4"
              style={{ minWidth: '800px' }}
            >
              <thead>
                <tr>
                  <th className="p-2" style={{ width: '100px' }}></th>
                  {displayedDays.map((day, index) => (
                    <th
                      key={index}
                      className="p-2 font-[400] text-center text-[10pt] sm:text-[12pt]"
                      style={{ width: '100px' }}
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
                    <td className="pr-2 text-right text-[10pt] sm:text-[12pt] whitespace-nowrap">
                      {hour <= 12 ? hour : hour - 12} {hour < 12 ? 'AM' : 'PM'}
                    </td>
                    {displayedDays.map((_, column) => {
                      const availability = availabilityCounts[row][column];
                      const opacity = availability > 0 ? availability : 0;

                      return (
                        <td
                          key={column}
                          className={`border ${isDarkMode ? 'border-white' : 'border-black'}`}
                          style={{
                            backgroundColor: `rgba(72, 187, 120, ${opacity})`,
                            userSelect: 'none',
                            width: '100px',
                          }}
                          onMouseEnter={() => setHoveredCell({ row, column })}
                          onMouseLeave={() =>
                            setHoveredCell({ row: null, column: null })
                          }
                          onClick={() => handleCellClick(row, column)}
                        ></td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="flex flex-col justify-center ml-4"
            style={{ minWidth: '50px', width: '50px' }}
          >
            {(currentPage + 1) * daysPerPage < totalDays && (
              <button
                onClick={goToNextPage}
                className="px-4 py-2 font-bold opacity-25 hover:opacity-100"
                style={{ fontSize: '2rem' }}
              >
                &#65310; {/* Next page entity */}
              </button>
            )}
          </div>
          <div className="hidden sm:flex w-[25%] flex-col ml-4 items-center">
            <div className="text-[23px] font-[500] p-5">
              Attendees ({scheduleData.length})
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
      {selectedCell && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 sm:hidden">
          <div className="bg-white p-4 rounded-md shadow-md w-[80vw] max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Availability Details</h2>
            <div className="text-left">
              {scheduleData.map((attendee, index) => {
                const isAvailable =
                  attendee.availability[selectedCell.row][
                    selectedCell.column
                  ] == 1;
                const availabilityStyle = isAvailable
                  ? 'text-green-500'
                  : 'text-red-500';

                return (
                  <div
                    key={index}
                    className={`text-[19px] font-[300] text-center ${availabilityStyle}`}
                  >
                    {attendee.name}:{' '}
                    {isAvailable ? 'Available' : 'Not Available'}
                  </div>
                );
              })}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
