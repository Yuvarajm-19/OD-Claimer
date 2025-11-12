import { Routes, Route } from 'react-router-dom';
import Profile from './Profile';        // Import your Profile component
import Stats from './Stats';            // Import your Stats component
import OD from './Od';                  // Import your OD component
import AddUp from './Addup';            // Import your AddUp component
import Navbar from './Navbar';          // Import your Navbar component

const TeacherDashBoard = () => {
  return (
    <div className="rounded p-4">
      <Navbar />
      <Routes>
        <Route path='/teacher/profile' element={<Profile />} />
        <Route path='/teacher/stats/*' element={<Stats />} />
        <Route path='/teacher/od/*' element={<OD />} />
        <Route path='/teacher/addup/*' element={<AddUp />} />
      </Routes>
    </div>
  );
};

export default TeacherDashBoard;
