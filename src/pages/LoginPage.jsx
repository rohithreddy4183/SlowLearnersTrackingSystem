"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import loginLogo from "../assets/loginlog.png"
import "../styles/login.css"

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("student")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    const result = login(username, password)

    if (result.success) {
      // Redirect based on user role
      navigate(`/${result.user.role}`)
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo">
          <img src={loginLogo || "/placeholder.svg"} alt="Logo" />
        </div>

        <h2>LOG IN</h2>

        <div className="login-tabs">
          <button
            className={`tab-button ${activeTab === "student" ? "active" : ""}`}
            onClick={() => setActiveTab("student")}
          >
            Student
          </button>
          <button
            className={`tab-button ${activeTab === "faculty" ? "active" : ""}`}
            onClick={() => setActiveTab("faculty")}
          >
            Faculty
          </button>
          <button
            className={`tab-button ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Username`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

