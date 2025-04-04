import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import YearPage from "./pages/YearPage"
import DepartmentPage from "./pages/DepartmentPage"
import AdminDashboard from "./pages/admin/AdminDashboard"
import FacultyDashboard from "./pages/faculty/FacultyDashboard"
import StudentDashboard from "./pages/student/StudentDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"
import { DataProvider } from "./context/DataContext"

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/year/:yearId" element={<YearPage />} />
          <Route path="/department/:department" element={<DepartmentPage />} />

          {/* Protected Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty/*"
            element={
              <ProtectedRoute allowedRole="faculty">
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </DataProvider>
    </AuthProvider>
  )
}

export default App

