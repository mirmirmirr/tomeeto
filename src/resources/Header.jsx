import { useNavigate } from 'react-router-dom';
import darkLogo from '../assets/tomeeto-dark.png';
import lightLogo from '../assets/tomeeto-light.png';
import Toggle from './Toggle';
import { useState, useEffect, useRef } from 'react';

function deleteAllCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    // Decode cookie name to handle encoded cookies
    const decodedName = decodeURIComponent(name);
    document.cookie = `${decodedName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  });
}

export default function Header({ isDarkMode, toggleTheme }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const checkUserLogin = () => {
      const cookies = document.cookie;
      const cookieObj = {};

      cookies.split(';').forEach((cookie) => {
        const [key, value] = cookie.split('=').map((part) => part.trim());
        if (key && value) {
          try {
            // Parse JSON if it's valid JSON, otherwise use as-is
            const parsedValue = JSON.parse(decodeURIComponent(value));
            cookieObj[key] = String(parsedValue);
          } catch {
            cookieObj[key] = String(decodeURIComponent(value));
          }
        }
      });

      if (cookieObj['login_email'] && cookieObj['login_password']) {
        setIsUserLoggedIn(true);
      } else if (cookieObj['guest_email'] && cookieObj['guest_password']) {
        setIsGuestLoggedIn(true);
      }
    };

    checkUserLogin();
  }, []);

  // Update screen size state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize(); // Initial check on mount
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    deleteAllCookies();
    setIsUserLoggedIn(false);
    setIsGuestLoggedIn(false);
    navigate('/');
  };

  // Hide menu when clicking outside
  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(menuOpen);
      }
      if (hamburgerRef.current && hamburgerRef.current.contains(event.target)) {
        setMenuOpen(!menuOpen);
      }
    };

    document.addEventListener('mousedown', handleClick);
  });

  return (
    <div className="p-4 justify-between w-full">
      <div
        className={`${menuOpen ? 'bg-black bg-opacity-25 absolute top-0 left-0 w-full h-full' : 'absolute top-8 left-8'}`}
      ></div>

      <button
        ref={hamburgerRef}
        className={`absolute top-10 left-8 lg:hidden text-[30px] focus:outline-none z-20 ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        <div className="w-10 h-10 cursor-pointer flex flex-col items-center justify-center">
          <div
            className={`w-[50%] h-[2px] rounded-sm transition-all duration-300 origin-left translate-y-[0.50rem] ${isDarkMode ? 'bg-white' : 'bg-black'} ${
              menuOpen && 'rotate-[-45deg]'
            }`}
          ></div>
          <div
            className={`w-[50%] h-[2px] rounded-md transition-all duration-300 origin-center ${isDarkMode ? 'bg-white' : 'bg-black'} ${
              menuOpen && 'hidden'
            }`}
          ></div>
          <div
            className={`w-[50%] h-[2px] rounded-md transition-all duration-300 origin-left -translate-y-[0.50rem] ${isDarkMode ? 'bg-white' : 'bg-black'} ${
              menuOpen && 'rotate-[45deg]'
            }`}
          ></div>
        </div>
      </button>

      {menuOpen && (
        <div
          ref={menuRef} // Attach ref to the menu
          className={`absolute left-0 top-0 w-[65vw] h-[100vh] z-10 ${
            isDarkMode
              ? 'bg-[#3E505B] text-white'
              : 'bg-[#F5F5F5] text-[#3E505B]'
          }`}
        >
          <Toggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

          <ul className="flex flex-col mt-[100px] ml-[22px]">
            <li
              className="px-4 py-2 cursor-pointer hover:underline"
              onClick={() => navigate('/create')}
            >
              Create Event
            </li>
            {(isUserLoggedIn || isGuestLoggedIn) && (
              <li
                className="px-4 py-2 cursor-pointer hover:underline"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </li>
            )}
            {!isUserLoggedIn ? (
              <>
                <li
                  className="px-4 py-2 cursor-pointer hover:underline"
                  onClick={() => navigate('/login')}
                >
                  Login
                </li>
                <li
                  className="px-4 py-2 cursor-pointer hover:underline"
                  onClick={() => navigate('/signup')}
                >
                  Signup
                </li>
              </>
            ) : (
              <>
                <li
                  className="px-4 py-2 cursor-pointer hover:underline"
                  onClick={handleLogout}
                >
                  Log Out
                </li>
              </>
            )}
            {isGuestLoggedIn && (
              <>
                <li
                  className="mt-8 px-4 py-2 cursor-pointer hover:underline"
                  onClick={handleLogout}
                >
                  Clear Dashboard Data
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      <img
        src={isDarkMode ? darkLogo : lightLogo}
        alt="Logo"
        className="absolute top-10 left-0 right-0 mx-auto w-[25vw] h-auto object-contain cursor-pointer 
                  lg:top-8 lg:left-8 lg:w-[9vw] lg:mx-[0px]"
        onClick={() => navigate('/')}
      />

      {isLargeScreen && (
        <div className="flex flex-row">
          <Toggle
            // className="absolute top-11 right-10"
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />

          {(isUserLoggedIn || isGuestLoggedIn) && (
            <label
              class="absolute top-11 right-[140px] group"
              onClick={() => navigate('/dashboard')}
            >
              <div
                class={`absolute left-1/2 top-full mt-1 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none text-white py-1 px-2 rounded-md shadow-lg transition-opacity duration-300 text-[10px] ${isDarkMode ? 'bg-zinc-500' : 'bg-[#3E505B]'}`}
              >
                Dashboard
              </div>

              <input type="checkbox" class="hidden peer" />
              <div
                tabindex="0"
                class={`burger flex items-center justify-center w-[38px] h-[38px] m-[2px] rounded-full transition duration-300 cursor-pointer focus:outline-none ${isDarkMode ? 'bg-zinc-500' : 'bg-[#3E505B]'}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="white"
                  height="15"
                  width="15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z"></path>
                </svg>
              </div>
            </label>
          )}
        </div>
      )}
    </div>
  );
}
