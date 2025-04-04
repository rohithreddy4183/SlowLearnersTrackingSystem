"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const DataContext = createContext()

export const useData = () => useContext(DataContext)

export const DataProvider = ({ children }) => {
  const [studentData, setStudentData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all student data on initial load
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/fetch-students")
        if (response.data) {
          setStudentData(response.data)
        }
      } catch (err) {
        console.error("Error fetching student data:", err)
        setError("Failed to load student data")
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [])

  // Filter students based on criteria
  const filterStudents = async (filters) => {
    try {
      const response = await axios.post("http://localhost:5000/filter-students", filters)
      if (response.data && response.data.students) {
        return response.data.students
      }
      console.warn("No students returned from filter:", response.data)
      return []
    } catch (err) {
      console.error("Error filtering students:", err)
      return []
    }
  }

  // Get statistics for a specific year
  const getYearStatistics = async (year) => {
    try {
      const students = await filterStudents({ year })

      // Process data for statistics
      const totalStudents = students.length
      const slowLearners = students.filter((student) => student.marks < 21).length

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

      return {
        totalStudents,
        slowLearners,
        percentage: (slowLearners / totalStudents) * 100 || 0,
        subjectStats,
      }
    } catch (err) {
      console.error("Error getting year statistics:", err)
      return null
    }
  }

  // Get statistics for a specific department
  const getDepartmentStatistics = async (department) => {
    try {
      const students = await filterStudents({ department })

      // Process data for statistics
      const totalStudents = students.length
      const slowLearners = students.filter((student) => student.marks < 21).length

      // Calculate average CGPA
      const totalCGPA = students.reduce((sum, student) => sum + (student.cgpa || 0), 0)
      const avgCGPA = totalCGPA / totalStudents || 0

      // Get unique years
      const years = [...new Set(students.map((student) => student.year))]

      // Calculate year-wise statistics
      const yearStats = years.map((year) => {
        const yearStudents = students.filter((student) => student.year === year)
        const yearSlowLearners = yearStudents.filter((student) => student.marks < 21)

        return {
          year,
          total: yearStudents.length,
          slowLearners: yearSlowLearners.length,
          percentage: (yearSlowLearners.length / yearStudents.length) * 100 || 0,
        }
      })

      return {
        totalStudents,
        slowLearners,
        percentage: (slowLearners / totalStudents) * 100 || 0,
        avgCGPA,
        yearStats,
      }
    } catch (err) {
      console.error("Error getting department statistics:", err)
      return null
    }
  }

  // Check if a student is a slow learner
  const checkStudentStatus = async (regNo) => {
    try {
      const students = await filterStudents({ regNo })

      if (students.length === 0) {
        return { found: false }
      }

      const slowLearnerSubjects = students.filter((subject) => subject.marks < 21)

      return {
        found: true,
        totalSubjects: students.length,
        slowLearnerIn: slowLearnerSubjects.length,
        subjects: students.map((subject) => ({
          name: subject.subject,
          marks: subject.marks,
          isSlowLearner: subject.marks < 21,
        })),
      }
    } catch (err) {
      console.error("Error checking student status:", err)
      return { found: false, error: "Failed to check student status" }
    }
  }

  // Upload new data (for admin)
  const uploadData = async (formData) => {
    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        // Refresh student data after upload
        const refreshResponse = await axios.get("http://localhost:5000/fetch-students")
        if (refreshResponse.data) {
          setStudentData(refreshResponse.data)
        }

        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message || "Upload failed" }
      }
    } catch (err) {
      console.error("Error uploading data:", err)
      return { success: false, message: "Error connecting to server" }
    }
  }

  const value = {
    studentData,
    loading,
    error,
    filterStudents,
    getYearStatistics,
    getDepartmentStatistics,
    checkStudentStatus,
    uploadData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

