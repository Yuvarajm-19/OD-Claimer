import { useEffect, useState } from 'react';
import axios from 'axios';

const Odclimed = () => {
    const [bankRecords, setBankRecords] = useState([]); // State for storing bank records
    const [newOdRecords, setNewOdRecords] = useState([]); // State for storing new OD records
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRollNo, setSelectedRollNo] = useState(null); // State for selected roll number

    // Fetch bank records from the bank API
    useEffect(() => {
        const fetchBankRecords = async () => {
            try {
                const response = await axios.get('https://od-claimer.onrender.com/api/bank'); // Bank API endpoint
                setBankRecords(response.data);
            } catch (err) {
                setError('Error fetching bank records', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBankRecords();
    }, []);

    // Fetch new OD records based on the selected roll number
    useEffect(() => {
        const fetchNewOdRecords = async () => {
            if (selectedRollNo) {
                try {
                    const response = await axios.get(`https://od-claimer.onrender.com/api/newodcollections/${selectedRollNo}`); // New OD API endpoint
                    setNewOdRecords(response.data);
                } catch (err) {
                    setError('Error fetching new OD records', err);
                }
            }
        };

        fetchNewOdRecords();
    }, [selectedRollNo]); // Run when selectedRollNo changes

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-blue-500 text-center">NO RECORDS OD WITH THAT STUDENT{error}</div>;
    }

    // Function to handle clicking on a container
    const handleClick = (rollNo) => {
        setSelectedRollNo(rollNo); // Set the selected roll number
        setNewOdRecords([]); // Reset new OD records when changing selection
    };

    return (
        <div className="rounded p-4">
            <h2 className="text-2xl font-bold mb-4">OD Records</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bankRecords.map((record) => (
                    <div
                        key={record._id}
                        className="bg-white p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleClick(record.rollNo)} // Set roll number on click
                    >
                        <h3 className="text-lg font-bold mb-2">Roll No: {record.rollNo}</h3>
                        <p className="text-gray-700">Periods: {record.periods}</p>
                    </div>
                ))}
            </div>

            {/* Display the new OD records */}
            {selectedRollNo && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4">New OD Records for Roll No: {selectedRollNo}</h3>
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 font-bold">Name</th>
                                <th className="py-2 px-4 border-b border-gray-200 font-bold">Periods</th>
                                <th className="py-2 px-4 border-b border-gray-200 font-bold">Event</th>
                                <th className="py-2 px-4 border-b border-gray-200 font-bold">College Name</th>
                                <th className="py-2 px-4 border-b border-gray-200 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newOdRecords.length > 0 ? (
                                newOdRecords.map((record) => (
                                    <tr key={record._id}>
                                        <td className="py-2 px-4 border-b border-gray-200">{record.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{record.periods}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{record.eventName}</td>
                                        <td className="py-2 px-6 border-b border-gray-200">{record.collegeName}</td>
                                        <td className={`py-2 px-4 border-b border-gray-200`}>
                                            {record.status}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                // Display empty table message
                                <tr>
                                    <td colSpan="5" className="py-2 px-4 border-b border-gray-200 text-center text-gray-500">
                                        No records available for this roll number.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Odclimed;
