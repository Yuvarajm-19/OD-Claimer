import { useState } from 'react';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import Navbar from './Navbar';

const OdApply = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    date: '',
    startPeriod: '',
    endPeriod: '',
    eventName: '',
    collegeName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://od-claimer.onrender.com/odapply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollNumber: formData.rollNumber,
          name: formData.name,
          date: formData.date,
          startPeriod: parseInt(formData.startPeriod),
          endPeriod: parseInt(formData.endPeriod),
          eventName: formData.eventName,
          collegeName: formData.collegeName
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        console.error('Failed to submit the form:', errorData.error);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const closeModal = () => {
    setIsSubmitted(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="py-4 min-h-screen w-full bg-white bg-fixed [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-8 text-gray-800">Apply OD</h1>
          <hr className="border-black w-16 mb-6" />

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Roll Number */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your Roll Number"
                required
              />
            </div>

            {/* Name */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your Name"
                required
              />
            </div>

            {/* Date */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Periods (Start and End) */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Periods</label>
              <div className="w-2/3 flex space-x-2">
                <input
                  type="number"
                  name="startPeriod"
                  value={formData.startPeriod}
                  onChange={handleInputChange}
                  className="w-1/2 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Start Period"
                  min="1"
                  max="8"
                  required
                />
                <input
                  type="number"
                  name="endPeriod"
                  value={formData.endPeriod}
                  onChange={handleInputChange}
                  className="w-1/2 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="End Period"
                  min="1"
                  max="8"
                  required
                />
              </div>
            </div>

            {/* Event Name */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Event Name</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Event Name"
                required
              />
            </div>

            {/* College Name */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">College Name</label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleInputChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter College Name"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gray-800 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-700 transition duration-300"
              >
                Submit
              </button>
            </div>
          </form>

          {/* Modal */}
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

export default OdApply;