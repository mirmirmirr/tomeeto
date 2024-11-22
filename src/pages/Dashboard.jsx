import { useState } from 'react';
import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';
import { useNavigate } from 'react-router-dom';

const mockIndividualEvents = [
  { id: 1, title: 'Meeting with Bob', code: 'EVT001' },
  { id: 2, title: 'Project Kickoff', code: 'EVT002' },
];

const mockUserEvents = [
  { id: 3, title: 'Lunch with Sarah', code: 'EVT003' },
  { id: 4, title: 'Client Presentation', code: 'EVT004' },
];

export default function Dashboard() {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notification, setNotification] = useState('');

  const handleCopyLink = async (event) => {
    try {
      const response = await fetch(
        `http://tomeeto.cs.rpi.edu:8000/events/${event.id}/link`
      );
      const data = await response.json();
      navigator.clipboard.writeText(data.link).then(() => {
        setNotification('Link copied to clipboard');
        setTimeout(() => setNotification(''), 3000);
      });
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleViewBookingLink = async (event) => {
    try {
      const response = await fetch(
        `http://tomeeto.cs.rpi.edu:8000/events/${event.id}/redirect`
      );
      const data = await response.json();
      navigate(data.redirectUrl);
    } catch (error) {
      console.error('Error viewing booking link:', error);
    }
  };

  const handleEditEvent = async (event) => {
    try {
      const response = await fetch(
        `http://tomeeto.cs.rpi.edu:8000/events/${event.id}/edit`
      );
      const data = await response.json();
      navigate(data.editUrl);
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  return (
    <div
      className={`relative flex flex-col min-h-screen p-4 ${isDarkMode ? 'bg-[#3E505B] text-white' : 'bg-[#F5F5F5] text-black'}`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="container mx-auto p-4">
        <div
          id="dashboardTitle"
          className="pl-4 mb-4 mt-8"
          style={{ fontSize: `min(6vh, 60px)` }}
        >
          Your Events
        </div>
        <div
          className={`w-full border-t-2 mb-4 opacity-25 ${isDarkMode ? 'border-gray-300' : 'border-gray-500'}`}
        ></div>
        {notification && (
          <div className="fixed bottom-0 left-0 w-full bg-red-500 text-white text-center py-2">
            {notification}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...mockIndividualEvents, ...mockUserEvents].map((event) => (
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
    </div>
  );
}
