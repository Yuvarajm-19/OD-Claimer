import { useEffect, useState } from 'react';
import axios from 'axios';

const Odresponse = () => {
    const [studentForms, setStudentForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Define the API endpoints as constants
    const API_URL = 'https://od-claimer.onrender.com/api/studentresponsetoteach';
    const ADD_TO_BANK_URL = 'https://od-claimer.onrender.com/api/addToBank';

    useEffect(() => {
        const fetchStudentForms = async () => {
            try {
                const response = await axios.get(API_URL);
                setStudentForms(response.data);
            } catch (err) {
                setError('Error fetching student forms: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentForms();
    }, []);

    const handleSubmit = async (form) => {
        const { rollNo, periods } = form; // Extract roll number and periods

        try {
            await axios.post(ADD_TO_BANK_URL, { rollNo, periods });
            alert(`Submitted: Roll No - ${rollNo}, Periods - ${periods}`); // Show success message
        } catch (error) {
            console.error('Error submitting to bank:', error);
            alert('Error submitting to bank. Please try again.');
        }
    };

    const handleDelete = async (form) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this record?');

        if (confirmDelete) {
            const { name, rollNo, periods, collegeName, eventName, geotagPhoto, attendancePhoto } = form; // Extract fields for deletion

            try {
                await axios.delete('https://od-claimer.onrender.com/api/deleteStudent', {
                    data: { // Send the data as the request body
                        name,
                        rollNo,
                        periods,
                        collegeName,
                        eventName,
                        geotagPhoto,
                        attendancePhoto,
                    },
                });
                setStudentForms((prevForms) => prevForms.filter(item => item._id !== form._id)); // Update the state to remove the deleted form
                alert('Record deleted successfully.'); // Show success message
            } catch (error) {
                console.error('Error deleting record:', error);
                alert('Error deleting record. Please try again.');
            }
        }
    };

    // Render loading state
    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    // Render error state
    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    // Render student forms table
    return (
        <div className="container mx-auto p-4">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
                <thead className="bg-gray-300">
                    <tr>
                        {['Name', 'Roll No', 'Periods', 'College Name', 'Event Name', 'Geotag Photo', 'Attendance Photo', 'Actions'].map((header) => (
                            <th key={header} className="py-2 px-4 border-b border-gray-200 text-left">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {studentForms.map((form) => (
                        <tr key={form._id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b border-gray-200">{form.name}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{form.rollNo}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{form.periods}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{form.collegeName}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{form.eventName}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{form.geotagPhoto ? 'Uploaded' : 'Not Uploaded'}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{form.attendancePhoto ? 'Uploaded' : 'Not Uploaded'}</td>
                            <td className="py-2 px-4 border-b border-gray-200 flex space-x-2">
                                <button
                                    onClick={() => handleSubmit(form)}
                                    className="bg-purple-200 text-white px-4 py-2 rounded hover:bg-purple-500"
                                >
                                    Submit
                                </button>
                                <button
                                    onClick={() => handleDelete(form)}
                                    className="bg-red-200 text-white px-4 py-2 rounded hover:bg-red-500"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Odresponse;
