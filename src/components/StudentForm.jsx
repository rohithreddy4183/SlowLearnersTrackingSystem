"use client"

import { useState } from "react"
import "../styles/form.css"

function StudentForm({ title }) {
  const [formData, setFormData] = useState({
    department: "Computer Science",
    section: "A",
    criteria: "Attendance",
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to a server
    alert("Form submitted successfully!")
  }

  return (
    <div className="form-container">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="department">Department:</label>
        <select id="department" value={formData.department} onChange={handleChange}>
          <option>Computer Science</option>
          <option>Electrical Engineering</option>
          <option>Mechanical Engineering</option>
        </select>

        <label htmlFor="section">Section:</label>
        <select id="section" value={formData.section} onChange={handleChange}>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>

        <label htmlFor="criteria">Criteria:</label>
        <select id="criteria" value={formData.criteria} onChange={handleChange}>
          <option>Attendance</option>
          <option>Exam Performance</option>
          <option>Assignment Completion</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default StudentForm

