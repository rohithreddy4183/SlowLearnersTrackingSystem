import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import StatisticsCard from "../components/StatisticsCard";
import "../styles/department.css";

const DepartmentStatistics = () => {
  const { department } = useParams();
  const [statistics, setStatistics] = useState(null);
  const formattedDept = department.replace("-", " ");

  useEffect(() => {
    fetch(`http://localhost:5000/statistics/${department}`)
      .then((res) => res.json())
      .then((data) => setStatistics(data))
      .catch((err) => console.error("Error fetching statistics:", err));
  }, [department]);

  return (
    <div className="department-container">
      <h1>{formattedDept} Department Statistics</h1>

      {statistics ? (
        <div className="stats-grid">
          <StatisticsCard title="Total Students" value={statistics.totalStudents} />
          <StatisticsCard title="Slow Learners" value={statistics.slowLearners} />
          <StatisticsCard title="Average CGPA" value={statistics.avgCGPA.toFixed(2)} />
        </div>
      ) : (
        <p>Loading statistics...</p>
      )}
    </div>
  );
};

export default DepartmentStatistics;
