import { useState } from "react";
import API from "../api/api";
import PageHeader from "../components/PageHeader";

function Upload() {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a CSV or XLSX file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await API.post("/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadResult(response.data);

      localStorage.setItem("dataset_file", response.data.saved_as);

      alert("Dataset uploaded successfully");
    } catch (error) {
      alert(error.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Upload Energy Dataset"
        subtitle="Upload CSV or Excel files containing timestamp, building, device and energy usage data."
        />
                <div className="metric-row">
        <div className="metric-box">
            <p>Supported Files</p>
            <h3>CSV / XLSX</h3>
        </div>
        <div className="metric-box">
            <p>Required Columns</p>
            <h3>4</h3>
        </div>
        <div className="metric-box">
            <p>ML Ready</p>
            <h3>Yes</h3>
        </div>
        <div className="metric-box">
            <p>Status</p>
            <h3>{uploadResult ? "Uploaded" : "Pending"}</h3>
        </div>
        </div>

      <div className="card">
        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Dataset"}
          </button>
        </form>
      </div>

      {uploadResult && (
        <div className="card">
          <h3>Upload Result</h3>
          <p><strong>Original File:</strong> {uploadResult.filename}</p>
          <p><strong>Saved File:</strong> {uploadResult.saved_as}</p>
          <p><strong>Rows:</strong> {uploadResult.rows}</p>
          <p><strong>Columns:</strong> {uploadResult.columns.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default Upload;