"use client";

import { useState } from "react";
import Papa from "papaparse"; // ✅ Import PapaParse
import Navbar from "../../components/Navbar";
import FilterForm from "../../components/FilterForm";
import StudentTable from "../../components/StudentTable";
import { useData } from "../../context/DataContext";
import "../../styles/faculty.css";

const FacultyDashboard = () => {
  const { filterStudents, loading } = useData();
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [criteria, setCriteria] = useState(21);
  const [hasFiltered, setHasFiltered] = useState(false);

  const departments = ["CSE", "ECE", "EEE", "MECH"];
  const years = ["1", "2", "3", "4"];
  const sections = ["A", "B", "C"];
  const subjects = [
    "Data Structures",
    "Database Management",
    "Computer Networks",
    "Operating Systems",
    "Software Engineering",
    "Web Development",
    "Machine Learning",
  ];

  const handleFilter = async (filters) => {
    setHasFiltered(true);
    setCriteria(Number.parseInt(filters.criteria));
    setFilteredStudents([]); // ✅ Clear old data before fetching

    try {
      const students = await filterStudents(filters); // ✅ Fetch only on filter
      setFilteredStudents(students || []);
    } catch (error) {
      console.error("❌ Error filtering students:", error);
      setFilteredStudents([]);
    }
  };

  // ✅ Function to download filtered students as CSV
  const handleDownloadCSV = () => {
    if (filteredStudents.length === 0) return;

    const csvData = Papa.unparse(filteredStudents, {
      quotes: true, // ✅ Ensures values with commas are enclosed in quotes
      delimiter: ",", // ✅ CSV standard delimiter
      header: true, // ✅ Includes column headers
    });

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filtered_students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="faculty-dashboard">
      <Navbar />
      <div className="faculty-content">
        <h1>Faculty Dashboard</h1>
        <p className="faculty-description">
          Filter and identify slow learners based on various criteria.
        </p>

        <div className="dashboard-container">
          <FilterForm
            onFilter={handleFilter}
            departments={departments}
            years={years}
            sections={sections}
            subjects={subjects}
          />

          <div className="results-container">
            {loading ? (
              <p>Loading...</p>
            ) : hasFiltered ? (
              <>
                <h2>Filtered Results</h2>
                <p className="filter-criteria">
                  Showing students with marks below {criteria}
                </p>
                {filteredStudents.length > 0 ? (
                  <>
                    <StudentTable students={filteredStudents} criteria={criteria} />
                    {/* ✅ Download CSV Button */}
                    <button onClick={handleDownloadCSV} className="download-btn">
                      📥 Download CSV
                    </button>
                  </>
                ) : (
                  <p className="no-data">🚫 No students match the criteria.</p>
                )}
              </>
            ) : (
              <p className="no-data">🔍 Apply filters to see results.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
