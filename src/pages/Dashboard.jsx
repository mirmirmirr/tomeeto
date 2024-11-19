import { useTheme } from '../resources/ThemeContext';
import Header from '../resources/Header';

const mockIndividualEvents = [
  { id: 1, title: 'Meeting with Bob', date: '2023-10-01', time: '10:00 AM' },
  { id: 2, title: 'Project Kickoff', date: '2023-10-02', time: '02:00 PM' },
];

const mockUserEvents = [
  { id: 3, title: 'Lunch with Sarah', date: '2023-10-03', time: '12:00 PM' },
  { id: 4, title: 'Client Presentation', date: '2023-10-04', time: '03:00 PM' },
];

export default function Dashboard() {
  const { isDarkMode, toggleTheme } = useTheme();

  const formatDate = (dateString) => {
    const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCopyLink = (event) => {
    const bookingLink = `https://booking.example.com/event/${event.id}`;
    navigator.clipboard.writeText(bookingLink).then(() => {
      alert('Link copied to clipboard');
    });
  };

  const handleViewBookingLink = (event) => {
    const bookingLink = `https://booking.example.com/event/${event.id}`;
    window.open(bookingLink, '_blank');
  };

  const handleEditEvent = (event) => {
    alert(`Edit event: ${event.title}`);
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
          style={{ fontSize: `min(3vw, 60px)` }}
        >
          Your Events
        </div>
        <div
          className={`w-full border-t-2 mb-4 opacity-25 ${isDarkMode ? 'border-gray-300' : 'border-gray-500'}`}
        ></div>

        <div className="mt-4 pl-4">
          <h2 className="text-2xl font-bold mb-4">All Events</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockIndividualEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-md shadow-md border ${isDarkMode ? 'bg-[#4E5D6C] border-gray-600' : 'bg-white border-gray-300'}`}
              >
                <div className="text-lg font-bold">{event.title}</div>
                <div className="text-sm">
                  {formatDate(event.date)} at {event.time}
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleCopyLink(event)}
                    className="px-2 py-1 bg-green-500 text-white rounded-md"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleViewBookingLink(event)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                  >
                    View Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="mt-4 pl-4">
          <h2 className="text-2xl font-bold mb-4">Events Created by You</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockUserEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-md shadow-md border ${isDarkMode ? 'bg-[#4E5D6C] border-gray-600' : 'bg-white border-gray-300'}`}
              >
                <div className="text-lg font-bold">{event.title}</div>
                <div className="text-sm">
                  {formatDate(event.date)} at {event.time}
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleCopyLink(event)}
                    className="px-2 py-1 bg-green-500 text-white rounded-md"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleViewBookingLink(event)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                  >
                    View Booking
                  </button>
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded-md"
                  >
                    Edit
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
