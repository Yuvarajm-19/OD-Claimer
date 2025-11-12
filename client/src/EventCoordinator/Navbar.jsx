import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='rounded p-4'>
      <nav className="bg-purple-300 p-4 rounded flex justify-between items-center">
        <div className="text-left bg-gradient-to-r from-pink-400 via-slate-500 to-purple-500 bg-clip-text text-4xl tracking-tight text-transparent">
          Event Coordinator Session
        </div>
        <ul className="hidden md:flex space-x-8 text-black font-semibold">
          <li>
            <Link to="/eventCoordinator/dashboard" className="hover:bg-violet-400 p-2 rounded">
              DashBoard
            </Link>
          </li>
          <li>
            <Link to="/eventCoordinator/eventform" className="hover:bg-violet-400 p-2 rounded">
             Event Adding Form
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
