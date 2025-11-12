
import { Line } from 'react-chartjs-2';
import Navbar from './Navbar';     
const Stats = () => {
    const data = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Approved',
            data: [15, 25, 20, 30],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4, // Curved lines
          },
          {
            label: 'Declined',
            data: [10, 5, 15, 10],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Pending',
            data: [5, 10, 7, 12],
            borderColor: 'rgb(255, 206, 86)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      };
    
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly OD Stats',
          },
        },
      };
  return (
    
      
    <div className="rounded p-4">
    <Navbar />
    <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Monthly OD Stats</h2>
        <div className="flex justify-center mt-6">
          <div className="w-full max-w-4xl">
            <Line data={data} options={options} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Stats
