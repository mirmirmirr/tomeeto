import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../resources/ThemeContext';

import Header from '../resources/Header';
import darkEye from '../assets/eye_dark.png';
import lightEye from '../assets/eye_light.png';
import darkHidden from '../assets/hidden_dark.png';
import lightHidden from '../assets/hidden_light.png';

export default function Login() {
  const navigate = useNavigate();

  const { isDarkMode, toggleTheme } = useTheme();
  const [passwordValues, setPasswordValues] = useState({
    password: '',
    showPassword: false,
  });
   
  const [email, setEmailValue] = useState({
    email: '',
    showEmail: false,
  })

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

  const login_user = async () => {
    console.log(passwordValues.password);
    console.log(email.email);
    const data = {
      "email": email.email,
      "password": passwordValues.password
    };

    try {
      const response = await fetch("http://129.161.89.45:8000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Login successful:', result);
        if ((result.message).localeCompare("Login failed") == 0) {
          alert("Login Failed");
        } else {
          navigate('/signup');
        }
      } else {
        console.error('Failed to log in:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div
      className={`relative flex flex-col min-h-screen p-4 ${isDarkMode ? 'bg-[#3E505B]' : 'bg-[#F5F5F5]'}`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="flex flex-row justify-center items-center mt-[10vh]">
        <div className="flex flex-col items-center justify-center">
          <div className="leading-snug -mt-[10vh]">
            <span
              className={`text-huge font-bold ${isDarkMode ? 'text-white' : 'text-[#3E505B]'}`}
            >
              Login
            </span>
          </div>
          <div className="leading-snug -mt-[30.4vh]">
            <span className="text-huge font-bold text-red-500">Login</span>
          </div>
          <div className="leading-snug -mt-[30.4vh]">
            <span className="text-huge font-bold text-green-500">Login</span>
          </div>
        </div>

        <div className="w-1/2 flex flex-col items-center space-y-4 p-6">
          <div className="w-[35vw] mb-[20px]">
            <label
              className={`block font-bold text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              Username
            </label>
            <input
              type="text"
              onChange={handleEmailChange('email')}
              placeholder="enter username here"
              className={`w-[35vw] py-2 bg-transparent border-b-2 focus:outline-none ${
                isDarkMode
                  ? 'text-white border-white placeholder-white placeholder-opacity-50'
                  : 'text-black border-black placeholder-black placeholder-opacity-50'
              }`}
            />
          </div>

          <div className="w-[35vw] relative">
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
              className={`w-full py-2 pr-10 bg-transparent border-b-2 focus:outline-none ${
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

          <button
            onClick={login_user}
            className={`w-[35vw] text-responsive py-3 font-semibold rounded-lg transition duration-300 ${isDarkMode ? 'bg-white text-[#3E505B]' : 'bg-[#3E505B] text-white'}`}
          >
            Login
          </button>
          <p
            onClick={() => navigate('/signup')}
            className={`w-[35vw] subtext-responsive text-opacity-70 text-center ${isDarkMode ? 'text-white' : 'text-black'} hover:underline hover:text-opacity-100 cursor-pointer`}
          >
            Signup
          </p>
          <div
            className={`w-[35vw] border-t-2 my-4 ${
              isDarkMode ? 'border-gray-300' : 'border-gray-500'
            }`}
          ></div>
          <button
            className={`w-[35vw] mt-[10px] subtext-responsive py-3 rounded-md transition duration-300 hover:bg-red-500 hover:text-white hover:border-transparent ${
              isDarkMode
                ? 'text-white bg-transparent border-2 border-white'
                : 'text-back bg-transparent border-2 border-[#3E505B]'
            }`}
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
