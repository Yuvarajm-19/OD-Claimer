import  { useState } from 'react';
import Navbar from './Navbar';
import OdApplied from './OdApplied';
import Odresponse from './Odresponse';
import Odclimed from './Odclimed';

const Od = () => {
  // State to track which component to display
  const [activeComponent, setActiveComponent] = useState('OdApplied'); // initially empty

  // Function to handle which component to show
  const handleClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div className="rounded p-4">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <nav className=  "text-black rounded-lg p-4 font-bold">
          <ul className="flex flex-col sm:flex-row justify-around gap-4">
            <li
              className={`cursor-pointer ${activeComponent === 'OdApplied' ? 'text-purple-500 border-b-4 border-black font-bold' : ''}`}
              onClick={() => handleClick('OdApplied')}
            >
              Applied ODs
            </li>
            <li
              className={`cursor-pointer ${activeComponent === 'Odresponse' ? ' text-purple-500 border-b-4 border-black font-bold' : ''}`}
              onClick={() => handleClick('Odresponse')}
            >
              OD Responses
            </li>
            <li
              className={`cursor-pointer ${activeComponent === 'Odclimed' ? 'text-purple-500 border-b-4 border-black font-bold' : ''}`}
              onClick={() => handleClick('Odclimed')}
            >
              Claimed ODs
            </li>
          </ul>
        </nav>

        {/* Render the selected component below the navbar */}
        <div className="mt-6">
          {activeComponent === 'OdApplied' && <OdApplied />}
          {activeComponent === 'Odresponse' && <Odresponse />}
          {activeComponent === 'Odclimed' && <Odclimed />}
        </div>
      </div>
    </div>
  );
};

export default Od;
