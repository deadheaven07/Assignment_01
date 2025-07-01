import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import carIcon from "./carIcon.png";

const vehicleIcon = new L.Icon({
  iconUrl: carIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function App() {
  const [path, setPath] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("http://localhost:5000/location")
        .then((res) => {
          setPath(res.data);
          setError("");
          setLoading(false);
        })
        .catch((err) => {
          setError("Could not fetch vehicle data. Is the backend running?");
          setLoading(false);
        });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const current = path.length > 0 ? path[path.length - 1] : null;

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Vehicle Tracker</h2>
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <MapContainer
        center={[17.385044, 78.486671]}
        zoom={15}
        style={{ height: "80vh" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {path.length > 0 && (
          <>
            <Polyline
              positions={path.map((p) => [p.latitude, p.longitude])}
              color="blue"
            />
            <Marker
              position={[current.latitude, current.longitude]}
              icon={vehicleIcon}
            />
          </>
        )}
      </MapContainer>
      {current && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <strong>Current Timestamp:</strong> {current.timestamp}
        </div>
      )}
    </div>
  );
}

export default App;
