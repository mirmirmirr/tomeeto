import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';
import useScreenSize from '../resources/useScreenSize';
import Header from '../resources/Header';

export default function Landing() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const { isDarkMode, toggleTheme } = useTheme();
  const { isSmallScreen, isLargeScreen } = useScreenSize();

  const handelFocus = () => {
    setIsFocused;
  };

  return (
    <div
      className={`z-50 relative flex flex-col items-center min-h-screen px-4 sm:px-8 ${
        isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'
      }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="flex flex-col items-center justify-center w-full h-[80vh] max-w-md sm:max-w-lg p-4 sm:p-6">
        <button
          onClick={() => navigate('/create')}
          className={`lg:px-6 lg:h-[15vh] lg:w-[60vw] lg:text-[2vw] w-full py-4 text-base text-[20px] h-[20vh] font-medium rounded-lg ${
            isDarkMode ? 'bg-white text-[#3E505B]' : 'bg-[#3E505B] text-white'
          }`}
        >
          Create A New Event!
        </button>

        <input
          type="text"
          id="event-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="or enter code here"
          className={`w-[50vw] min-w-[300px] mt-[2vh] px-3 py-2 text-[20px] bg-transparent text-center border-b-2 rounded-none lg:text-[2vw] focus:outline-none ${
            isDarkMode
              ? 'text-white border-white placeholder-white'
              : 'text-black border-black placeholder-black'
          }`}
        />

        {isLargeScreen && (
          <div className="flex space-x-4 w-[60vw] mt-[6vh]">
            <button
              onClick={() => navigate('/login')}
              className={`flex-1 px-4 py-3 bg-transparent border-2 rounded-md ${
                isDarkMode
                  ? 'text-white border-white'
                  : 'text-black border-black'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="flex-1 px-4 py-3 bg-[#FF5C5C] text-white rounded-md"
            >
              SIGNUP
            </button>
          </div>
        )}
      </div>

      {isSmallScreen && (
        <div
          className={`fixed bottom-0 left-0 w-full h-[10vh] bg-[#FF5C5C] flex items-center justify-center ${
            isDarkMode ? 'text-white' : 'text-[#3E505B]'
          }`}
        >
          <button
            onClick={() => navigate('/signup')}
            className="mr-[40px] bg-[#FF5C5C] text-white rounded-md"
          >
            No account? <span className="underline">Sign up here!</span>
          </button>
          <button
            onClick={() => navigate('/login')}
            className={`w-[125px] p-[10px] rounded-md ${
              isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'
            }`}
          >
            LOGIN
          </button>
        </div>
      )}
    </div>
  );
}
