import React, { useEffect, useContext, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { WebSocketContext } from './WebSocketContext';
import L from 'leaflet';

// Define icon styles
const departureIcon = new L.Icon({
  iconUrl: '/departure-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const destinationIcon = new L.Icon({
  iconUrl: '/destination-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const crashIcon = new L.Icon({
  iconUrl: '/crash-icon.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  className: 'crash-highlight',
});

const planeIcon = new L.Icon({
  iconUrl: '/plane-icon.png',
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

function MapComponent() {
  const { messageHistory } = useContext(WebSocketContext);
  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [crashedFlights, setCrashedFlights] = useState([]);
  const [landingTakeOffEvents, setLandingTakeOffEvents] = useState([]);
  const [flightPaths, setFlightPaths] = useState({});

  // Handle updates to flights and airports
  useEffect(() => {
    const flightEvents = messageHistory.filter(msg => msg.type === 'flights');
    if (flightEvents.length > 0) {
      const latestFlights = flightEvents[flightEvents.length - 1].flights;
      const airportSet = new Set();
      const activeFlights = [];

      Object.values(latestFlights).forEach(flight => {
        airportSet.add(flight.departure.id);
        airportSet.add(flight.destination.id);
        activeFlights.push(flight);
      });

      setAirports(Array.from(airportSet));
      setFlights(activeFlights);
    }
  }, [messageHistory]);

  // Handle updates to planes
  useEffect(() => {
    const planeEvents = messageHistory.filter(msg => msg.type === 'plane');
    const updatedPlanes = planeEvents.map(event => event.plane);
    setPlanes(updatedPlanes);

    // Update flight paths
    const paths = {};
    updatedPlanes.forEach(plane => {
      if (!paths[plane.id]) {
        paths[plane.id] = [];
      }
      paths[plane.id].push([plane.position.lat, plane.position.long]);
    });
    setFlightPaths(paths);
  }, [messageHistory]);

  // Handle updates to crashed flights
  useEffect(() => {
    const crashEvents = messageHistory.filter(msg => msg.type === 'crashed');
    setCrashedFlights(crashEvents);
  }, [messageHistory]);

  // Handle updates for landing and take-off events
  useEffect(() => {
    const landingTakeOffEvents = messageHistory.filter(msg => msg.type === 'landing' || msg.type === 'take-off');
    setLandingTakeOffEvents(landingTakeOffEvents);
  }, [messageHistory]);

  return (
    <MapContainer center={[0, 100]} zoom={2} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render airports */}
      {flights.map(flight => (
        <Marker 
          key={`departure-${flight.departure.id}`} 
          position={[flight.departure.location.lat, flight.departure.location.long]} 
          icon={departureIcon}
        >
          <Popup>
            <strong>Departure Airport:</strong><br />
            ID: {flight.departure.id}<br />
            Name: {flight.departure.name}<br />
            Country: {flight.departure.country}<br />
            City: {flight.departure.city}
          </Popup>
        </Marker>
      ))}

      {flights.map(flight => (
        <Marker 
          key={`destination-${flight.destination.id}`} 
          position={[flight.destination.location.lat, flight.destination.location.long]} 
          icon={destinationIcon}
        >
          <Popup>
            <strong>Destination Airport:</strong><br />
            ID: {flight.destination.id}<br />
            Name: {flight.destination.name}<br />
            Country: {flight.destination.country}<br />
            City: {flight.destination.city}
          </Popup>
        </Marker>
      ))}

      {/* Render flight paths */}
      {flights.map(flight => (
        <Polyline 
          key={`path-${flight.id}`}
          positions={[
            [flight.departure.location.lat, flight.departure.location.long],
            [flight.destination.location.lat, flight.destination.location.long]
          ]}
          color="blue"
        />
      ))}

      {/* Render planes */}
      {planes.map(plane => (
        <Marker 
          key={`plane-${plane.id}`} 
          position={[plane.position.lat, plane.position.long]} 
          icon={planeIcon}
        >
          <Popup>
            <strong>Plane Info:</strong><br />
            Flight ID: {plane.id}<br />
            Airline: {plane.airline}<br />
            Captain: {plane.captain}<br />
            ETA: {plane.eta}<br />
            Status: {plane.status}
          </Popup>
        </Marker>
      ))}

      {/* Render flight paths for planes */}
      {Object.entries(flightPaths).map(([planeId, path]) => (
        <Polyline 
          key={`flight-path-${planeId}`}
          positions={path}
          color="red"
        />
      ))}
    </MapContainer>
  );
}

export default MapComponent;
