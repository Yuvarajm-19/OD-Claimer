import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios'; // Import axios for HTTP requests
import logo from './sigin.png'; // Ensure this path is correct

const SigninImage = () => (
  <div className="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
    <img
      src={logo}
      alt="Signin"
      className="w-full h-auto object-cover rounded" // Make image responsive
    />
  </div>
);

const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student'); // Dropdown state for student or teacher
  const [error, setError] = useState(''); // State to store error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the backend for authentication
      const response = await axios.post('https://od-claimer.onrender.com/signin', {
        email,
        password,
        userType, // Include the userType in the request
      });

      if (response.status === 200) {
        const { userType, student, teacherData ,eventCoordinator} = response.data.data; // Get userType, student, and teacher data from response
        console.log(teacherData);
        console.log(student);
        if (userType === 'student') {
          localStorage.setItem('studentData', JSON.stringify(student));
          navigate('/student/events');
        } else if (userType === 'teacher') {
          localStorage.setItem('teacherData', JSON.stringify(teacherData));
          navigate('/teacher/events');
        } else if (userType === 'eventCoordinator') {

          localStorage.setItem('eventCoordinatorData', JSON.stringify(eventCoordinator));
          navigate('eventCoordinator/dashboard');
        }
      }
    } catch (err) {
      // If there's an error, display the error message
      if (err.response) {
        // Request made and server responded
        if (err.response.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(err.response.data.message || 'An unexpected error occurred.');
        }
      } else {
        // Request made but no response received
        setError('Server not responding. Please try again later.');
      }
    }
  };

  return (
    <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
      <motion.h2
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-4xl tracking-tight text-transparent p-5"
      >
        Sign in
      </motion.h2>
      {error && <p className="text-red-500">{error}</p>} {/* Display error */}
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
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
          Sign In
        </button>
      </form>
      <div >
        <a href='/forgot-password' className="text-purple-500">Forgot Password?</a>
      </div>
    </div>
  );
};

// Main Signin Component
const Signin = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full flex flex-col md:flex-row"> {/* Use flex-col for smaller screens */}
        <SigninImage />
        <SigninForm />
      </div>
    </div>
  );
};

export default Signin;