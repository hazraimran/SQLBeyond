import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

const DifficultyChart = ({ pointsData, idealPoints }) => {
  const difficulties = ["Easy", "Medium", "Hard"]; // Labels for x-axis
  // const idealPoints = [10, 50, 100]; // Ideal points based on y=x guideline

  // Prepare individual points for each difficulty
  const userPoints = [];
  difficulties.forEach((difficulty) => {
    const difficultyPoints = pointsData[difficulty.toLowerCase()] || [];
    difficultyPoints.forEach((point) => {
      userPoints.push({ x: difficulty, y: point }); // x corresponds to difficulty label
    });
  });

  // const data = {
  //   labels: difficulties, // x-axis labels
  //   datasets: [
  //     {
  //       label: "Ideal Points (y = x)",
  //       data: idealPoints.map((y) => ({
  //         x: difficulties[idealPoints.indexOf(y)],
  //         y,
  //       })), // x, y format for line
  //       borderColor: "red",
  //       borderWidth: 2,
  //       fill: false,
  //       showLine: true, // Show diagonal line
  //       pointBackgroundColor: "red",
  //     },
  //     {
  //       label: "User Points",
  //       data: userPoints, // Use individual points
  //       backgroundColor: "blue",
  //       borderColor: "blue",
  //       borderWidth: 0,
  //       showLine: false, // Disable line for user points
  //       pointStyle: "circle",
  //       pointRadius: 5, // Distinct radius for individual points
  //     },
  //   ],
  // };

  const data = {
    labels: difficulties, // x-axis labels
    datasets: [
      {
        label: "Ideal Points",
        data: idealPoints, // Use the passed dynamic ideal points
        borderColor: "red",
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: "red",
        showLine: true,
      },
      {
        label: "User Points",
        data: userPoints, // Actual user performance points
        backgroundColor: "rgba(0, 0, 255, 0.6)", // Add transparency (alpha = 0.6)
        borderColor: "rgba(0, 0, 255, 0.6)", // Border matches background with alpha
        borderWidth: 0,
        showLine: false,
        pointStyle: "circle",
        pointRadius: 6, // Slightly larger points
        pointHoverRadius: 8, // Larger points on hover
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Points",
        },
      },
      x: {
        type: "category", // Use category scale for difficulties
        labels: difficulties, // Difficulty levels on x-axis
        title: {
          display: true,
          text: "Difficulty",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

DifficultyChart.propTypes = {
  pointsData: PropTypes.shape({
    easy: PropTypes.arrayOf(PropTypes.number),
    medium: PropTypes.arrayOf(PropTypes.number),
    hard: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  idealPoints: PropTypes.arrayOf(PropTypes.number).isRequired, // Validate idealPoints
};

export default DifficultyChart;
