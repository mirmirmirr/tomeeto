import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';
import useScreenSize from '../resources/useScreenSize';

import Header from '../resources/Header';
import darkEye from '../assets/eye_dark.png';
import lightEye from '../assets/eye_light.png';
import darkHidden from '../assets/hidden_dark.png';
import lightHidden from '../assets/hidden_light.png';

function deleteAllCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });
}

function setCookie(email, password) {
  const emailCookie = `login_email=${encodeURIComponent(JSON.stringify(email))}; path=/;`;
  const passwordCookie = `login_password=${encodeURIComponent(JSON.stringify(password))}; path=/;`;
  document.cookie = emailCookie;
  document.cookie = passwordCookie;
}

export default function Signup() {
  const navigate = useNavigate();

  const { isDarkMode, toggleTheme } = useTheme();
  const { isSmallScreen, isLargeScreen } = useScreenSize();

  const [passwordValues, setPasswordValues] = useState({
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
  });

  const [email, setEmailValue] = useState({
    email: '',
    showEmail: false,
  });

  const [error, setError] = useState({
    error: false,
    message: '',
  });

  const handleError = (errormessage) => {
    setError({
      error: true,
      message: errormessage,
    });
    setTimeout(() => {
      setError({
        error: false,
        message: '',
      });
    }, 2000);
  };

  const handleTogglePasswordVisibility = (field) => {
    setPasswordValues((prevValues) => ({
      ...prevValues,
      [field]: !prevValues[field],
    }));
  };

  const handlePasswordChange = (prop) => (event) => {
    setPasswordValues({
      ...passwordValues,
      [prop]: event.target.value,
    });
  };

  const handleEmailChange = (prop) => (event) => {
    setEmailValue({
      ...email,
      [prop]: event.target.value,
    });
  };

  const signupClick = async () => {
    const data = {
      email: email.email,
      password: passwordValues.password,
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_HOST + '/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        deleteAllCookies();
        const result = await response.json();
        if (result.message == 'User created') {
          deleteAllCookies();
          setCookie(email.email, passwordValues.password);
          navigate('/dashboard');
        } else {
          handleError(result.message);
          return;
        }
      } else {
        console.error('Failed to log in:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className={`relative flex flex-col min-h-screen p-4 overflow-hidden ${isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'}`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="flex flex-col lg:flex-row justify-center items-center mt-[10vh]">
        {/*signup text */}
        <div className="flex flex-row lg:flex-col items-center justify-center mt-[15vh] -mb-[50px] ml-[20px]">
          <div
            className="leading-snug -ml-[20px]"
            style={{ marginTop: 'calc((14vh - 100vh) / 3)' }}
          >
            <span
              className={`text-[18vw] lg:text-huge font-bold ${isDarkMode ? 'text-white' : 'text-[#3E505B]'}`}
            >
              Signup
            </span>
          </div>

          <div
            className="leading-snug -ml-[20px]"
            style={{ marginTop: 'calc((14vh - 100vh) / 3)' }}
          >
            <span className="text-[18vw] lg:text-huge font-bold text-red-500">
              Signup
            </span>
          </div>

          <div
            className="leading-snug -ml-[20px]"
            style={{ marginTop: 'calc((14vh - 100vh) / 3)' }}
          >
            <span className="text-[18vw] lg:text-huge font-bold text-green-500">
              Signup
            </span>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center space-y-4 p-6">
          {error.error && (
            <div
              className={`hidden lg;block absolute w-[30vw] h-8 mb-4 -mt-8 bg-[#FF5C5C] flex items-center justify-center ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              {error.message}
            </div>
          )}
          <div id="email" className="w-full">
            <label
              className={`block font-bold text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              Email
            </label>
            <input
              type={email.showEmail ? 'text' : 'email'}
              value={email.email}
              placeholder="Type email here"
              className={`w-full py-2 bg-transparent border-b-2 rounded-none focus:outline-none ${isDarkMode ? 'text-white border-white placeholder-white placeholder-opacity-50' : 'text-black border-black placeholder-black placeholder-opacity-50'}`}
              onChange={handleEmailChange('email')}
            />
          </div>

          <div id="password" className="w-full relative">
            <label
              className={`mt-[30px] block font-bold text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              Password
            </label>
            <input
              type={passwordValues.showPassword ? 'text' : 'password'}
              value={passwordValues.password}
              onChange={handlePasswordChange('password')}
              placeholder="choose a password"
              className={`w-full py-2 pr-10 bg-transparent border-b-2 rounded-none focus:outline-none ${
                isDarkMode
                  ? 'text-white border-white placeholder-white placeholder-opacity-50'
                  : 'text-black border-black placeholder-black placeholder-opacity-50'
              }`}
            />
            <img
              src={
                passwordValues.showPassword
                  ? isDarkMode
                    ? darkEye
                    : lightEye
                  : isDarkMode
                    ? darkHidden
                    : lightHidden
              }
              alt="Toggle password visibility"
              onClick={() => handleTogglePasswordVisibility('showPassword')}
              className="absolute right-2 top-[70px] w-6 h-6 cursor-pointer"
            />
          </div>

          <div id="confirmPassword" className="w-full relative">
            <label
              className={`block font-bold text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              Password Again
            </label>
            <input
              type={passwordValues.showConfirmPassword ? 'text' : 'password'}
              placeholder="enter password again"
              value={passwordValues.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
              className={`w-full py-2 pr-10 bg-transparent border-b-2 rounded-none focus:outline-none ${
                isDarkMode
                  ? 'text-white border-white placeholder-white placeholder-opacity-50'
                  : 'text-black border-black placeholder-black placeholder-opacity-50'
              }`}
            />
            <img
              src={
                passwordValues.showConfirmPassword
                  ? isDarkMode
                    ? darkEye
                    : lightEye
                  : isDarkMode
                    ? darkHidden
                    : lightHidden
              }
              alt="Toggle confirm password visibility"
              onClick={() =>
                handleTogglePasswordVisibility('showConfirmPassword')
              }
              className="absolute right-2 top-10 w-6 h-6 cursor-pointer"
            />
          </div>

          {isLargeScreen && (
            <div>
              <button
                onClick={signupClick}
                className={`w-full text-responsive py-3 font-semibold rounded-lg transition duration-300 ${isDarkMode ? 'bg-white text-[#3E505B]' : 'bg-[#3E505B] text-white'}`}
              >
                Create account
              </button>
              <p
                onClick={() => navigate('/login')}
                className={`w-full mt-[10px] subtext-responsive text-opacity-70 text-center ${isDarkMode ? 'text-white' : 'text-black'} hover:underline hover:text-opacity-100 cursor-pointer`}
              >
                But I already have an account!
              </p>
            </div>
          )}

          {/* <div
            className={`w-full border-t-2 my-4 ${
              isDarkMode ? 'border-gray-300' : 'border-gray-500'
            }`}
          ></div>

          <button
            className={`w-full mt-[10px] subtext-responsive py-3 rounded-md transition duration-300 hover:bg-red-500 hover:text-white hover:border-transparent ${
              isDarkMode
                ? 'text-white bg-transparent border-2 border-white'
                : 'text-back bg-transparent border-2 border-[#3E505B]'
            }`}
          >
            Continue with Google
          </button> */}
        </div>

        {isSmallScreen && (
          <div
            className={`fixed bottom-0 left-0 flex flex-col items-center justify-center ${
              isDarkMode ? 'text-white' : 'text-[#3E505B]'
            }`}
          >
            {error.error && (
              <div
                className={`w-[100vw] h-8 mb-4 bg-[#FF5C5C] flex items-center justify-center`}
              >
                {error.message}
              </div>
            )}
            <div
              className={`w-[100vw] h-[10vh] bg-[#FF5C5C] flex items-center justify-center text-[#F5F5F5]`}
            >
              <button
                onClick={() => navigate('/login')}
                className="mr-[40px] bg-[#FF5C5C] text-white rounded-md"
              >
                Have an account? <span className="underline">Login!</span>
              </button>
              <button
                onClick={signupClick}
                className={`w-[125px] p-[10px] rounded-md ${
                  isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'
                }`}
              >
                SIGNUP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
