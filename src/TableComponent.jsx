import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from './WebSocketContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const styles = {
  container: {
    maxHeight: '400px', // Altura máxima de la tabla
    overflowY: 'auto', // Desplazamiento vertical
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Fondo semitransparente
    margin: '0 auto', // Centrar horizontalmente
    borderRadius: '8px', // Bordes redondeados
  },
  tableCell: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Fondo semitransparente para celdas
    padding: '8px', // Espaciado reducido
  },
};

function TableComponent() {
  const { messageHistory, readyState } = useContext(WebSocketContext);
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const flightEvents = messageHistory.filter(msg => msg.type === 'flights');
    
    if (flightEvents.length > 0) {
      const latestFlights = flightEvents[flightEvents.length - 1].flights;
      const sortedFlights = Object.values(latestFlights).sort((a, b) => {
        const originComparison = a.departure.name.localeCompare(b.departure.name);
        return originComparison !== 0 ? originComparison : a.destination.name.localeCompare(b.destination.name);
      });
      setFlights(sortedFlights);
    }
  }, [messageHistory]);

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        WebSocket is currently {readyState === 1 ? 'Open' : 'Closed'}
      </Typography>

      <Typography variant="h6" component="h3" gutterBottom>
        Active Flights:
      </Typography>

      <div style={styles.container}>
        {flights.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={styles.tableCell}>Flight ID</TableCell>
                  <TableCell style={styles.tableCell}>Departure Airport</TableCell>
                  <TableCell style={styles.tableCell}>Destination Airport</TableCell>
                  <TableCell style={styles.tableCell}>Departure Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flights.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell style={styles.tableCell}>{flight.id}</TableCell>
                    <TableCell style={styles.tableCell}>{flight.departure.name} ({flight.departure.city.name}, {flight.departure.city.country.name})</TableCell>
                    <TableCell style={styles.tableCell}>{flight.destination.name} ({flight.destination.city.name}, {flight.destination.city.country.name})</TableCell>
                    <TableCell style={styles.tableCell}>{new Date(flight.departure_date).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" component="p">
            No flights available.
          </Typography>
        )}
      </div>
    </div>
  );
}

export default TableComponent;
