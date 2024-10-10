import React, { useState, useContext } from 'react';
import { WebSocketContext } from './WebSocketContext';
import { Drawer, IconButton, TextField, Button, List, ListItem, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useTheme } from '@mui/material/styles';

const ChatDrawer = () => {
  const { sendMessage, messageHistory } = useContext(WebSocketContext);
  const [open, setOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const theme = useTheme();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      sendMessage(JSON.stringify({ type: 'chat', content: chatInput }));
      setChatInput('');
    }
  };

  return (
    <div>
      <IconButton
        onClick={toggleDrawer}
        style={{ position: 'fixed', bottom: 20, right: 20, color: theme.palette.primary.main }}
      >
        <ChatIcon />
      </IconButton>

      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <div style={{ width: 300, padding: 20 }}>
          <Typography variant="h5">Chat</Typography>
          <List>
            {messageHistory.map((message, index) => {
              // Mostrar solo eventos del tipo 'message'
              if (message.type === 'message') {
                const { name, content, level, date } = message.message;
                const messageDate = new Date(date).toLocaleString(); // Formato de fecha y hora
                const messageStyle = level === 'warn' ? { color: 'red' } : {};

                return (
                  <ListItem key={index} style={{
                    backgroundColor: theme.palette.background.paper,
                    margin: '10px 0',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: theme.shadows[1],
                  }}>
                    <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                      {name} <span style={{ fontSize: '0.8em', color: 'gray' }}>({messageDate})</span>:
                    </Typography>
                    <Typography variant="body1" style={{ marginLeft: '5px', ...messageStyle }}>
                      {content}
                    </Typography>
                  </ListItem>
                );
              }
              return null; // Ignorar otros tipos de mensajes
            })}
          </List>
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSendMessage}
            style={{ marginTop: 10 }}
          >
            Send
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default ChatDrawer;
