import Navbar from './Navbar';
import { useEffect, useState } from 'react';

const Profile = () => {
  const [teacherData] = useState(JSON.parse(localStorage.getItem('teacherData')));

  useEffect(() => {
    // Store the data in localStorage if it's available
    if (teacherData) {
      localStorage.setItem('teacherData', JSON.stringify(teacherData));
    }
  }, [teacherData]);

  return (
    <div className="rounded p-4">
      <Navbar />
      <div className="py-4 min-h-screen w-full bg-white bg-fixed [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
        {teacherData ? (
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 shadow-lg rounded-lg p-12 w-full max-w-4xl text-left">
              <ul className="text-gray-900 text-lg space-y-2 leading-relaxed">
                <li><span className="font-bold">Name:</span> {teacherData.name}</li>
                <li><span className="font-bold">Email:</span> {teacherData.email}</li>
                <li><span className="font-bold">Class:</span> {teacherData.class}</li>
                <li><span className="font-bold">Department:</span> {teacherData.department}</li>
                <li>
                  <span className="font-bold">Date of Birth:</span> {teacherData.dob ? new Date(teacherData.dob).toLocaleDateString() : "N/A"}
                </li>
                <li><span className="font-bold">College:</span> {teacherData.college}</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700">No teacher data available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
