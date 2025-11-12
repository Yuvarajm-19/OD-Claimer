import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import Navbar from './Navbar';

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [events, setEvents] = useState({
    insideCollege: [],
    outsideCollege: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const onChange = (newDate) => {
    setDate(newDate);
    const dateString = newDate.toDateString();

    if (!markedDates.includes(dateString)) {
      const updatedMarkedDates = [...markedDates, dateString];
      setMarkedDates(updatedMarkedDates);
      localStorage.setItem('markedDates', JSON.stringify(updatedMarkedDates));
    }
  };

  // Fetch events and profile data from backend when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch('https://od-claimer.onrender.com/api/eventcoordinator');

        if (!response1.ok) {
          throw new Error(`HTTP error! status: ${response1.status}`);
        }

        const data1 = await response1.json();
        const eventCoordinatorData = data1.eventcoordinator[0] || {};
        setProfileData(eventCoordinatorData);

        const response = await fetch('https://od-claimer.onrender.com/api/eventsposted');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const insideCollegeEvents = data.filter(event => event.eventType === 'insideCollege');
        const outsideCollegeEvents = data.filter(event => event.eventType === 'outsideCollege');

        setEvents({
          insideCollege: insideCollegeEvents,
          outsideCollege: outsideCollegeEvents,
        });
      } catch (err) {
        setError("Error fetching data. Please try again later.", err);
        setProfileData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const storedDates = JSON.parse(localStorage.getItem('markedDates')) || [];
    setMarkedDates(storedDates);
  }, []);

  const handleAddMore = () => {
    navigate('/eventCoordinator/eventform');
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeDetails = () => {
    setSelectedEvent(null);
  };

  // Function to style the selected and marked dates with a red circle
  const tileClassName = ({ date, view }) => {
    const dateString = date.toDateString();
    if (view === 'month' && markedDates.includes(dateString)) {
      return 'bg-red-300 text-white rounded w-10px';
    }
    return '';
  };

  // Function to get the class based on the event's date
  const getEventClassName = (eventDate) => {
    const today = new Date();
    const eventDateTime = new Date(eventDate).getTime();
    const differenceInDays = (eventDateTime - today.getTime()) / (1000 * 60 * 60 * 24);

    if (differenceInDays < 0) {
      return 'bg-red-400 text-white'; // Past event
    } else if (differenceInDays < 1) {
      return 'bg-yellow-400 text-black'; // Event is tomorrow or today
    } else {
      return 'bg-green-400 text-white'; // Upcoming event
    }
  };

  return (
    <div className="py-4 min-h-screen w-full bg-white bg-fixed [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
      <Navbar />
      <div className="flex flex-col items-center justify-center space-y-8">

        {/* Profile Information */}
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-gray-200 shadow-lg rounded-lg p-12 w-full max-w-4xl text-left">
            <ul className="text-gray-900 text-lg space-y-2 leading-relaxed">
              <li><span className="font-bold">Name:</span> {profileData.name || 'N/A'}</li>
              <li><span className="font-bold">Roll Number:</span> {profileData.rollNo || 'N/A'}</li>
              <li><span className="font-bold">Club Name:</span> {profileData.club || 'N/A'}</li>
              <li><span className="font-bold">Position in the club:</span> {profileData.position || 'N/A'}</li>
              <li><span className="font-bold">College:</span> {profileData.college || 'N/A'}</li>
              <li><span className="font-bold">Email:</span> {profileData.email || 'N/A'}</li>
              <li><span className="font-bold">Phone Number:</span> {profileData.phoneNumber || 'N/A'}</li>
              <li><span className="font-bold">Address:</span> {profileData.address || 'N/A'}</li>
            </ul>
          </div>
        )}

        {/* Monthly Event Schedule */}
        <div className="bg-gray-100 shadow-lg rounded-lg p-8 w-full max-w-4xl text-center">
          <h2 className="text-xl font-bold mb-4">Monthly Event Schedule</h2>
          <Calendar
            onChange={onChange}
            value={date}
            className="mx-auto"
            tileClassName={tileClassName}  // Mark dates with red circle
          />
        </div>

        {/* Event Sections */}
        <div className="bg-gray-200 shadow-lg rounded-lg p-8 w-full max-w-4xl space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Inside College Events</h3>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {events.insideCollege.length > 0 ? (
                events.insideCollege.map((event) => (
                  <div
                    key={event._id}
                    className={`border p-4 rounded-md cursor-pointer hover:bg-gray-300 ${getEventClassName(event.date)}`}
                    onClick={() => handleEventClick(event)}
                  >
                    <h4 className="font-bold">{event.eventName}</h4>
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No Inside College Events available at the moment.</p>
              )}
            </div>
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded transition duration-300"
              onClick={handleAddMore}
            >
              Add event
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Outside College Events</h3>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {events.outsideCollege.length > 0 ? (
                events.outsideCollege.map((event) => (
                  <div
                    key={event._id}
                    className={`border p-4 rounded-md cursor-pointer hover:bg-gray-300 ${getEventClassName(event.date)}`}
                    onClick={() => handleEventClick(event)}
                  >
                    <h4 className="font-bold">{event.eventName}</h4>
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No Outside College Events available at the moment.</p>
              )}
            </div>
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded transition duration-300"
              onClick={handleAddMore}
            >
              Add event
            </button>
          </div>
        </div>
        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg relative">
              <h2 className="text-2xl font-bold mb-4">{selectedEvent.eventName}</h2>
              <p><strong>Description:</strong> {selectedEvent.description}</p>
              <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
              <p><strong>Duration:</strong> {selectedEvent.duration}</p>
              <p><strong>Guests:</strong> {selectedEvent.guests}</p>
              <button
                onClick={closeDetails}
                className="absolute top-0 right-0 mt-2 mr-2 text-2xl font-bold text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
