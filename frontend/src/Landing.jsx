import { useState } from 'react';
import Header from './Header'

export default function Landing() {
  const [code, setCode] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-screen p-4 ${isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'}`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="flex flex-col items-center space-y-6 p-6 w-full max-w-lg">
        <button
          className={`w-full px-8 py-6 text-lg font-semibold rounded-lg shadow-md transition duration-300 ${isDarkMode ? 'bg-white text-[#3E505B]' : 'bg-[#3E505B] text-white'}`}
        >
          Create A New Event!
        </button>
        <div className="flex flex-col items-center space-y-2 w-full">
          <input
            type="text"
            id="event-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code here"
            className={`w-full px-4 py-2 bg-transparent text-center border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'text-white border-white placeholder-white' : 'text-black border-black placeholder-black'}`}
          />
        </div>
        <div className="flex space-x-4 w-full">
          <button
            className={`flex-1 px-6 py-3 bg-transparent border-2 rounded-md shadow-md transition duration-300 ${isDarkMode ? 'text-white border-white' : 'text-black border-black'}`}
          >
            LOGIN
          </button>
          <button className="flex-1 px-6 py-3 bg-[#FF5C5C] text-white rounded-md shadow-md transition duration-300">
            SIGNUP
          </button>
        </div>
      </div>
    </div>
  );
}
