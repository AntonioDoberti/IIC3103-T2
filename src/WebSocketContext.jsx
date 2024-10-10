import React, { createContext, useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

// Crear el contexto de WebSocket
export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socketUrl] = useState('wss://tarea-2.2024-2.tallerdeintegracion.cl/connect');
  const [messageHistory, setMessageHistory] = useState([]);
  const isJoined = useRef(false); // Controlar si ya se envió el evento JOIN

  // Datos de usuario (ajusta esto con tu información)
  const userId = '19640501'; // Reemplaza con tu ID real
  const username = 'AntonioDoberti'; // Opcional, puedes dejarlo vacío o usar tu nombre

  const {
    sendMessage,
    lastMessage,
    readyState,
    getWebSocket
  } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true, // Intentar reconectar si se desconecta
    reconnectAttempts: 10, // Número máximo de intentos de reconexión
    reconnectInterval: 3000, // Esperar 3 segundos entre intentos
  });

  // Enviar el evento JOIN al conectarse, solo una vez
  useEffect(() => {
    if (readyState === ReadyState.OPEN && !isJoined.current) {
      // Enviar el evento JOIN
      const joinEvent = {
        type: 'join',
        id: userId,
        username: username // Este es opcional, puedes eliminar esta línea si no deseas enviar un nombre
      };
      
      sendMessage(JSON.stringify(joinEvent));
      isJoined.current = true; // Marcar que el evento JOIN ya fue enviado
    }
  }, [readyState, sendMessage]);

  // Manejo de los mensajes entrantes
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const messageData = JSON.parse(lastMessage.data);
        setMessageHistory((prev) => [...prev, messageData]);
      } catch (error) {
        console.error('Error al procesar el mensaje:', error);
      }
    }
  }, [lastMessage]);

  // Limpiar al desmontar el componente (no necesitas enviar un evento para esto en este caso)
  useEffect(() => {
    return () => {
      if (readyState === ReadyState.OPEN) {
        console.log("Cerrando conexión WebSocket");
      }
    };
  }, [readyState]);

  return (
    <WebSocketContext.Provider value={{ messageHistory, readyState, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
