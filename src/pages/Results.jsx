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
  ];

  const totalDays = allDays.length; // Total number of days
  const hours = Array.from({ length: 15 }, (_, i) => 7 + i);
  const displayedDays = allDays.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
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
        className={`flex flex-col mt-[4vh] p-4 ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        <div
          id="eventName"
          className="pl-4"
          style={{ fontSize: `min(3vw, 60px)` }}
        >
          {eventTitle}
        </div>
        <div
          className={`w-[93vw] border-t-2 m-auto opacity-25 ${isDarkMode ? 'border-gray-300' : 'border-gray-500'}`}
        ></div>
        <div className="flex w-[90vw] justify-between items-center mt-4">
          <div className="pl-4" style={{ fontSize: `min(2vw, 20px)` }}>
            Results
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
                  <th key={index} className="p-2 font-[400]">
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
                  <td className="pr-2 text-right text-[10pt]">
                    {hour <= 12 ? hour : hour - 12} {hour < 12 ? 'AM' : 'PM'}
                  </td>
                  {displayedDays.map((_, column) => (
                    <td
                      key={column}
                      className={`border ${isDarkMode ? 'border-white' : 'border-black'}`}
                      style={{
                        backgroundColor:
                          hoveredCell.row === row &&
                          hoveredCell.column === column
                            ? 'rgba(72, 187, 120, 0.5)'
                            : 'transparent',
                        userSelect: 'none',
                      }}
                      onMouseEnter={() => setHoveredCell({ row, column })}
                      onMouseLeave={() =>
                        setHoveredCell({ row: null, column: null })
                      }
                      onClick={() => handleCellClick(row, column)}
                    ></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedCell && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md shadow-md w-[80vw] max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Availability Details</h2>
            <p>
              Details for cell at row {selectedCell.row} and column{' '}
              {selectedCell.column}
            </p>
            {/* Add your details here */}
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
