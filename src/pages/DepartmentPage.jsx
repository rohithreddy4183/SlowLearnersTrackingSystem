import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatisticsCard from "../components/StatisticsCard";
import Chart from "../components/Chart";
import { FaUserGraduate, FaUserClock, FaGraduationCap } from "react-icons/fa";
import axios from "axios";
import "../styles/department.css";

const DepartmentPage = () => {
  const { department } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDepartmentName = (dept) =>
    dept
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const departmentName = formatDepartmentName(department);

  useEffect(() => {
    const fetchDepartmentStats = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/filter-students",
          { department: departmentName },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success && response.data.students.length > 0) {
          const students = response.data.students;
          const totalStudents = students.length;
          const slowLearners = students.filter((s) => s.marks < 21).length;
          const percentage = ((slowLearners / totalStudents) * 100).toFixed(2);

          const years = [...new Set(students.map((s) => s.year))];
          const yearStats = years.map((year) => {
            const yearStudents = students.filter((s) => s.year === year);
            const yearSlowLearners = yearStudents.filter((s) => s.marks < 21).length;

            return {
              year,
              total: yearStudents.length,
              slowLearners: yearSlowLearners,
              percentage: ((yearSlowLearners / yearStudents.length) * 100).toFixed(2) || 0,
            };
          });

          const subjects = [...new Set(students.map((s) => s.subject))];
          const subjectStats = subjects.map((subject) => {
            const subjectStudents = students.filter((s) => s.subject === subject);
            const subjectSlowLearners = subjectStudents.filter((s) => s.marks < 21).length;

            return {
              subject,
              total: subjectStudents.length,
              slowLearners: subjectSlowLearners,
              percentage: ((subjectSlowLearners / subjectStudents.length) * 100).toFixed(2) || 0,
            };
          });

          const totalCGPA = students.reduce((sum, s) => sum + (s.cgpa || 0), 0);
          const avgCGPA = (totalCGPA / totalStudents).toFixed(2) || 0;

          setStats({ totalStudents, slowLearners, percentage, avgCGPA, yearStats, subjectStats });
        } else {
          setError("No data found for this department.");
        }
      } catch (err) {
        console.error("Error fetching department statistics:", err);
        setError("Error connecting to server. Please check if the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentStats();
  }, [department]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading department statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="department-page">
      <Navbar />
      <h1 className="department-title">{departmentName} Department Overview</h1>

      <div className="statistics-cards">
        <StatisticsCard title="Total Students" value={stats.totalStudents} icon={<FaUserGraduate />} color="blue" />
        <StatisticsCard title="Slow Learners" value={stats.slowLearners} icon={<FaUserClock />} color="red" />
        <StatisticsCard title="Percentage" value={`${stats.percentage}%`} icon={<span>%</span>} color="orange" />
        <StatisticsCard title="Average CGPA" value={stats.avgCGPA} icon={<FaGraduationCap />} color="green" />
      </div>

      <div className="charts-container">
        <Chart type="pie" data={{
          labels: ["Regular Students", "Slow Learners"],
          datasets: [{
            data: [stats.totalStudents - stats.slowLearners, stats.slowLearners],
            backgroundColor: ["#36A2EB", "#FF6384"],
            borderColor: ["#36A2EB", "#FF6384"],
            borderWidth: 1
          }]
        }} title="Student Distribution" />

        <Chart type="bar" data={{
          labels: stats.yearStats.map((y) => `${y.year} Year`),
          datasets: [
            { label: "Total Students", data: stats.yearStats.map((y) => y.total), backgroundColor: "#36A2EB" },
            { label: "Slow Learners", data: stats.yearStats.map((y) => y.slowLearners), backgroundColor: "#FF6384" }
          ]
        }} title="Year-wise Distribution" />
      </div>

      <div className="stats-tables">
        <h2>Year-wise Statistics</h2>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Total Students</th>
              <th>Slow Learners</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {stats.yearStats.map((year, index) => (
              <tr key={index}>
                <td>{year.year}</td>
                <td>{year.total}</td>
                <td>{year.slowLearners}</td>
                <td>{year.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentPage;
