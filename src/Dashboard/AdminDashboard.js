import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, docRef } from "firebase/firestore";
import Map from "mapmyindia-react";
import { auth, db, logout } from "../firebase/firebase";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [user, loading] = useAuthState(auth);
  const [markers, setMarkers] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [markerTitle, setMarkerTitle] = useState("");
  const navigate = useNavigate();

  const fetchUserName = useCallback(async () => {
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
    else fetchUserName();
  }, [user, loading, navigate, fetchUserName]);

  
  const handleAddMarker = async () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!lat || !lng || !markerTitle) {
      alert("Please enter valid coordinates and marker title.");
      return;
    }

    const newMarker = {
      position: [lat, lng],
      title: markerTitle,
    };

    try {
      const docRef = await addDoc(collection(db, "evBunks"), {
        position: { lat, lng },
        title: markerTitle,
      });
      setMarkers([...markers, newMarker]);
      setLatitude("");
      setLongitude("");
      setMarkerTitle("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add EV Bunk location.");
    }
  };

  const handleMarkerClick = (marker) => {
    alert(`Marker clicked: ${marker.title}`);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__container">
        <div>
          <button className="admin-dashboard__btn" onClick={logout}>
            Logout
          </button>
        </div>
        <h1>Admin Dashboard</h1>
        <div className="form-container">
          <h2 className="admin-dashboard__heading">
            Add EV Bunk Location on the Map
          </h2>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Latitude"
          />
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Longitude"
          />
          <input
            type="text"
            value={markerTitle}
            onChange={(e) => setMarkerTitle(e.target.value)}
            placeholder="Marker Title"
          />
          <button className="form-container__addbtn" onClick={handleAddMarker}>
            Add EV Bunk
          </button>
        </div>
        <div className="map-container">
          <Map
            markers={markers.map((marker, index) => ({
              position: marker.position,
              title: marker.title,
              onClick: () => handleMarkerClick(marker),
            }))}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
