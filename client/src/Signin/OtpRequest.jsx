import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from './sigin.png'; // Ensure this path is correct

const OtpRequestImage = () => (
  <div className="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
    <img
      src={logo}
      alt="OTP Request"
      className="w-full h-auto object-cover rounded" // Make image responsive
    />
  </div>
);

const OtpRequestForm = () => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('student'); // Default to 'student'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://od-claimer.onrender.com/forgot-password', { email, userType });
      setMessage(response.data.message);
      navigate('/reset-password');
    } catch (error) {
      setMessage('Error sending OTP. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
      <motion.h2
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-4xl tracking-tight text-transparent p-5"
      >
        Request OTP
      </motion.h2>
      {message && <p className="text-red-500">{message}</p>} {/* Display message */}
      <form className="flex flex-col space-y-4" onSubmit={handleRequestOtp}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="eventCoordinator">Event Coordinator</option>
        </select>
        <button
          type="submit"
          className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition duration-200"
        >
          Send OTP
        </button>
      </form>
      <div>
        <a href='/' className="text-purple-500">Back to Sign In</a>
      </div>
    </div>
  );
};

// Main OtpRequest Component
const OtpRequest = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full flex flex-col md:flex-row"> {/* Use flex-col for smaller screens */}
        <OtpRequestImage />
        <OtpRequestForm />
      </div>
    </div>
  );
};

export default OtpRequest;