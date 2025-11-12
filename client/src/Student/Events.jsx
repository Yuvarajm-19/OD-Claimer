import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Events = () => {
  const [events, setEvents] = useState({
    insideCollege: [],
    outsideCollege: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://od-claimer.onrender.com/api/eventsposted');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Set the next month and year for filtering
        const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
        const nextMonth = nextMonthDate.getMonth();
        const nextYear = nextMonthDate.getFullYear();

        // Filter events for the current month
        const currentMonthEvents = data.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
        });

        // Filter events for the first 5 days of the next month
        const nextMonthEvents = data.filter(event => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getMonth() === nextMonth &&
            eventDate.getFullYear() === nextYear &&
            eventDate.getDate() <= 5
          );
        });

        // Combine current month events and first 5 days of next month events
        const allRelevantEvents = [...currentMonthEvents, ...nextMonthEvents];

        // Separate the events based on eventType
        const insideCollegeEvents = allRelevantEvents.filter(event => event.eventType === 'insideCollege');
        const outsideCollegeEvents = allRelevantEvents.filter(event => event.eventType === 'outsideCollege');

        setEvents({
          insideCollege: insideCollegeEvents,
          outsideCollege: outsideCollegeEvents,
        });
      } catch (error) {
        setError('Error fetching events: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const navigateToApplyOd = () => {
    navigate('/student/apply-od');
  };

  const filteredInsideCollegeEvents = events.insideCollege.filter(event =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOutsideCollegeEvents = events.outsideCollege.filter(event =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEventClassName = (eventDate) => {
    const today = new Date();
    const eventDay = new Date(eventDate);

    if (eventDay < today) {
      return 'bg-red-300';
    } else if (eventDay.toDateString() === today.toDateString() || eventDay.toDateString() === new Date(today.setDate(today.getDate() + 1)).toDateString()) {
      return 'bg-yellow-300';
    } else {
      return 'bg-green-300';
    }
  };

  return (
    <div className="py-4 min-h-screen w-full bg-white bg-fixed [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-4 space-y-8 max-w-7xl mx-auto px-4">
        <div className="w-full max-w-md mb-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="bg-gray-200 shadow-lg rounded-lg p-8 w-full max-w-4xl">
              <h2 className="text-xl font-bold mb-4">Inside College Events</h2>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                {filteredInsideCollegeEvents.length > 0 ? (
                  filteredInsideCollegeEvents.map(event => (
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
            </div>
            <div className="bg-gray-200 shadow-lg rounded-lg p-8 w-full max-w-4xl mt-4">
              <h2 className="text-xl font-bold mb-4">Outside College Events</h2>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                {filteredOutsideCollegeEvents.length > 0 ? (
                  filteredOutsideCollegeEvents.map(event => (
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
            </div>
          </>
        )}
        {showModal && selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-purple-200 rounded-lg p-6 w-11/12 max-w-lg relative border-8">
              <button
                className="absolute top-2 right-2 text-purple-500 hover:text-red-700 focus:outline-none text-5xl p-2"
                onClick={closeModal}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4">{selectedEvent.eventName}</h2>
              <p><strong>Description:</strong> {selectedEvent.description}</p>
              <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {selectedEvent.location}</p>
              <p><strong>Registration Link:</strong> <a href={selectedEvent.registrationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">{selectedEvent.registrationLink}</a></p>
              {selectedEvent.image && (
                <div className="mb-4">
                  <strong>Image:</strong>
                  <img src={''} alt={selectedEvent.eventName} className="w-full h-auto mt-2 rounded" />
                </div>
              )}
              <button
                className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition duration-200 mt-4"
                onClick={navigateToApplyOd}
              >
                Apply for OD
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
