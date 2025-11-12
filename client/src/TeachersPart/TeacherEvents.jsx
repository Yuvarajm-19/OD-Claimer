import { useEffect, useState } from 'react';
import Navbar from './Navbar';

const TeacherEvents = () => {
  const [events, setEvents] = useState({
    insideCollege: [],
    outsideCollege: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://od-claimer.onrender.com/api/eventsposted');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Get the current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Filter events for the current month and year
        const currentMonthEvents = data.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
        });

        // Separate the events based on eventType
        const insideCollegeEvents = currentMonthEvents.filter(event => event.eventType === 'insideCollege');
        const outsideCollegeEvents = currentMonthEvents.filter(event => event.eventType === 'outsideCollege');

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

  // Function to determine background color based on the event date
  const getEventClassName = (eventDate) => {
    const today = new Date();
    const eventDay = new Date(eventDate);

    if (eventDay < today) {
      return 'bg-red-300'; // Past events - red
    } else if (eventDay.toDateString() === today.toDateString() || eventDay.toDateString() === new Date(today.setDate(today.getDate() + 1)).toDateString()) {
      return 'bg-yellow-300'; // Today or tomorrow - yellow
    } else {
      return 'bg-green-300'; // Future events - green
    }
  };

  return (
    <div className='rounded p-4'>
      <Navbar />
      <div className="py-4 min-h-screen w-full bg-white bg-fixed [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
        <div className="flex flex-col items-center justify-center py-4 space-y-8 max-w-7xl mx-auto px-4">

          {/* Loading and Error State */}
          {loading ? (
            <p>Loading events...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {/* Inside College Events */}
              <div className="bg-gray-200 shadow-lg rounded-lg p-8 w-full max-w-4xl">
                <h2 className="text-xl font-bold mb-4">Inside College Events</h2>
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                  {events.insideCollege.length > 0 ? (
                    events.insideCollege.map(event => (
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
                    <p>No Inside College Events available this month.</p>
                  )}
                </div>
              </div>

              {/* Outside College Events */}
              <div className="bg-gray-200 shadow-lg rounded-lg p-8 w-full max-w-4xl mt-4">
                <h2 className="text-xl font-bold mb-4">Outside College Events</h2>
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                  {events.outsideCollege.length > 0 ? (
                    events.outsideCollege.map(event => (
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
                    <p>No Outside College Events available this month.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Modal for Event Details */}
          {showModal && selectedEvent && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg relative">
                <h2 className="text-2xl font-bold mb-4">{selectedEvent.eventName}</h2>
                <p><strong>Description:</strong> {selectedEvent.description}</p>
                <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
                <p><strong>Registration Link:</strong> <a href={selectedEvent.registrationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">{selectedEvent.registrationLink}</a></p>
                <p><strong>Image:</strong> {selectedEvent.image && (
                  <img src={`./backend/eventuploads/${selectedEvent.image}`} alt={selectedEvent.eventName} className="w-full h-auto mt-2" />
                )}
                </p>
                <button
                  className="absolute top-2 right-2 text-red-500"
                  onClick={closeModal}
                >
                  &times; {/* Close button */}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherEvents;
