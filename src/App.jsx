import { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Preview from "./components/Preview";
import Details from "./components/Details";
import Map from "./components/Map";
import { kml } from "@mapbox/togeojson";
import "./App.css";

function App() {
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const validateFileType = (file) => {
    if (!file) return false;
    return file.name.toLowerCase().endsWith(".kml");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (validateFileType(file)) {
        setFileName(file.name);
        readKmlFile(file);
      } else {
        alert("Please upload a KML file only.");
        e.target.value = "";
        setFileName("");
        setGeoJsonData(null);
        setShowPreview(false);
      }
    } else {
      setFileName("");
      setGeoJsonData(null);
      setShowPreview(false);
    }
  };

  const readKmlFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Parse the KML content
        const kmlContent = new DOMParser().parseFromString(
          e.target.result,
          "text/xml"
        );

        // Convert to GeoJSON
        const geoJson = kml(kmlContent);
        setGeoJsonData(geoJson);
      } catch (error) {
        console.error("Error parsing KML file:", error);
        alert(
          "Failed to parse the KML file. Please ensure it's a valid KML format."
        );
        setGeoJsonData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];

      if (validateFileType(file)) {
        setFileName(file.name);
        readKmlFile(file);

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      } else {
        alert("Please upload a KML file only.");
        setFileName("");
        setGeoJsonData(null);
        setShowPreview(false);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <>
      <div className="file-upload-container">
        <h2 className="file-upload-title">KML File Uploader</h2>
        <p className="file-upload-description">
          Upload your Keyhole Markup Language (KML) file to visualize geographic
          data
        </p>

        <div
          className="file-input-wrapper"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload KML File</Form.Label>
            <Form.Control
              ref={fileInputRef}
              type="file"
              accept=".kml"
              className={`file-input ${isDragging ? "drag-active" : ""}`}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div
              className={`form-control file-input ${
                isDragging ? "drag-active" : ""
              }`}
            >
              {fileName
                ? fileName
                : "Drag and drop your KML file here or click to browse"}
            </div>
            <span className="file-type-hint">Only KML files are accepted</span>
          </Form.Group>
        </div>

        {fileName && (
          <div className="file-info active">
            <p>
              Selected file: <span className="file-name">{fileName}</span>
            </p>
            <Button
              variant="primary"
              onClick={togglePreview}
              disabled={!geoJsonData}
              className="summary-button"
            >
              {showPreview ? "Hide Summary" : "Show Summary"}
            </Button>
          </div>
        )}
      </div>

      {showPreview && geoJsonData && <Preview geoJsonData={geoJsonData} />}
      {geoJsonData && <Map geoJsonData={geoJsonData} />}
      <Details geoJsonData={geoJsonData} />
    </>
  );
}

export default App;
