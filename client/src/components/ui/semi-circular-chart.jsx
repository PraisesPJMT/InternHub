import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SemiCircularChart = ({ data, options, className }) => {
  const defaultOptions = {
    responsive: true,
    rotation: -90, // start from top
    circumference: 180, // half circle
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <Pie
      data={data}
      options={{ ...defaultOptions, ...options }}
      className={className}
    />
  );
};

export default SemiCircularChart;
