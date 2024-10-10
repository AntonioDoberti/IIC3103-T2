import React from 'react';
import { WebSocketProvider } from './WebSocketContext';
import TableComponent from './TableComponent';
import ChatDrawer from './ChatDrawer'; // Importa el chat
import MapComponent from './MapComponent';

function App() {
  return (
    <WebSocketProvider>
      <div>
        <h1>WebSocket App</h1>
        <MapComponent/>
        <TableComponent />
        <ChatDrawer />
      </div>
    </WebSocketProvider>
  );
}

export default App;
