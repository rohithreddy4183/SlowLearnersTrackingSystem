import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import "../styles/chart.css"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const Chart = ({ type, data, options, title }) => {
  const renderChart = () => {
    switch (type) {
      case "bar":
        return <Bar data={data} options={options} />
      case "pie":
        return <Pie data={data} options={options} />
      default:
        return <Bar data={data} options={options} />
    }
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-wrapper">{renderChart()}</div>
    </div>
  )
}

export default Chart

