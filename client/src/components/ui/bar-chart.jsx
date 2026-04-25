import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const BarChart = ({ data, options, className }) => {
  const defaultOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
  };

  return (
    <Bar
      data={data}
      options={{ ...defaultOptions, ...options }}
      className={className}
    />
  );
};

export default BarChart;
