import { useState, useEffect } from 'react';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';
import { useNavigate } from 'react-router-dom';

var id = 1;

function deleteAllCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    // Decode cookie name to handle encoded cookies
    const decodedName = decodeURIComponent(name);
    document.cookie = `${decodedName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  });
}

const check_user = async (dataToUse) => {
  const cookies = document.cookie; // Get all cookies as a single string
  const cookieObj = {};

  cookies.split(';').forEach((cookie) => {
    const [key, value] = cookie.split('=').map((part) => part.trim());
    if (key && value) {
      try {
        // Parse JSON if it's valid JSON, otherwise use as-is
        const parsedValue = JSON.parse(decodeURIComponent(value));
        cookieObj[key] = String(parsedValue);
      } catch {
        cookieObj[key] = String(decodeURIComponent(value)); // Handle plain strings
      }
    }
  });

  if (cookieObj['login_email'] && cookieObj['login_password']) {
    dataToUse['email'] = cookieObj['login_email'];
    dataToUse['password'] = cookieObj['login_password'];
  } else {
    if (cookieObj['guest_email'] && cookieObj['guest_password']) {
      dataToUse['email'] = cookieObj['guest_email'];
      dataToUse['password'] = cookieObj['guest_password'];
    } else {
      try {
        const response = await fetch(
          'http://tomeeto.cs.rpi.edu:8000/create_guest'
        );
        if (response.ok) {
          const responseData = await response.json();
          dataToUse['email'] = responseData.guest_id;
          dataToUse['password'] = responseData.guest_password;
          const guestEmailCookie = `guest_email=${encodeURIComponent(JSON.stringify(responseData.guest_id))}; path=/;`;
          const guestPasswordCookie = `guest_password=${encodeURIComponent(JSON.stringify(responseData.guest_password))}; path=/;`;
          document.cookie = guestEmailCookie;
          document.cookie = guestPasswordCookie;
        } else {
          console.error(
            'Failed to make guest:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
};

export default function Dashboard() {
  const [mockIndividualEvents, setArrayOne] = useState([]); // First array of objects
  const [mockUserEvents, setArrayTwo] = useState([]); // Second array of objects
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notification, setNotification] = useState('');

  const handleCopyLink = async (event) => {
    try {
      navigator.clipboard.writeText(event.code).then(() => {
        setNotification('Link copied to clipboard');
        setTimeout(() => setNotification(''), 3000);
      });
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleViewBookingLink = async (event) => {
    try {
      navigate('/results', {
        state: { eventCode: event.code, eventName: event.title },
      });
    } catch (error) {
      console.error('Error viewing booking link:', error);
    }
  };

  const handleEditEvent = async (event) => {
    try {
      const data = await response.json();
      navigate(data.editUrl);
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  const get_all_events = async () => {
    const data = {
      // email: 'testing@gmail.com',
      // password: '123',
    };

    check_user(data);
    console.log(data);

    try {
      const response = await fetch(
        'http://tomeeto.cs.rpi.edu:8000/dashboard_events',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Events retrieved successfully', result);
        console.log(result);
        const createdEvents = result.my_events;
        const participatingEvents = result.other_events;

        // process the data
        var alpha = [];
        for (const [key, value] of Object.entries(createdEvents)) {
          const myDictionary = {};
          myDictionary.id = id;
          myDictionary.title = value;
          myDictionary.code = key;
          alpha.push(myDictionary);
          id += 1;
        }

        setArrayTwo(alpha);
        // console.log(mockIndividualEvents);
        id = 1;
        var beta = [];
        for (const [key, value] of Object.entries(participatingEvents)) {
          console.log(key, value);
          const myDictionary = {};
          myDictionary.id = id;
          myDictionary.code = key;
          myDictionary.title = value;
          beta.push(myDictionary);
          id += 1;
        }
        setArrayOne(beta);
      } else {
        console.error('Failed get results:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    get_all_events();
  }, []);

  const handleLogout = () => {
    // Clear cookies
    deleteAllCookies();
    navigate('/');
  };

  return (
    <div
      className={`relative flex flex-col min-h-screen p-4 ${isDarkMode ? 'bg-[#3E505B] text-white' : 'bg-[#F5F5F5] text-black'}`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center pl-4 mb-4 mt-8">
          <div id="dashboardTitle" style={{ fontSize: `min(6vh, 60px)` }}>
            Your Events
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md transition duration-300 hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
        <div
          className={`w-full border-t-2 mb-4 opacity-25 ${isDarkMode ? 'border-gray-300' : 'border-gray-500'}`}
        ></div>
        {notification && (
          <div className="fixed bottom-0 left-0 w-full bg-red-500 text-white text-center py-2">
            {notification}
          </div>
        )}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">My Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockUserEvents.map((event) => (
              <div key={event.id} className="p-4 border rounded-lg shadow-md">
                <div className="text-lg font-bold">{event.title}</div>
                <div className="text-sm text-gray-500">{event.code}</div>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleViewBookingLink(event)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    View Booking
                  </button>
                  <button
                    onClick={() => handleCopyLink(event)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Other Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockIndividualEvents.map((event) => (
              <div key={event.id} className="p-4 border rounded-lg shadow-md">
                <div className="text-lg font-bold">{event.title}</div>
                <div className="text-sm text-gray-500">{event.code}</div>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleViewBookingLink(event)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    View Booking
                  </button>
                  <button
                    onClick={() => handleCopyLink(event)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
