import { useState } from 'react';
import Navbar from './Navbar';

const EventAddingForm = () => {
  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    date: '',
    duration: '',
    eventName: '',
    eventType: '',
    collegeName: '',
    description: '',
    registrationLink: '',
    image: null, // Base64 string will be stored here
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          image: reader.result, // Store the Base64 string
        }));
      };

      reader.readAsDataURL(file); // Read file as Base64
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://od-claimer.onrender.com/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Convert form data to JSON
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      rollNumber: '',
      name: '',
      date: '',
      duration: '',
      eventName: '',
      eventType: '',
      collegeName: '',
      description: '',
      registrationLink: '',
      image: null,
    });
  };

  return (
    <div className="py-4 min-h-screen w-full bg-violet-400 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-lg" style={{ marginTop: '100px' }}>
          <h1 className="text-2xl font-bold mb-8 text-gray-800">Adding EVENT</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Roll Number */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                onChange={handleChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {/* Date */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Event Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {/* Duration */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {/* Event Name */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Event Name</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {/* Event Type */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Event Type</label>
              <input
                type="text"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                onChange={handleChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {/* Description */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {/* Registration Link */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Registration Link</label>
              <input
                type="url"
                name="registrationLink"
                value={formData.registrationLink}
                onChange={handleChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Image Upload */}
            <div className="flex items-center">
              <label className="w-1/3 font-bold text-gray-700 text-lg">Event Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-2/3 bg-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className={`bg-gray-800 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-700 transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventAddingForm;
