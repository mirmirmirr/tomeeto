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
    dataToUse['email'] = cookieObj['login_email'];
    dataToUse['password'] = cookieObj['login_password'];
  } else {
    if (cookieObj['guest_email'] && cookieObj['guest_password']) {
      dataToUse['guest_id'] = parseInt(cookieObj['guest_email']);
      dataToUse['guest_password'] = cookieObj['guest_password'];
    } else {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_HOST + '/create_guest'
        );
        if (response.ok) {
          const responseData = await response.json();
          dataToUse['guest_id'] = parseInt(responseData.guest_id);
          dataToUse['guest_password'] = responseData.guest_password;
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
    const textArea = document.createElement('textarea');
    textArea.value = event.code;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setNotification('Link copied');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);

    // Please uncomment this when the server does have HTTPS certifications
    // try {
    //   navigator.clipboard.writeText(event.code).then(() => {
    //     setNotification('Link copied to clipboard');
    //     setTimeout(() => setNotification(''), 3000);
    //   });
    // } catch (error) {
    //   console.error('Error copying link:', error);
    // }
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
      const codeChange = `code=${encodeURIComponent(JSON.stringify(event.code))}; path=/;`;
      document.cookie = codeChange;
      navigate('/availability', {
        state: { eventName2: event.title, isUpdating: true },
      });
    } catch (error) {
      console.error('Error editing availability:', error);
    }
  };

  const get_all_events = async () => {
    const data = {};

    check_user(data);

    try {
      const response = await fetch(
        import.meta.env.VITE_API_HOST + '/dashboard_events',
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

        id = 1;
        var beta = [];
        for (const [key, value] of Object.entries(participatingEvents)) {
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
      <div
        className={`flex flex-col mt-[4vh] p-4 ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        <div className="flex flex-row w-[85vw] lg:w-[93vw] lg:ml-4 justify-between">
          <div id="dashboardTitle" style={{ fontSize: `max(3vh, 35px)` }}>
            Your Events
          </div>
          <button
            onClick={handleLogout}
            className="hidden lg:block px-4 h-[40px] -mb-2 bg-red-500 text-white rounded-md shadow-md transition duration-300 hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>

        <div
          className={`justify-center lg:ml-4 w-[85vw] lg:w-[93vw] border-t-[1px] ${isDarkMode ? 'border-white' : 'border-gray-500'}`}
        ></div>

        {notification && (
          <div className="fixed bottom-0 left-0 w-full bg-red-500 text-white text-center py-2">
            {notification}
          </div>
        )}

        <div className="mt-[2vh] lg:mt-[4vh] lg:ml-4 w-full lg:w-[93vw]">
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
                    Copy Event Code
                  </button>
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                  >
                    Edit Availability
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-[2vh] lg:mt-[4vh] lg:ml-4 w-full lg:w-[93vw]">
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
                    Copy Event Code
                  </button>
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                  >
                    Edit Availability
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
