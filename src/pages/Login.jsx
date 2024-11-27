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

// Once we have signout button, clear all the cookies.

export default function Login() {
  const navigate = useNavigate();

  const { isDarkMode, toggleTheme } = useTheme();
  const { isSmallScreen, isLargeScreen } = useScreenSize();

  const [passwordValues, setPasswordValues] = useState({
    password: '',
    showPassword: false,
  });

  const [email, setEmailValue] = useState({
    email: '',
    showEmail: false,
  });

  // document.cookie = 'email=' + email;
  // document.cookie = 'password=' + passwordValues;

  const handleEmailChange = (prop) => (event) => {
    setEmailValue({
      ...email,
      [prop]: event.target.value,
    });
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

  // const myCookie = document.cookie.split('; ').find(row => row.startsWith('email=')).split('=')[1];
  // console.log(myCookie); // Outputs: 123

  // if cookies exist, login the user already
  console.log("getting cookies");
  const cookies = document.cookie; // Get all cookies as a single string
  const cookieObj = {};

  cookies.split(';').forEach(cookie => {
    const [key, value] = cookie.split('=').map(part => part.trim());
    if (key && value) {
      try {
        // Parse JSON if it's valid JSON, otherwise use as-is
        cookieObj[key] = JSON.parse(decodeURIComponent(value));
      } catch {
        cookieObj[key] = decodeURIComponent(value); // Handle plain strings
      }
    }
  });

  console.log(cookieObj);

  // const all_existing_cookies = getCookiesAsObject();
  // console.log(all_existing_cookies);
  

  const login_user = async () => {
    var data = {};
    if (cookieObj["login_email"] !== null && cookieObj["login_password"] !== null) {
      data["email"] = cookieObj["login_email"];
      data["password"] = cookieObj["login_password"];
    } else {
      data["email"] = email.email;
      data["password"] = passwordValues.password;
    }
    
    // console.log(data);

    try {
      const response = await fetch('http://tomeeto.cs.rpi.edu:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Login successful:', result);
        if (result.message.localeCompare('Login failed') == 0) {
          alert('Login Failed');
        } else {
          navigate('/dashboard');
        }
      } else {
        console.error('Failed to log in:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  if (cookieObj["login_email"] !== null && cookieObj["login_password"] !== null) {
    console.log("We have login");
    login_user();
  }

  return (
    <div
      className={`relative flex flex-col min-h-screen p-4 ${isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'}`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="flex flex-col lg:flex-row justify-center items-center mt-[10vh]">
        {/*login text */}
        <div className="flex flex-row lg:flex-col items-center justify-center mt-[15vh] -mb-[50px] ml-[20px]">
          <div
            className="leading-snug -ml-[20px]"
            style={{ marginTop: 'calc((14vh - 100vh) / 3)' }}
          >
            <span
              className={`text-[18vw] lg:text-huge font-bold ${isDarkMode ? 'text-white' : 'text-[#3E505B]'}`}
            >
              Login
            </span>
          </div>

          <div
            className="leading-snug -ml-[20px]"
            style={{ marginTop: 'calc((14vh - 100vh) / 3)' }}
          >
            <span className="text-[18vw] lg:text-huge font-bold text-red-500">
              Login
            </span>
          </div>

          <div
            className="leading-snug -ml-[20px]"
            style={{ marginTop: 'calc((14vh - 100vh) / 3)' }}
          >
            <span className="text-[18vw] lg:text-huge font-bold text-green-500">
              Login
            </span>
          </div>
        </div>

        {/*login form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center space-y-4 p-6">
          <div className="w-[80vw] lg:w-[35vw] mb-[20px]">
            <label
              className={`block font-bold text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              Username
            </label>
            <input
              type="text"
              onChange={handleEmailChange('email')}
              placeholder="enter username here"
              className={`w-[80vw] lg:w-[35vw] py-2 bg-transparent border-b-2 rounded-none focus:outline-none ${
                isDarkMode
                  ? 'text-white border-white placeholder-white placeholder-opacity-50'
                  : 'text-black border-black placeholder-black placeholder-opacity-50'
              }`}
            />
          </div>

          <div className="w-[80vw] lg:w-[35vw] relative">
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
            <div className="w-full text-right leading-loose">
              <button
                className={`text-sm text-opacity-70 ${isDarkMode ? 'text-white' : 'text-black'} hover:underline hover:text-opacity-100`}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {isLargeScreen && (
            <div>
              <button
                onClick={login_user}
                className={`w-[80vw] lg:w-[35vw] text-responsive py-3 font-semibold rounded-lg transition duration-300 ${isDarkMode ? 'bg-white text-[#3E505B]' : 'bg-[#3E505B] text-white'}`}
              >
                Login
              </button>
              <p
                onClick={() => navigate('/signup')}
                className={`w-[80vw] lg:w-[35vw] mt-[10px] subtext-responsive text-opacity-70 text-center ${isDarkMode ? 'text-white' : 'text-black'} hover:underline hover:text-opacity-100 cursor-pointer`}
              >
                Signup
              </p>
            </div>
          )}

          <div
            className={`w-[80vw] lg:w-[35vw] border-t-2 my-4 ${
              isDarkMode ? 'border-gray-300' : 'border-gray-500'
            }`}
          ></div>
          <button
            className={`w-[80vw] lg:w-[35vw] mt-[10px] subtext-responsive py-3 rounded-md transition duration-300 hover:bg-red-500 hover:text-white hover:border-transparent ${
              isDarkMode
                ? 'text-white bg-transparent border-2 border-white'
                : 'text-back bg-transparent border-2 border-[#3E505B]'
            }`}
          >
            Continue with Google
          </button>
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
              onClick={login_user}
              className={`w-[125px] p-[10px] rounded-md ${
                isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'
              }`}
            >
              LOGIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
