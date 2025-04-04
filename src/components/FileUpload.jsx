import { useState } from "react";
import "../styles/fileupload.css";

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      onUpload(data.students);
      alert("File uploaded successfully!");
    } catch (error) {
      setError("Error uploading file");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Student Data</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
