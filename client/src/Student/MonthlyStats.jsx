import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyStats = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rollNumber = JSON.parse(localStorage.getItem('studentData'))?.rollNumber.toLowerCase();
        if (!rollNumber) {
          console.error('No roll number found in localStorage');
          return;
        }

        const response = await axios.get('https://od-claimer.onrender.com/api/od-responses');
        const filteredResponses = response.data
          .filter(response => response.rollNo === rollNumber)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setMonthlyData(filteredResponses);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const chartData = {
    labels: monthlyData.map(record => formatDate(record.date)),
    datasets: [{
      label: 'Period Range',
      data: monthlyData.map(record => ({
        x: formatDate(record.date),
        y: record.endPeriod - record.startPeriod + 1,
        startPeriod: record.startPeriod,
        endPeriod: record.endPeriod,
        status: record.status,
        eventName: record.eventName
      })),
      backgroundColor: monthlyData.map(record =>
        record.status === 'Accepted' ? 'rgba(75, 192, 192, 0.7)' :
        record.status === 'Declined' ? 'rgba(255, 99, 132, 0.7)' :
        'rgba(255, 206, 86, 0.7)'
      ),
      borderColor: monthlyData.map(record =>
        record.status === 'Accepted' ? 'rgba(75, 192, 192, 1)' :
        record.status === 'Declined' ? 'rgba(255, 99, 132, 1)' :
        'rgba(255, 206, 86, 1)'
      ),
      borderWidth: 1,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'OD Period Distribution',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const record = monthlyData[index];
            return formatDate(record.date);
          },
          label: (tooltipItem) => {
            const record = monthlyData[tooltipItem.dataIndex];
            return [
              `Event: ${record.eventName}`,
              `Periods: ${record.startPeriod} to ${record.endPeriod}`,
              `Status: ${record.status}`
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        min: 0,
        max: 8,
        title: {
          display: true,
          text: 'Number of Periods',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          stepSize: 1
        }
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setSelectedRecord(monthlyData[index]);
      }
    },
  };

  return (
    <div className='py-4 min-h-screen w-full bg-white bg-fixed [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]'>
      <Navbar />
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            OD Records
          </h2>

          {monthlyData.length > 0 ? (
            <>
              <div className="h-[400px] mb-8">
                <Bar data={chartData} options={options} />
              </div>

              {selectedRecord && (
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    OD Details for {formatDate(selectedRecord.date)}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-md ${
                      selectedRecord.status === 'Accepted' ? 'bg-green-50' :
                      selectedRecord.status === 'Declined' ? 'bg-red-50' :
                      'bg-yellow-50'
                    }`}>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="text-lg font-semibold">{selectedRecord.name}</p>
                      <p className="text-sm font-medium text-gray-600 mt-2">Status</p>
                      <p className={`text-lg font-semibold ${
                        selectedRecord.status === 'Accepted' ? 'text-green-600' :
                        selectedRecord.status === 'Declined' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {selectedRecord.status}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-600">Period Range</p>
                      <p className="text-lg font-semibold text-blue-600">
                        Period {selectedRecord.startPeriod} to {selectedRecord.endPeriod}
                      </p>
                      <p className="text-sm font-medium text-gray-600 mt-2">Total Periods</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {selectedRecord.endPeriod - selectedRecord.startPeriod + 1} Periods
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-600">Event</p>
                      <p className="text-lg font-semibold text-purple-600">{selectedRecord.eventName}</p>
                      <p className="text-sm font-medium text-gray-600 mt-2">College</p>
                      <p className="text-lg font-semibold text-purple-600">{selectedRecord.collegeName}</p>
                    </div>
                  </div>
                </div>
              )}

              
            </>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No OD records found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyStats;