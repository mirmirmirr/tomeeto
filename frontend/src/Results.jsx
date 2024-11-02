import { useState } from 'react';
import darkLogo from '../src/assets/tomeeto-dark.png';
import lightLogo from '../src/assets/tomeeto-light.png';

export default function Result() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hoveredCell, setHoveredCell] = useState({ row: null, column: null });

  const eventTitle = "tomeeto planning"
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const hours = Array.from({ length: 15 }, (_, i) => 7 + i);
  const scheduleData = [
    {
      name: 'Alice',
      availability: [
        [0, 1, 1, 0, 0, 0, 0], // 7 AM
        [1, 1, 1, 1, 0, 0, 0], // 8 AM
        [0, 0, 1, 0, 0, 0, 0], // 9 AM
        [0, 1, 1, 1, 1, 0, 0], // 10 AM
        [0, 0, 0, 0, 1, 0, 0], // 11 AM
        [0, 0, 0, 1, 1, 0, 0], // 12 PM
        [0, 0, 0, 0, 0, 0, 0], // 1 PM
        [1, 1, 1, 1, 1, 1, 1], // 2 PM
        [0, 0, 0, 0, 0, 0, 0], // 3 PM
        [1, 0, 1, 0, 0, 0, 0], // 4 PM
        [0, 0, 0, 0, 0, 0, 0], // 5 PM
        [1, 1, 1, 1, 1, 1, 1], // 2 PM
        [0, 0, 0, 0, 0, 0, 0], // 3 PM
        [1, 0, 1, 0, 0, 0, 0], // 4 PM
        [0, 0, 0, 0, 0, 0, 0], // 5 PM
      ],
    },
    {
      name: 'Bob',
      availability: [
        [1, 1, 0, 0, 0, 0, 0], // 7 AM
        [1, 1, 1, 1, 1, 1, 1], // 8 AM
        [0, 1, 1, 1, 0, 0, 0], // 9 AM
        [1, 0, 0, 0, 0, 0, 0], // 10 AM
        [1, 1, 1, 1, 0, 0, 0], // 11 AM
        [0, 0, 1, 1, 0, 0, 0], // 12 PM
        [0, 0, 0, 0, 0, 0, 0], // 1 PM
        [1, 1, 1, 1, 1, 1, 1], // 2 PM
        [0, 0, 0, 0, 0, 0, 0], // 3 PM
        [0, 0, 0, 0, 0, 0, 0], // 4 PM
        [0, 0, 0, 0, 0, 0, 0], // 5 PM
        [1, 1, 1, 1, 1, 1, 1], // 2 PM
        [0, 0, 0, 0, 0, 0, 0], // 3 PM
        [1, 0, 1, 0, 0, 0, 0], // 4 PM
        [0, 0, 0, 0, 0, 0, 0], // 5 PM
      ],
    },
  ];  

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const availabilityCounts = hours.map((_, row) =>
    days.map((_, column) => {
      const count = scheduleData.filter(attendee => attendee.availability[row][column]==1).length;
      return count / scheduleData.length;
    })
  );

  return (
    <div
      className={`relative flex flex-col min-h-screen p-4 ${isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'}`}
    >
      <img
        src={isDarkMode ? darkLogo : lightLogo}
        alt="Logo"
        className="absolute top-4 left-8 w-[9vw] h-auto object-contain"
      />
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 bg-gray-300 rounded-[40vw] shadow-md hover:bg-gray-400 transition duration-300"
      >
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </button>
      <div className={`flex flex-col mt-[7vh] p-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        <div  id='eventName' 
              className='pl-4'
              style={{ fontSize: `min(3vw, 60px)` }}
        >
          {eventTitle}
        </div>

        <div className={`w-[90vw] border-t-2 ml-4 opacity-25 ${ isDarkMode ? 'border-gray-300' : 'border-gray-500'}`}></div>

        <div id='results' className='w-[80vw] h-[70vh] ml-[5%] mr-auto mt-[3vh] flex flex-row overflow-hidden'>
          <table className='w-[80%] h-[70%] table-fixed'>
            <thead>
                <tr>
                <th className="p-2 w-[10%]"></th>
                  {days.map((day, index) => (
                    <th key={index} className="p-2 font-[400]">{day}</th>
                  ))}
                </tr>
            </thead>
            <tbody>
              {hours.map((hour, row) => (
                <tr key={row} className="h-full" style={{ height: `calc(100% / ${hours.length})` }}>
                  <td className="p-2 text-right text-[10pt]">{hour <= 12 ? hour : hour - 12} {hour < 12 ? 'AM' : 'PM'}</td>
                  {days.map((_,column) => {
                    const availability = availabilityCounts[row][column];
                    const opacity = availability > 0 ? availability : 0;

                    return (
                      <td 
                        key={column}
                        className="border border-gray-400 p-2"
                        style={{
                          backgroundColor:`rgba(72, 187, 120, ${opacity})`,
                          border: '1px solid #b9b9b9',
                        }}

                        onMouseEnter={() => setHoveredCell({ row, column })}
                        onMouseLeave={() => setHoveredCell({ row: null, column: null })}
                      ></td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className='w-[25%] flex flex-col ml-auto mr-auto items-center'>
            <div className='text-[23px] font-[500] p-5' >Attendees ({scheduleData.length})</div>
            {scheduleData.map((attendee, index) => {
              const isAvailable = hoveredCell.row !== null && hoveredCell.column !== null && attendee.availability[hoveredCell.row][hoveredCell.column] == 1;
              const opacityStyle = isAvailable ? 'opacity-100' : 'opacity-50 line-through';

              return (
                <div key={index} className={`text-[19px] font-[300] transition duration-300 ${opacityStyle}`}>
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
