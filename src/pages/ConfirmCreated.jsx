import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';

export default function ConfirmCreated() {
  const navigate = useNavigate();

  const { isDarkMode, toggleTheme } = useTheme();

  // Styling based on the current theme
  const bgColor = isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]';
  const textColor = isDarkMode ? 'text-[#F5F5F5]' : 'text-[#3E505B]';
  const borderColor = isDarkMode ? 'border-[#F5F5F5]' : 'border-[#3E505B]';
  const placeholderColor = isDarkMode
    ? 'placeholder-[#F5F5F5]'
    : 'placeholder-[#3E505B]';

  return (
    <div
      className={`relative flex flex-col items-start justify-center min-h-screen
        p-4 ${bgColor}`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="flex w-full align-center">
        <div className=" -mt-[10vh]">
          <span
            className={`text-[30vh] leading-[25vh] font-bold ${isDarkMode ? 'text-white' : 'text-[#3E505B]'}`}
          >
            Event Created!
          </span>
          <br></br>

          <div className="flex flex-row justify-between items-center">
            <span
              className={`text-[3vh] leading-[10vh] ml-[10vw] ${isDarkMode ? 'text-white' : 'text-[#3E505B]'}`}
            >
              (Your event will be deleted after two weeks inactivity)
            </span>

            <div className="flex flex-col items-center space-y-4 mr-[5vw] -mt-[10vh]">
              <button
                onClick={() => navigate('/availability')}
                className={`w-[15vw] text-responsive py-2 font-semibold rounded-lg transition duration-300 ${isDarkMode ? 'bg-white text-[#3E505B]' : 'bg-[#3E505B] text-white'} hover:bg-red-500 hover:text-white hover:border-transparent`}
              >
                Add Availability
              </button>
              <div>
                <button
                  onClick={() => navigate('/create')}
                  className={`w-[10vw] m-[10px] text-responsive py-2 font-semibold rounded-lg transition duration-300 ${
                    isDarkMode
                      ? 'text-white bg-transparent border-2 border-white'
                      : 'text-back bg-transparent border-2 border-[#3E505B]'
                  } hover:bg-red-500 hover:text-white hover:border-transparent`}
                >
                  Edit Event
                </button>
                <button
                  onClick={() => navigate('/results')}
                  className={`w-[10vw] m-[10px] text-responsive py-2 font-semibold rounded-lg transition duration-300 ${isDarkMode ? 'bg-white text-[#3E505B]' : 'bg-[#3E505B] text-white'}  hover:bg-red-500 hover:text-white hover:border-transparent`}
                >
                  Results
                </button>{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
