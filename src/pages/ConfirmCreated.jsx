import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';

export default function ConfirmCreated() {
  const navigate = useNavigate();

  const { isDarkMode, toggleTheme } = useTheme();
  const eventCode = 'tomeetoplanningBETA';

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(eventCode)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Show success message briefly
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
      className={`relative flex flex-col items-start justify-center min-h-screen
        p-4 ${bgColor}`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="flex w-full align-center">
        <div>
          <h1 className={`text-[15vw] leading-[25vh] font-bold ${textColor}`}>
            Event Created!
          </h1>

          <p className={`text-[2vw] leading-[10vh] ml-[10vw] ${textColor}`}>
            (Your event will be deleted after two weeks inactivity)
          </p>
        </div>

        <div className="flex flex-col items-center align-center justify-end space-y-4 mr-[5vw]">
          <div id="password" className="w-full relative">
            <label
              className={`mt-[30px] mb-[0px] block text-[1vw] ${textColor} flex flex-row`}
            >
              EVENT CODE
              {copySuccess && (
                <p
                  className={`text-[0.8vw] absolute right-[90px] ${textColor}`}
                >
                  hazzah!
                </p>
              )}
            </label>
            <div className="w-full mt-[-10px] py-2 flex items-center relative group">
              <p
                className={`flex-1 text-responsive py-2 font-bold bg-transparent border-b-2 rounded-none focus:outline-none ${isDarkMode ? 'text-white border-white' : 'text-black border-black'}`}
              >
                {eventCode}
              </p>
              <button
                onClick={handleCopy}
                className={`absolute text-[0.8vw] right-0 bottom-[55px] py-1 px-4 cursor-pointer rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${buttonText} ${buttonBG}`}
              >
                copy link
              </button>
              <button
                onClick={() => navigate('/availability')}
                className={`absolute text-[0.8vw] right-0 bottom-[20px] py-1 px-4 cursor-pointer rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${buttonText} ${buttonBG}`}
              >
                fill availability
              </button>
            </div>
          </div>

          <div className="flex flex-row">
            <button
              onClick={() => navigate('/create')}
              className={`w-[13vw] m-[10px] bg-transparent border-2 text-responsive py-2 font-semibold rounded-lg ${textColor} ${borderColor} hover:bg-red-500 hover:text-white hover:border-transparent`}
            >
              Edit Event
            </button>
            <button
              onClick={() => navigate('/results')}
              className={`w-[13vw] m-[10px] text-responsive py-2 font-semibold rounded-lg ${buttonText} ${buttonBG}  hover:bg-red-500 hover:text-white hover:border-transparent`}
            >
              Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
