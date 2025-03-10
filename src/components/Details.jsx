import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import "./Details.css";

const Details = ({ geoJsonData }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const calculateLength = (coordinates) => {
    // Function to calculate distance between two points using the Haversine formula
    const calculateDistance = (point1, point2) => {
      const toRadians = (degree) => (degree * Math.PI) / 180;
      
      const lon1 = point1[0];
      const lat1 = point1[1];
      const lon2 = point2[0];
      const lat2 = point2[1];
      
      const R = 6371;   // Earth's radius in km
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      return distance;
    };

    let totalLength = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      totalLength += calculateDistance(coordinates[i], coordinates[i + 1]);
    }
    
    return totalLength.toFixed(2);
  };

  const getFeatureDetails = () => {
    if (!geoJsonData || !geoJsonData.features) {
      return [];
    }

    return geoJsonData.features.map((feature, index) => {
      const featureType = feature.geometry.type;
      let length = null;
      
      if (featureType === 'LineString') {
        length = calculateLength(feature.geometry.coordinates);
      } else if (featureType === 'MultiLineString') {
        length = feature.geometry.coordinates
          .map(lineString => calculateLength(lineString))
          .reduce((sum, current) => sum + parseFloat(current), 0)
          .toFixed(2);
      }

      return {
        id: index,
        name: feature.properties?.name || `Feature ${index + 1}`,
        type: featureType,
        length: length
      };
    });
  };

  const featureDetails = getFeatureDetails();
  

  const featureTypeCounts = featureDetails.reduce((acc, feature) => {
    acc[feature.type] = (acc[feature.type] || 0) + 1;
    return acc;
  }, {});

  const getFeatureTypeColor = (type) => {
    const colors = {
      Point: 'primary',
      LineString: 'success',
      Polygon: 'warning',
      MultiPoint: 'info',
      MultiLineString: 'danger',
      MultiPolygon: 'dark'
    };
    return colors[type] || 'secondary';
  };

  return (
    <div className="details-container">
      <Button 
        variant="primary" 
        onClick={toggleDetails} 
        className="details-button"
        disabled={!geoJsonData}
      >
        {showDetails ? "Hide Details" : "Show Details"}
      </Button>
      
      {showDetails && geoJsonData && (
        <Card className="mt-3 details-card">
          <Card.Header>
            <h3>KML Element Details</h3>
            <div className="feature-summary">
              {Object.entries(featureTypeCounts).map(([type, count]) => (
                <Badge 
                  key={type} 
                  bg={getFeatureTypeColor(type)} 
                  className="me-2"
                >
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {featureDetails.map((feature) => (
                <ListGroup.Item key={feature.id} className="feature-item">
                  <div className="feature-header">
                    <Badge bg={getFeatureTypeColor(feature.type)} className="feature-type-badge">
                      {feature.type}
                    </Badge>
                    <h5 className="feature-name">{feature.name}</h5>
                  </div>
                  {feature.length && (
                    <div className="feature-length">
                      <span className="length-label">Length:</span> {feature.length} km
                    </div>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Details;
