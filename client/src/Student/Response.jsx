import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Response = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://od-claimer.onrender.com/api/od-responses');
        if (!response.ok) {
          throw new Error('Failed to fetch responses');
        }
        const data = await response.json();

        // Initialize additional properties for each response
        const initializedData = data.map(item => ({
          ...item,
          uploadCount: 0,
          uploadDate: null,
        }));

        setResponses(initializedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching responses:', error);
        setError('Failed to load responses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  const handleFileUpload = (index) => {
    setResponses(prevResponses => {
      const updatedResponses = [...prevResponses];
      const response = updatedResponses[index];

      if (response.uploadCount < 3) {
        response.uploadCount += 1;
        if (response.uploadCount === 1) {
          response.uploadDate = new Date().toISOString();
        }
      }

      const currentDate = new Date();
      const uploadDate = response.uploadDate ? new Date(response.uploadDate) : null;
      const daysSinceUpload = uploadDate ? Math.floor((currentDate - uploadDate) / (1000 * 60 * 60 * 24)) : 0;

      if (response.uploadCount >= 3 || daysSinceUpload >= 3) {
        updatedResponses.splice(index, 1);
      }

      localStorage.setItem('responses', JSON.stringify(updatedResponses));
      return updatedResponses;
    });

    navigate('/student/od-response');
  };

  // Get student roll number from localStorage
  const storedStudentData = localStorage.getItem('studentData');
  const rollNumber = storedStudentData ? JSON.parse(storedStudentData).rollNumber : null;

  // Filter responses based on roll number
  const filteredResponses = responses.filter(response =>
    response.rollNo.toLowerCase() === (rollNumber ? rollNumber.toLowerCase() : ''));

  // Format date to local string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-fixed [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-fixed [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 min-h-screen w-full bg-fixed [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
      <Navbar />
      <div className="flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl mx-4">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">OD Response</h1>
          <hr className="border-gray-600 w-16 mb-8 mx-auto" />
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">Register Number</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">Name</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">Date</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">Period</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">Event Name</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">College</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">Status</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResponses.length > 0 ? (
                  filteredResponses.map((response, index) => {
                    const currentDate = new Date();
                    const uploadDate = response.uploadDate ? new Date(response.uploadDate) : null;
                    const daysSinceUpload = uploadDate ? Math.floor((currentDate - uploadDate) / (1000 * 60 * 60 * 24)) : 0;
                    const remainingDays = uploadDate ? Math.max(0, 3 - daysSinceUpload) : 3;

                    return (
                      <tr key={index} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                        <td className="py-3 px-4">{response.rollNo}</td>
                        <td className="py-3 px-4">{response.name}</td>
                        <td className="py-3 px-4">{formatDate(response.date)}</td>
                        <td className="py-3 px-4">{response.startPeriod} - {response.endPeriod}</td>
                        <td className="py-3 px-4">{response.eventName}</td>
                        <td className="py-3 px-4">{response.collegeName}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            response.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                            response.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {response.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {response.status === 'Accepted' && (
                            <div>
                              <div className="text-sm text-gray-600 mb-1">
                                Days Remaining: {remainingDays} | Attempts: {response.uploadCount}/3
                              </div>
                              <button
                                className={`px-4 py-1 rounded transition ${
                                  response.uploadCount >= 3
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-purple-500 hover:bg-purple-400 text-white'
                                }`}
                                onClick={() => handleFileUpload(index)}
                                disabled={response.uploadCount >= 3}
                              >
                                Upload
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="py-3 px-4 text-center text-gray-500">
                      No responses found for your register number.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Response;