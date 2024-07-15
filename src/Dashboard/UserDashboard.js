import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import Map from "mapmyindia-react";
import { auth, db, logout } from "../firebase/firebase";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [user, loading] = useAuthState(auth);
  const [markers, setMarkers] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const navigate = useNavigate();

  const fetchUserName = useCallback(async () => {
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
    else fetchUserName();
  }, [user, loading, navigate, fetchUserName]);

  // Handler for adding a new marker
  const handleAddMarker = async () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!lat || !lng) {
      alert("Please enter valid coordinates.");
      return;
    }

    const newMarker = {
      position: [lat, lng],
      draggable: true,
      title: "EV Bunk",
      icon: "https://static-00.iconduck.com/assets.00/lightning-icon-1722x2048-vee60qnc.png", // Icon URL for the marker
    };

    try {
      const docRef = await addDoc(collection(db, "evBunks"), {
        position: { lat, lng },
      });
      setMarkers([...markers, newMarker]);
      setLatitude("");
      setLongitude("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add EV Bunk location.");
    }
  };

  // Handler for marker drag end
  const handleMarkerDragEnd = (e, index) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    const updatedMarkers = [...markers];
    updatedMarkers[index].position = [lat, lng];
    setMarkers(updatedMarkers);
    setLatitude(lat.toString());
    setLongitude(lng.toString());
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
          <button className="form-container__addbtn" onClick={handleAddMarker}>
            Add EV Bunk
          </button>
        </div>
        <div className="map-container">
          <Map
            markers={markers.map((marker, index) => ({
              position: marker.position,
              draggable: marker.draggable,
              title: marker.title,
              icon: marker.icon,
              onClick: () => console.log("Marker clicked"),
              onDragend: (e) => handleMarkerDragEnd(e, index),
            }))}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
