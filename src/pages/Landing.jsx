import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';

export default function Landing() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 ${
        isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'
      }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="flex flex-col items-center space-y-6 w-full max-w-md sm:max-w-lg p-4 sm:p-6">
        <button
          onClick={() => navigate('/create')}
          className={`w-full px-6 py-4 text-base sm:text-lg font-semibold rounded-lg shadow-md transition duration-300 ${
            isDarkMode ? 'bg-white text-[#3E505B]' : 'bg-[#3E505B] text-white'
          }`}
        >
          Create A New Event!
        </button>
        <div className="flex flex-col items-center space-y-4 w-full">
          <input
            type="text"
            id="event-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code here"
            className={`w-full px-3 py-2 bg-transparent text-center border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? 'text-white border-white placeholder-white'
                : 'text-black border-black placeholder-black'
            }`}
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 w-full">
          <button
            onClick={() => navigate('/login')}
            className={`flex-1 px-4 py-3 bg-transparent border-2 rounded-md shadow-md transition duration-300 ${
              isDarkMode ? 'text-white border-white' : 'text-black border-black'
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="flex-1 px-4 py-3 bg-[#FF5C5C] text-white rounded-md shadow-md transition duration-300"
          >
            SIGNUP
          </button>
        </div>
      </div>
    </div>
  );
}
