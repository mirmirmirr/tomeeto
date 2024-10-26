import { useState } from 'react';
import darkLogo from '../src/assets/tomeeto-dark.png';
import lightLogo from '../src/assets/tomeeto-light.png';

export default function Login() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`relative flex flex-col min-h-screen p-4 ${isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'}`}>
      <img src={isDarkMode ? darkLogo : lightLogo} alt="Logo" className="absolute top-4 left-4 w-24 h-auto object-contain" />
      <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 bg-gray-300 rounded-full shadow-md hover:bg-gray-400 transition duration-300">
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </button>
      <div className="flex flex-row justify-center items-center mt-12">
        <div className="relative w-1/2 flex flex-col items-center">
          <div className="absolute -top-48 left-0 w-full h-48 flex items-center justify-center transform translate-y-0">
            <span className={`text-9xl font-bold ${isDarkMode ? 'text-white' : 'text-[#3E505B]'}`}>Login</span>
          </div>
          <div className="absolute -top-48 left-0 w-full h-48 flex items-center justify-center transform translate-y-16">
            <span className="text-9xl font-bold text-red-500">Login</span>
          </div>
          <div className="absolute -top-48 left-0 w-full h-48 flex items-center justify-center transform translate-y-32">
            <span className="text-9xl font-bold text-green-500">Login</span>
          </div>
        </div>
        <div className="w-1/2 flex flex-col items-start space-y-4 p-6">
          <div className="w-full">
            <label className={`block text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>Username</label>
            <input
              type="text"
              placeholder="Username"
              className={`w-full py-2 bg-transparent border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'text-white border-white placeholder-white' : 'text-black border-black placeholder-black'}`}
            />
          </div>
          <div className="w-full">
            <label className={`block text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>Password</label>
            <input
              type="password"
              placeholder="Password"
              className={`w-full py-2 bg-transparent border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'text-white border-white placeholder-white' : 'text-black border-black placeholder-black'}`}
            />
          </div>
          <button className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'} underline`}>Forgot Password?</button>
          <button className={`w-full px-8 py-6 text-lg font-semibold rounded-lg shadow-md transition duration-300 ${isDarkMode ? 'bg-white text-[#3E505B]' : 'bg-[#3E505B] text-white'}`}>
            Login
          </button>
          <p className={`w-full text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Signup</p>
          <div className="w-full border-t-2 border-gray-300 my-4"></div>
          <button className="w-full px-6 py-3 bg-red-500 text-white rounded-md shadow-md transition duration-300">
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}