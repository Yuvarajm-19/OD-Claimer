import { useState } from 'react';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import Navbar from './Navbar';

const Odresponse = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading state

    // Create FormData to handle text and file uploads
    const formData = new FormData(e.target); // Automatically get form data from the event target

    try {
      const response = await fetch('https://od-claimer.onrender.com/submit-od-form', {
        method: 'POST',
        body: formData, // Send formData including files
      });

      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
        setIsSubmitted(true);
        setErrorMessage(''); // Clear any previous error message
      } else {
        // Check if result.error is an object and extract message
        const errorMsg = typeof result.error === 'object' ? result.error.message : result.error;
        setErrorMessage(errorMsg || 'Something went wrong.'); // Set error message
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Network error. Please try again later.'); // Handle network errors
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  const closeModal = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen w-full h-full bg-fixed [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)] py-12 px-4">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-8 text-gray-800">Student Response Form</h1>
          <hr className="border-black w-16 mb-6" />

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Roll Number Input */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Roll Number</label>
              <input
                type="text"
                name="rollNo"
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md"
                placeholder="Enter your Roll Number"
                required
              />
            </div>

            {/* Name Input */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Name</label>
              <input
                type="text"
                name="name"
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md"
                placeholder="Enter your Name"
                required
              />
            </div>

            {/* Date Input */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Date</label>
              <input
                type="date"
                name="date"
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md"
                required
              />
            </div>

            {/* No of Periods Input */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">No of Periods</label>
              <input
                type="number"
                name="periods"
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md"
                placeholder="Enter No of Periods"
                required
              />
            </div>

            {/* Event Name Input */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Event Name</label>
              <input
                type="text"
                name="eventName"
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md"
                placeholder="Enter Event Name"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">College Name</label>
              <input
                type="text"
                name="collegeName"
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md"
                placeholder="Enter College Name"
                required
              />
            </div>

            {/* Geotag Photo Input */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Geotag Photo</label>
              <input
                type="file"
                name="geotagPhoto"
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md"
                required
              />
            </div>

            {/* Attendance Sheet Photo Input */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Attendance Sheet</label>
              <input
                type="file"
                name="attendancePhoto"
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className={`bg-gray-800 text-white px-6 py-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-600 text-center mt-4">
                {errorMessage}
              </div>
            )}
          </form>

          {/* Success Modal */}
          {isSubmitted && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-4">Form Submitted Successfully!</h2>
                <div className="flex justify-center mb-4">
                  <IoIosCheckmarkCircleOutline size={80} className="text-pink-500" />
                </div>
                <button
                  onClick={closeModal}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Odresponse;