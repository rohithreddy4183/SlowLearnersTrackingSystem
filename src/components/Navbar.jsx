"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import logo from "../assets/logo.jpg"
import "../styles/navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Update the handleDepartmentClick function to handle the click event properly
  const handleDepartmentClick = (dept) => {
    setDeptDropdownOpen(false)
    navigate(`/department/${dept.toLowerCase().replace(/\s+/g, "-")}`)
  }

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/">
          <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />
        </Link>
        <span className="site-name">Slow Learners Tracking System</span>
      </div>

      <div className="nav-buttons">
        {/* Year Dropdown */}
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => setYearDropdownOpen(!yearDropdownOpen)}>
            Year
          </button>
          {yearDropdownOpen && (
            <div className="dropdown-content">
              {[1, 2, 3, 4].map((year) => (
                <Link key={year} to={`/year/${year}`} onClick={() => setYearDropdownOpen(false)}>
                  {year}
                  <sup>{["st", "nd", "rd", "th"][year - 1]}</sup> Year
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Department Dropdown */}
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}>
            Department
          </button>
          {deptDropdownOpen && (
            <div className="dropdown-content">
              {[
                "CSE",
                "IT",
                "EEE",
                "MECH",
                "ECE",
              ].map((dept) => (
                <button key={dept} className="dropdown-item" onClick={() => handleDepartmentClick(dept)}>
                  {dept}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Authentication */}
        {user ? (
          <>
            <span className="welcome-text">Welcome, {user.name}</span>
            <Link to={`/${user.role}`} className="nav-button">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-button">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar

