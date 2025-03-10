import React, { useMemo } from "react";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import "./Preview.css";

const Preview = ({ geoJsonData }) => {
  const elementCounts = useMemo(() => {
    if (!geoJsonData) return {};

    const counts = {
      Point: 0,
      LineString: 0,
      Polygon: 0,
      MultiPoint: 0,
      MultiLineString: 0,
      MultiPolygon: 0,
      GeometryCollection: 0,
      Folder: 0,
      Document: 0,
      Placemark: 0,
      Total: 0,
    };

    const processFeature = (feature) => {
      if (!feature) return;

      counts.Total++;

      if (feature.geometry) {

        if (
          feature.geometry.type &&
          counts.hasOwnProperty(feature.geometry.type)
        ) {
          counts[feature.geometry.type]++;
        }

        else if (
          feature.geometry.type === "GeometryCollection" &&
          feature.geometry.geometries &&
          Array.isArray(feature.geometry.geometries)
        ) {
          counts.GeometryCollection++;

          feature.geometry.geometries.forEach((geom) => {
            if (geom.type && counts.hasOwnProperty(geom.type)) {
              counts[geom.type]++;
            }
          });
        }
      }

      if (feature.properties) {

        if (feature.properties.type) {
          const type = feature.properties.type;
          counts[type] = (counts[type] || 0) + 1;
        }

        if (
          feature.properties.features &&
          Array.isArray(feature.properties.features)
        ) {
          feature.properties.features.forEach(processFeature);
        }

        if (
          feature.properties.folders &&
          Array.isArray(feature.properties.folders)
        ) {
          counts.Folder += feature.properties.folders.length;
          feature.properties.folders.forEach((folder) => {
            if (folder.features) {
              folder.features.forEach(processFeature);
            }
            if (folder.folders) {
              folder.folders.forEach((subFolder) => processFeature(subFolder));
            }
          });
        }

        if (
          feature.properties.placemarks &&
          Array.isArray(feature.properties.placemarks)
        ) {
          counts.Placemark += feature.properties.placemarks.length;
          feature.properties.placemarks.forEach((placemark) =>
            processFeature(placemark)
          );
        }
      }
    };


    if (geoJsonData.features && Array.isArray(geoJsonData.features)) {
      geoJsonData.features.forEach(processFeature);
    } else {
      processFeature(geoJsonData);
    }


    if (geoJsonData.properties) {
      if (
        geoJsonData.properties.documents &&
        Array.isArray(geoJsonData.properties.documents)
      ) {
        counts.Document += geoJsonData.properties.documents.length;
        geoJsonData.properties.documents.forEach((doc) => {
          if (doc.features) doc.features.forEach(processFeature);
          if (doc.folders)
            doc.folders.forEach((folder) => processFeature(folder));
        });
      }

      if (
        geoJsonData.properties.folders &&
        Array.isArray(geoJsonData.properties.folders)
      ) {
        counts.Folder += geoJsonData.properties.folders.length;
        geoJsonData.properties.folders.forEach((folder) => {
          if (folder.features) folder.features.forEach(processFeature);
          if (folder.folders)
            folder.folders.forEach((subFolder) => processFeature(subFolder));
        });
      }
    }

    const filteredCounts = {};
    Object.entries(counts).forEach(([key, value]) => {
      if (value > 0 || key === "Total") {
        filteredCounts[key] = value;
      }
    });

    return filteredCounts;
  }, [geoJsonData]);

  return (
    <div className="preview-container">
      <Card>
        <Card.Header as="h5">KML File Summary</Card.Header>
        <Card.Body>
          <Card.Title>Element Types in KML File</Card.Title>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Element Type</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(elementCounts).map(([type, count]) => (
                <tr key={type} className={type === "Total" ? "total-row" : ""}>
                  <td>{type}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="kml-note">
            <p>
              <strong>Note:</strong> Counts may include both KML-specific
              elements (Folders, Documents, Placemarks) and GeoJSON geometry
              types (Points, LineStrings, Polygons).
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Preview;
