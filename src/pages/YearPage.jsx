"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import StatisticsCard from "../components/StatisticsCard"
import Chart from "../components/Chart"
import { FaUserGraduate, FaUserClock } from "react-icons/fa"
import axios from "axios"
import "../styles/yearpage.css"

const YearPage = () => {
  const { yearId } = useParams()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Update the fetchYearStats function to match the server's expected format
    const fetchYearStats = async () => {
      try {
        setLoading(true)
        // Fetch data from backend
        const response = await axios.post("http://localhost:5000/filter-students", {
          year: yearId.toString(), // Ensure yearId is sent as a string
        })

        if (response.data && response.data.students) {
          const students = response.data.students

          // Process data for statistics
          const totalStudents = students.length
          const slowLearners = students.filter((student) => student.marks < 21).length

          // Get unique departments
          const departments = [...new Set(students.map((student) => student.department))]

          // Calculate department-wise statistics
          const deptStats = departments.map((dept) => {
            const deptStudents = students.filter((student) => student.department === dept)
            const deptSlowLearners = deptStudents.filter((student) => student.marks < 21)

            return {
              department: dept,
              total: deptStudents.length,
              slowLearners: deptSlowLearners.length,
              percentage: (deptSlowLearners.length / deptStudents.length) * 100 || 0,
            }
          })

          // Get unique subjects
          const subjects = [...new Set(students.map((student) => student.subject))]

          // Calculate subject-wise statistics
          const subjectStats = subjects.map((subject) => {
            const subjectStudents = students.filter((student) => student.subject === subject)
            const subjectSlowLearners = subjectStudents.filter((student) => student.marks < 21)

            return {
              subject,
              total: subjectStudents.length,
              slowLearners: subjectSlowLearners.length,
              percentage: (subjectSlowLearners.length / subjectStudents.length) * 100 || 0,
            }
          })

          setStats({
            totalStudents,
            slowLearners,
            percentage: (slowLearners / totalStudents) * 100 || 0,
            deptStats,
            subjectStats,
          })
        } else {
          setError("Failed to fetch year statistics")
        }
      } catch (err) {
        console.error("Error fetching year statistics:", err)
        setError("Error connecting to server")
      } finally {
        setLoading(false)
      }
    }

    fetchYearStats()
  }, [yearId])

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading year statistics...</div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || "Failed to load statistics"}</p>
        </div>
      </div>
    )
  }

  // Prepare chart data for departments
  const deptChartData = {
    labels: stats.deptStats.map((d) => d.department),
    datasets: [
      {
        label: "Total Students",
        data: stats.deptStats.map((d) => d.total),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Slow Learners",
        data: stats.deptStats.map((d) => d.slowLearners),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Prepare chart data for subjects
  const subjectChartData = {
    labels: stats.subjectStats.map((s) => s.subject),
    datasets: [
      {
        label: "Total Students",
        data: stats.subjectStats.map((s) => s.total),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Slow Learners",
        data: stats.subjectStats.map((s) => s.slowLearners),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Prepare pie chart data
  const pieChartData = {
    labels: ["Regular Students", "Slow Learners"],
    datasets: [
      {
        data: [stats.totalStudents - stats.slowLearners, stats.slowLearners],
        backgroundColor: ["rgba(54, 162, 235, 0.5)", "rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
  }

  // Get year suffix
  const getYearSuffix = (year) => {
    switch (year) {
      case "1":
        return "st"
      case "2":
        return "nd"
      case "3":
        return "rd"
      default:
        return "th"
    }
  }

  return (
    <div className="year-page">
      <Navbar />

      <div className="year-content">
        <h1 className="year-title">
          {yearId}
          <sup>{getYearSuffix(yearId)}</sup> Year Overview
        </h1>

        <div className="statistics-cards">
          <StatisticsCard title="Total Students" value={stats.totalStudents} icon={<FaUserGraduate />} color="blue" />
          <StatisticsCard title="Slow Learners" value={stats.slowLearners} icon={<FaUserClock />} color="red" />
          <StatisticsCard title="Percentage" value={`${stats.percentage.toFixed(2)}%`} icon="%" color="orange" />
        </div>

        <div className="charts-container">
          <Chart type="pie" data={pieChartData} options={chartOptions} title="Student Distribution" />
          <Chart type="bar" data={deptChartData} options={chartOptions} title="Department-wise Distribution" />
        </div>

        <div className="subject-chart">
          <Chart type="bar" data={subjectChartData} options={chartOptions} title="Subject-wise Distribution" />
        </div>

        <div className="stats-tables">
          <div className="dept-stats">
            <h2>Department-wise Statistics</h2>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total Students</th>
                  <th>Slow Learners</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {stats.deptStats.map((dept, index) => (
                  <tr key={index}>
                    <td>{dept.department}</td>
                    <td>{dept.total}</td>
                    <td>{dept.slowLearners}</td>
                    <td>{dept.percentage.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="subject-stats">
            <h2>Subject-wise Statistics</h2>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Total Students</th>
                  <th>Slow Learners</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {stats.subjectStats.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.subject}</td>
                    <td>{subject.total}</td>
                    <td>{subject.slowLearners}</td>
                    <td>{subject.percentage.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YearPage

