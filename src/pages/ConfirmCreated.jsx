import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';

export default function ConfirmCreated() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventCode } = location.state || {};

  const { isDarkMode, toggleTheme } = useTheme();

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(eventCode)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Styling based on the current theme
  const bgColor = isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]';
  const buttonBG = !isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]';
  const buttonText = !isDarkMode ? 'text-[#F5F5F5]' : 'text-[#3E505B]';
  const textColor = isDarkMode ? 'text-[#F5F5F5]' : 'text-[#3E505B]';
  const borderColor = isDarkMode ? 'border-[#F5F5F5]' : 'border-[#3E505B]';
  const placeholderColor = isDarkMode
    ? 'placeholder-[#F5F5F5]'
    : 'placeholder-[#3E505B]';

  return (
    <div
      className={`relative flex flex-col items-start lg:justify-center min-h-screen p-4 ${bgColor}`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="flex flex-col lg:flex-row w-full align-center lg:m-0 m-[10px] mt-[10vh] lg:mt-0">
        <div>
          <h1
            className={`text-[15vw] leading-[7vh] lg:leading-[25vh] font-bold ${textColor}`}
          >
            Event Created!
          </h1>

          <p
            className={`text-[20px] mt-[10px] lg:text-[2vw] lg:text-center ${textColor}`}
          >
            (Your event will be deleted after <b>two weeks</b> inactivity)
          </p>
        </div>

        <div className="flex flex-col items-center align-center justify-end space-y-4 mr-[5vw]">
          <div className="w-[60vw] lg:w-full relative">
            <label
              className={`mt-[30px] mb-[0px] block text-[20px] lg:text-[1vw] ${textColor} flex flex-row`}
            >
              EVENT CODE
              {copySuccess && (
                <p
                  className={`text-[12px] lg:text-[0.8vw] absolute right-0 lg:right-[100px] ${textColor}`}
                >
                  hazzah!
                </p>
              )}
            </label>
            <div
              onClick={handleCopy}
              className="w-[60vw] lg:w-full mt-[-10px] py-2 flex items-center relative group"
            >
              <p
                className={`flex-1 text-responsive py-2 font-bold bg-transparent border-b-2 rounded-none focus:outline-none ${isDarkMode ? 'text-white border-white' : 'text-black border-black'}`}
              >
                {eventCode}
              </p>

              <button
                onClick={handleCopy}
                className={`hidden lg:block absolute text-[0.8vw] right-0 bottom-[55px] py-1 px-4 cursor-pointer rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${buttonText} ${buttonBG}`}
              >
                copy link
              </button>
              <button
                onClick={() => navigate('/availability')}
                className={`hidden lg:block absolute text-[0.8vw] right-0 bottom-[20px] py-1 px-4 cursor-pointer rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${buttonText} ${buttonBG}`}
              >
                fill availability
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <button
              onClick={() => navigate('/availability', { state: { eventCode: responseData.event_code } })}
              className={`lg:hidden w-[60vw] lg:w-[13vw] m-[10px] bg-transparent border-2 text-responsive py-2 font-semibold rounded-lg ${textColor} ${borderColor} hover:bg-red-500 hover:text-white hover:border-transparent`}
            >
              Add Availability
            </button>
            <button
              onClick={() => navigate('/create')}
              className={`w-[60vw] lg:w-[13vw] m-[10px] bg-transparent border-2 text-responsive py-2 font-semibold rounded-lg ${textColor} ${borderColor} hover:bg-red-500 hover:text-white hover:border-transparent`}
            >
              Edit Event
            </button>
            <button
              onClick={() => navigate('/results', { state: { eventCode: responseData.event_code } })}
              className={`w-[60vw] lg:w-[13vw] m-[10px] text-responsive py-2 font-semibold rounded-lg ${buttonText} ${buttonBG}  hover:bg-red-500 hover:text-white hover:border-transparent`}
            >
              Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
