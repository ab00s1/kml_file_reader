# KML File Visualizer

## Overview
KML File Visualizer is a React application that allows users to upload and visualize Keyhole Markup Language (KML) files. The application parses the KML file, converts it into GeoJSON format, and displays the geographic data on an interactive map using Leaflet.js.

## Features
- Upload and parse KML files
- Convert KML data to GeoJSON format
- Display geographic features on an interactive Leaflet map
- View detailed information about each feature, including type and length (for line features)
- Toggle between a summary preview and detailed view
- Supports drag-and-drop file uploads

## Technologies Used
- React.js
- Leaflet.js
- React Bootstrap
- Mapbox's `@mapbox/togeojson` library for KML to GeoJSON conversion

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/ab00s1/kml_file_reader.git
   ```
2. Navigate to the project directory:
   ```sh
   cd kml_file_reader
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## File Structure
- `App.jsx`: Main component handling file upload and state management.
- `components/Details.jsx`: Displays detailed information about each geographic feature.
- `components/Preview.jsx`: Provides a summary of KML elements.
- `components/Map.jsx`: Renders the interactive map with GeoJSON data.

## Usage
1. Open the application in your browser.
2. Drag and drop a KML file or click to upload.
3. View a preview of file contents in the summary table.
4. Click "Show Details" to see more in-depth information about each feature.
5. Explore the map to visualize the geographic elements.

### working URL
*https://parse-kml.netlify.app/*
