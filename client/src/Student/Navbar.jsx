import  { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='rounded p-4'>
      <nav className="bg-purple-300 p-4 rounded">
        <div className="flex justify-between items-center container mx-auto">
          {/* Title */}
          <div className="text-left bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 bg-clip-text text-4xl tracking-tight text-transparent">
            STUDENT SESSION
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {/* Hamburger Icon */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 text-black font-semibold">
            
            <li>
              <Link to="/student/events" className="hover:bg-violet-400 p-2 rounded">
                Events
              </Link>
            </li>
            <li>
              <Link to="/student/stats" className="hover:bg-violet-400 p-2 rounded">
                Monthly Stats
              </Link>
            </li>
            <li>
              <Link to="/student/apply-od" className="hover:bg-violet-400 p-2 rounded">
                OD Apply
              </Link>
            </li>
            <li>
              <Link to="/student/response" className="hover:bg-violet-400 p-2 rounded">
                Response
              </Link>
            </li>
            <li>
              <Link to="/student/dashboard" className="hover:bg-violet-400 p-2 rounded">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <ul className="md:hidden mt-4 space-y-3 text-center text-black font-semibold">
            <li>
              <Link to="/student/dashboard" className="block py-2 hover:bg-violet-400">
                DashBoard
              </Link>
            </li>
            <li>
              <Link to="/student/events" className="block py-2 hover:bg-violet-400">
                Events
              </Link>
            </li>
            <li>
              <Link to="/student/apply-od" className="block py-2 hover:bg-violet-400">
                OD Apply
              </Link>
            </li>
            <li>
              <Link to="/student/response" className="block py-2 hover:bg-violet-400">
                Response
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
};

export default Navbar;