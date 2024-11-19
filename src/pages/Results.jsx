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
  ];
  const totalDays = allDays.length; // Total number of days
  const hours = Array.from({ length: 15 }, (_, i) => 7 + i);

  const displayedDays = allDays.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );


  var receivedData = {};
  var scheduleData = [];

  
  const fetch_data = async () => {
    console.log("Ran");
    const data = {
      "event_code": "some event code"
    }

    try {
      const response = await fetch("http://tomeeto.cs.rpi.edu:8000/get_results", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Time Set Successfully', result);
        receivedData = result.availabilities;

        // process the data
        for (const [key, value] of Object.entries(receivedData)) {
          console.log(key, value);
          const myDictionary = {};
          myDictionary.name = key;
          myDictionary.availability = value;
          scheduleData.push(myDictionary);
        }
      } else {
        console.error('Failed get results:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // fetch_data()
  //   {
  //     name: 'Alice',
  //     availability: [
  //       [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0], // 7 AM
  //       [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0], // 8 AM
  //       [0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0], // 9 AM
  //       [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0], // 10 AM
  //       [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0], // 11 AM
  //       [0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0], // 12 PM
  //       [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 1 PM
  //       [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0], // 2 PM
  //       [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 3 PM
  //       [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0], // 4 PM
  //       [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 5 PM
  //       [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0], // 2 PM
  //       [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 3 PM
  //       [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0], // 4 PM
  //       [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 5 PM
  //     ],
  //   },
  //   {
  //     name: 'Bob',
  //     availability: [
  //       [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0], // 8 AM
  //       [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 7 AM
  //       [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0], // 9 AM
  //       [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 10 AM
  //       [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0], // 11 AM
  //       [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0], // 12 PM
  //       [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 1 PM
  //       [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0], // 2 PM
  //       [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 3 PM
  //       [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 4 PM
  //       [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 5 PM
  //       [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0], // 2 PM
  //       [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 3 PM
  //       [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0], // 4 PM
  //       [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 5 PM
  //     ],
  //   },
  // ];

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
          className={`w-[90vw] border-t-2 ml-4 opacity-25 ${isDarkMode ? 'border-gray-300' : 'border-gray-500'}`}
        ></div>

        <div
          id="results"
          className="w-[80vw] h-[70vh] ml-[5%] mr-auto mt-[3vh] flex flex-row overflow-hidden"
        >
          <div className="flex justify-between mt-4">
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

          <table className="w-[80%] table-fixed">
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
                  <td className="text-right text-[10pt]">
                    {hour <= 12 ? hour : hour - 12} {hour < 12 ? 'AM' : 'PM'}
                  </td>
                  {displayedDays.map((_, column) => {
                    const availability = availabilityCounts[row][column];
                    const opacity = availability > 0 ? availability : 0;

                    return (
                      <td
                        key={column}
                        className="border border-gray-400 p-2"
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

          <div className="w-[25%] flex flex-col ml-auto mr-auto items-center">
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
    </div>
  );
}
