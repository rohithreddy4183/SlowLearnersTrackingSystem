"use client"

import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import { useAuth } from "../../context/AuthContext"
import { useData } from "../../context/DataContext"
import Chart from "../../components/Chart"
import "../../styles/student.css"

const StudentDashboard = () => {
  const { user } = useAuth()
  const { checkStudentStatus } = useData()
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (user && user.regNo) {
      const studentStatus = checkStudentStatus(user.regNo)
      setStatus(studentStatus)
    }
  }, [user, checkStudentStatus])

  if (!status) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading your data...</div>
      </div>
    )
  }

  if (!status.found) {
    return (
      <div>
        <Navbar />
        <div className="student-not-found">
          <h2>Student Record Not Found</h2>
          <p>Your registration number was not found in our database.</p>
        </div>
      </div>
    )
  }

  // 📌 Get slow learner subjects
  const slowLearnerSubjects = status.subjects.filter((s) => s.isSlowLearner)

  // 📊 Prepare chart data
  const chartData = {
    labels: status.subjects.map((s) => s.name),
    datasets: [
      {
        label: "Your Marks",
        data: status.subjects.map((s) => s.marks),
        backgroundColor: status.subjects.map((s) =>
          s.isSlowLearner ? "rgba(255, 99, 132, 0.5)" : "rgba(54, 162, 235, 0.5)"
        ),
        borderColor: status.subjects.map((s) =>
          s.isSlowLearner ? "rgba(255, 99, 132, 1)" : "rgba(54, 162, 235, 1)"
        ),
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
  }

  return (
    <div className="student-dashboard">
      <Navbar />

      <div className="student-content">
        <h1>Student Dashboard</h1>
        <p className="student-welcome">Welcome, {user.name}</p>

        {/* 📌 Status Summary */}
        <div className="status-summary">
          <div className="status-card">
            <h3>Your Status</h3>
            {status.slowLearnerIn > 0 ? (
              <>
                <p className="status-slow">
                  You are identified as a slow learner in <strong>{status.slowLearnerIn}</strong> subject(s).
                </p>
                <h4>Subjects:</h4>
                <ul className="slow-subject-list">
                  {slowLearnerSubjects.map((subj, index) => (
                    <li key={index} className="slow-subject-item">
                      {subj.name} - {subj.marks} Marks
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="status-good">You are not identified as a slow learner in any subject.</p>
            )}
          </div>
        </div>

        {/* 📊 Performance Chart */}
        <div className="performance-chart">
          <h2>Your Performance</h2>
          <Chart type="bar" data={chartData} options={chartOptions} title="Subject-wise Performance" />
          <p className="chart-note">
            <span className="good-mark">Blue</span>: Good Performance | <span className="slow-mark">Red</span>: Needs Improvement
          </p>
        </div>

        {/* 📜 Subject Details Table */}
        <div className="subject-details">
          <h2>Subject Details</h2>
          <table className="subject-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Status</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {status.subjects.map((subject, index) => (
                <tr key={index} className={subject.isSlowLearner ? "slow-subject" : ""}>
                  <td>{subject.name}</td>
                  <td>{subject.marks}</td>
                  <td>{subject.isSlowLearner ? "Needs Improvement" : "Good"}</td>
                  <td>
                    {subject.isSlowLearner ? "Schedule additional tutoring sessions" : "Continue with regular studies"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
