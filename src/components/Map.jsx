import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

const Map = ({ geoJsonData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);

  useEffect(() => {

    if (!mapInstanceRef.current && mapRef.current) {

      mapInstanceRef.current = L.map(mapRef.current).setView([0, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    if (geoJsonData && mapInstanceRef.current) {

      if (geoJsonLayerRef.current) {
        mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
      }


      const styles = {
        Point: {
          radius: 8,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        },
        LineString: {
          color: "#3388ff",
          weight: 3,
          opacity: 0.7,
        },
        Polygon: {
          fillColor: "#7cfc00",
          color: "#006400",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.4,
        },
        MultiLineString: {
          color: "#ff4500",
          weight: 3,
          opacity: 0.7,
        },
        MultiPolygon: {
          fillColor: "#ffd700",
          color: "#8b4513",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.4,
        },
      };


      const styleFunction = (feature) => {
        const featureType = feature.geometry.type;
        return styles[featureType] || {};
      };


      const onEachFeature = (feature, layer) => {
        if (feature.properties) {
          const properties = feature.properties;
          const name = properties.name || "Unnamed feature";
      
          let popupContent = `<div class="feature-popup">
            <h4>${name}</h4>
            <p>Type: ${feature.geometry.type}</p>
          </div>`;
      
          layer.bindPopup(popupContent);
      

          layer.on("click", () => {
            if (mapInstanceRef.current) {
              const map = mapInstanceRef.current;
      
              if (feature.geometry.type === "Point") {

                const latlng = layer.getLatLng();
                map.flyTo(latlng, 14, { duration: 1 }); // Zoom level 14
              } else if (layer.getBounds && layer.getBounds().isValid()) {
                map.flyToBounds(layer.getBounds(), {
                  padding: [50, 50],
                  maxZoom: 14,
                  duration: 1,
                });
              } else {
                console.warn("Layer bounds are invalid or missing.");
              }
            }
          });
        }
      };      
      

      geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
        style: styleFunction,
        onEachFeature: onEachFeature,
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, styles.Point);
        },
      }).addTo(mapInstanceRef.current);      


      try {
        const bounds = geoJsonLayerRef.current.getBounds();
        if (bounds.isValid()) {
          mapInstanceRef.current.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 15,
          });
        }
      } catch (error) {
        console.warn("Unable to fit to bounds:", error);
      }
    }


    return () => {
      if (mapInstanceRef.current) {
        if (geoJsonLayerRef.current) {
          mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
        }
      }
    };
  }, [geoJsonData]);


  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={mapRef} className="map-container"></div>;
};

export default Map;
