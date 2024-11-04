import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import darkLogo from '../src/assets/tomeeto-dark.png';
import lightLogo from '../src/assets/tomeeto-light.png';

export default function Availability() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [availability, setAvailability] = useState(
    Array(7).fill(Array(24).fill(false))
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
              return initialFillState ? false : true;
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

  const handleClick = (day, hour) => {
    setAvailability((prev) =>
      prev.map((d, i) =>
        i === day ? d.map((h, j) => (j === hour ? !h : h)) : d
      )
    );
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

  /*
  const handleSubmit = async () => {
    const data = {
      name,
      availability,
    };

    try {
      const response = await fetch('YOUR_BACKEND_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Data submitted successfully');
      } else {
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  */

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hoursOfDay = Array.from({ length: 15 }, (_, i) => 7 + i);

  return (
    <div
      className={`relative flex flex-col min-h-screen p-4 ${isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'}`}
      onMouseUp={handleMouseUp}
    >
      <img
        src={isDarkMode ? darkLogo : lightLogo}
        alt="Logo"
        className="absolute top-4 left-4 w-24 h-auto object-contain cursor-pointer"
        onClick={() => navigate('/')}
      />
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 bg-gray-300 rounded-full shadow-md hover:bg-gray-400 transition duration-300"
      >
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </button>
      <div
        className={`flex flex-col mt-[7vh] p-4 ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        <div
          id="eventName"
          className="pl-4"
          style={{ fontSize: `min(3vw, 60px)` }}
        >
          tomeeto planning
        </div>

        <div
          className={`w-full border-t-2 ml-4 opacity-25 ${isDarkMode ? 'border-gray-300' : 'border-gray-500'}`}
        ></div>

        <div className="flex justify-between items-center mt-4">
          <div className="pl-4" style={{ fontSize: `min(2vw, 30px)` }}>
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
          <button
            onClick={() => console.log('Submit button clicked')}
            className={`w-32 p-2 bg-[#FF5C5C] text-white rounded-md shadow-md transition duration-300 hover:bg-red-500 ml-4`}
          >
            Submit
          </button>
        </div>

        <div
          id="availability"
          className="w-full h-[70vh] ml-auto mr-auto mt-[3vh] flex flex-col overflow-hidden"
        >
          <div className="flex justify-between mt-4 w-full">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <th className="p-2" style={{ width: `min(10vw, 55px)` }}></th>
                  {daysOfWeek.map((day, index) => (
                    <th key={index} className="p-2 font-[400]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hoursOfDay.map((hour, row) => (
                  <tr
                    key={row}
                    className="h-full"
                    style={{ height: `calc(100% / ${hoursOfDay.length})` }}
                  >
                    <td className="p-2 text-right text-[10pt]">
                      {hour <= 12 ? hour : hour - 12} {hour < 12 ? 'AM' : 'PM'}
                    </td>
                    {daysOfWeek.map((_, column) => (
                      <td
                        key={column}
                        className={`border ${isDarkMode ? 'border-white' : 'border-black'}`}
                        style={{
                          backgroundColor: availability[column][hour]
                            ? 'rgba(72, 187, 120, 1)'
                            : isInDragArea(column, hour)
                              ? availability[dragStart.day][dragStart.hour]
                                ? 'rgba(255, 0, 0, 0.5)' // Preview for unfill
                                : 'rgba(72, 187, 120, 0.5)' // Preview for fill
                              : 'transparent',
                        }}
                        onMouseDown={() => handleMouseDown(column, hour)}
                        onMouseEnter={() => handleMouseEnter(column, hour)}
                        onClick={() => handleClick(column, hour)}
                      ></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
