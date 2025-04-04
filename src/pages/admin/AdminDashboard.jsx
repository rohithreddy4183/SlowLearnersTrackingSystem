"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import FileUpload from "../../components/FileUpload";
import "../../styles/admin.css";

const AdminDashboard = () => {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showDBData, setShowDBData] = useState(false);
  const [dbRecords, setDBRecords] = useState([]);

  const handleUpload = async (file) => {
    if (!file) return; // Prevent sending a request with no file

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("📡 Upload Response:", result);

      if (response.ok && result.success) {
        setUploadStatus({
          type: "success",
          message: `✅ Successfully uploaded ${result.count} records.`,
        });
      } else if (result.message) {
        setUploadStatus({ type: "error", message: `⚠ ${result.message}` });
      }
    } catch (error) {
      setUploadStatus({ type: "error", message: "❌ Upload failed, please try again." });
    }
  };

  const fetchDatabase = async () => {
    try {
      const response = await fetch("http://localhost:5000/fetch-students");
      const data = await response.json();
      setDBRecords(data);
      setShowDBData(true);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Navbar />

      <div className="admin-content">
        <h1>Admin Dashboard</h1>
        <p>Upload student data from Excel to store it in the database.</p>

        <FileUpload onUpload={handleUpload} />

        {uploadStatus && uploadStatus.message && (
          <div className={`upload-status ${uploadStatus.type}`}>{uploadStatus.message}</div>
        )}

        <button className="view-db-btn" onClick={fetchDatabase}>
          View Student Data
        </button>

        {showDBData && dbRecords.length > 0 && (
          <div className="db-data">
            <h2>Student Data from Database</h2>
            <table>
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {dbRecords.map((student, index) => (
                  <tr key={index}>
                    <td>{student.regNo}</td>
                    <td>{student.name}</td>
                    <td>{student.department}</td>
                    <td>{student.year}</td>
                    <td>{student.marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
